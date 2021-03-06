<?php

if (!defined('ABSPATH')) {
	return;
}

define('SHOPIFY_API_PREFIX', 'https://{shop}/admin/api/');
define('SHOPIFY_API_VERSION', '2021-04');
define('SHOPIFY_API_ENDPOINT', SHOPIFY_API_PREFIX . SHOPIFY_API_VERSION);

if (!class_exists('SHOPIFY')) {
	
	/**
	 * Shopify class
	 */
	class SHOPIFY
	{	
		const SHOPIFY_TOKEN = 'https://{shop}/admin/oauth/access_token';
		const SHOPIFY_WEBHOOKS = 'orders/create,app/uninstalled';

		/**
		 * @var string
		 */
		public $shop;

		/**
		 * @var string
		 */
		protected $token;

		/**
         * @var Singleton The reference the *Singleton* instance of this class
         */
        private static $instance;

        /**
         * Returns the *Singleton* instance of this class.
         *
         * @return Singleton The *Singleton* instance.
         */
        public static function get_instance()
        {
            if (null === self::$instance) {
                self::$instance = new self();
            }
            return self::$instance;
        }

        public function __construct()
        {
        	$this->shop = untrailingslashit( esc_attr( $_GET['shop'] ) );
        }

	    public function initialize($store)
	    {
	    	$this->get_token($store);
	    	$this->get_store_config($store);
	    	$this->register_webhooks($store);
	    }

	    public static function webhooks_action(WP_REST_Request $request)
	    {
	    	$params = $request->get_params();
	    	$store = SHOPIFY_DATA::getShopify($params['shop']);

	    	try {
	    		if (!$store) {
	    			throw new Exception('Unknow store');
	    		}

	    		// $token = get_post_meta( $store->ID, 'access_token', true );

	    		switch ($params['topic']) {
		    		case 'orders/create':
		    			PACE::create_transaction($store, $params);
		    			break;
		    		case 'app/uninstalled':
		    			self::uninstalled($store, $params);
		    			break;
		    		default:
		    			// code...
		    			break;
		    	}
	    	} catch (Exception $e) {
	    		error_log($e->getMessage());
	    	}
	    }

	    public static function uninstalled($store, $params)
	    {	
	    	$code = wp_hash( $params['shop'] );
	    	SHOPIFY_DATA::delete_shopify($params['shop']);
	    	wp_delete_file( PACE_SHOPIFY_PLUGIN_PATH . '/locked/config-' . $code . '.json' );
	    }

	    public static function cancelled_order($store, $params)
	    {
	    	try {
	    		$token = get_post_meta( $store->ID, 'access_token', true );
	    		$endpoint = str_replace('{shop}', $params['shop'], SHOPIFY_API_ENDPOINT . '/orders/');
	    		$endpoint = $endpoint . $params['referenceID'] . '/cancel.json';
	    		$response = HTTP_CLIENT::shopify($endpoint, $token, 'POST');

	    		if (200 !== $response['code']) {
	    			throw new Exception($response['message']);
	    		}
	    	} catch (Exception $e) {
	    		error_log($e->getMessage());
	    	}
	    }

	    public static function completed_order($store, $params)
	    {
	    	try {
	    		$token = get_post_meta( $store->ID, 'access_token', true );
	    		$options = array(
	    			'transaction' => array(
	    				'kind' => 'capture',
	    				'authorization' => 'authorization-key'
	    			)
	    		);
	    		$endpoint = str_replace('{shop}', $params['shop'], SHOPIFY_API_ENDPOINT . '/orders/');
	    		$endpoint = $endpoint . $params['referenceID'] . '/transactions.json';
	    		$response = HTTP_CLIENT::shopify($endpoint, $token, 'POST', $options);

	    		if (200 !== $response['code']) {
	    			throw new Exception($response['message']);
	    		}
	    	} catch (Exception $e) {
	    		error_log($e->getMessage());	
	    	}
	    }

	    protected function get_token($store)
	    {
	    	$config = shopify_get_config($this->shop);
	    	
	    	if (isset($config['token']) && 1 == $config['token']) {
	    		$this->token = get_post_meta( $store->ID, 'access_token', true );
	    		return;
	    	}
	    	
	    	$url = str_replace('{shop}', $this->shop, self::SHOPIFY_TOKEN);
	    	$client_id = get_post_meta( $store->ID, 'client_id', true );
	    	$client_secret = get_post_meta( $store->ID, 'client_secret', true );
	    	
	    	try {
	    		$response = wp_remote_post( $url, array( 
		    		'body' => array(
		    			'code' => untrailingslashit( esc_attr( $_GET['code'] ) ),
		    			'client_id' => $client_id,
		    			'client_secret' => $client_secret
		    		)
		    	) );

		    	if (201 < wp_remote_retrieve_response_code( $response )) {
		    		throw new Exception(wp_remote_retrieve_response_message( $response ));
		    	}

		    	$responseJson = json_decode( wp_remote_retrieve_body( $response ) );
		    	$this->token = $responseJson->access_token;
		    	update_post_meta( $store->ID, 'access_token', $responseJson->access_token );
		    	shopify_put_config($this->shop, 'token', 1);
	    	} catch (Exception $e) {
	    		error_log($e->getMessage());
	    	}
	    }

	    protected function get_store_config($store)
	    {
	    	$config = shopify_get_config($this->shop);

	    	try {
	    		if (isset($config['store']) && 1 == $config['store']) {
		    		return;
		    	}

		    	$endpoint = str_replace('{shop}', $this->shop, SHOPIFY_API_ENDPOINT . '/shop.json');
		    	$response = HTTP_CLIENT::shopify($endpoint, $this->token);

		    	if (200 < $response['code']) {
		    		throw new Exception($response['message']);
		    	}

		    	update_post_meta( $store->ID, 'store', json_encode($response['resultsJson']->shop) );
		    	shopify_put_config($this->shop, 'store', 1);
	    	} catch (Exception $e) {
	    		error_log($e->getMessage());
	    	}
	    }

	    protected function register_webhooks($store)
	    {
	    	$config = shopify_get_config($this->shop);
	    	$webhooks = explode(',', self::SHOPIFY_WEBHOOKS);

	    	try {
	    		foreach ($webhooks as $hook) {
		    		if ( !isset($config['webhooks']) ||
		    			( isset($config['webhooks']) && !in_array($hook, explode(',', $config['webhooks'])) )
		    		) {
		    			$options = array(
			    			'webhook' => array(
			    				'topic' => $hook,
			    				'format' => 'json',
			    				'address' => get_rest_url( null, 'shopify/v1/webhooks/' . $this->shop . '/' . $hook ),
			    			)
		    			);
			    		$endpoint = str_replace('{shop}', $this->shop, SHOPIFY_API_ENDPOINT . '/webhooks.json');
			    		$response = HTTP_CLIENT::shopify($endpoint, $this->token, 'POST', $options);
			    		
			    		if (201 === $response['code']) {
			    			shopify_put_config($this->shop, 'webhooks', $hook, true);
			    		}
		    		}
		    	}
	    	} catch (Exception $e) {
	    		error_log($e->getMessage());
	    	}
	    }
	}
}