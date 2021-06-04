<?php

if (!defined('ABSPATH')) {
	return;
}

if (!class_exists('SHOPIFY_CALLBACK')) {
	
	/**
	 * Shopify callback class
	 */
	class SHOPIFY_CALLBACK
	{	
		/**
		 * @var object
		 */
		public $store;

		protected $apps_secret;

	    /**
	     * summary
	     */
	    public function __construct()
	    {
	    	$shop = untrailingslashit( esc_attr( $_GET['shop'] ) );
	    	$this->store = SHOPIFY_DATA::getShopify($shop);
	    	$this->apps_secret = get_post_meta( $this->store->ID, 'client_secret', true );
	    	// create locked file before security hmac
	    	$this->create_locked_file($shop);
	        $this->check_security();
	        $this->save_config();
	        $this->init();
	    }

	    public function create_locked_file($shop)
	    {
	    	$code = wp_hash( $shop );
	    	$file = PACE_SHOPIFY_PLUGIN_PATH . '/locked/config-' . $code . '.json';
	    	
	    	if (!is_file($file)) {
	    		fopen($file, 'w');
	    	}
	    }

	    public function check_security()
	    {
	    	try {
	    		$nonce = untrailingslashit( esc_attr( $_GET['state'] ) );

	    		// verify nonce
	    		if (!wp_verify_nonce( $nonce, 'shopify_oauth' )) {
	    			throw new Exception('Invalid nonce.');
	    		}

	    		// verify hmac
	    		$hmac = untrailingslashit( esc_attr( $_GET['hmac'] ) );
	    		unset($_GET['hmac']);
	    		$signature = build_query( $_GET );
	    		$generateHmac = hash_hmac( 'sha256', $signature, $this->apps_secret, $raw_output = false );

	    		if ($generateHmac !== $hmac) {
	    			throw new Exception('Invalid hmac.');
	    		}
	    	} catch (Exception $e) {
	    		error_log($e->getMessage());
	    		return;
	    	}
	    }

	    public function save_config()
	    {
	    	if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	    		$oldConfig = SHOPIFY_DATA::get_pace_config($this->store);

	    		foreach ($_POST as $key => $value) {
	    			update_post_meta( $this->store->ID, $key, untrailingslashit( $value ) );
	    		}

	    		$config = SHOPIFY_DATA::get_pace_config($this->store);
	    		$mode = PACE::get_mode($config);

	    		if (!empty($mode)) {
	    			switch ($mode) {
	    				case 'playground':
	    					$old_playground_id = isset($oldConfig['playground_client_id']) ? $oldConfig['playground_client_id'] : '';
			    			$old_playground_secret = isset($oldConfig['playground_client_secret']) ? $oldConfig['playground_client_secret'] : '';
			    			$playground_id = isset($config['playground_client_id']) ? $config['playground_client_id'] : '';
			    			$playground_secret = isset($config['playground_client_secret']) ? $config['playground_client_secret'] : '';

	    					if (
	    						0 !== strcmp($old_playground_id, $playground_id) || 
	    						0 !== strcmp($old_playground_secret, $playground_secret)
	    					) {
	    					 	delete_post_meta( $this->store->ID, 'playground_payment_plans' );
	    					}
	    					break;
	    				case 'production':
	    					$old_client_id = isset($oldConfig['pace_client_id']) ? $oldConfig['pace_client_id'] : '';
	    					$old_client_secret = isset($oldConfig['pace_client_secret']) ? $oldConfig['pace_client_secret'] : '';
	    					$client_id = isset($config['pace_client_id']) ? $config['pace_client_id'] : '';
	    					$client_secret = isset($config['pace_client_secret']) ? $config['pace_client_secret'] : '';
	    					
	    					if (
	    						0 !== strcmp($old_client_id, $client_id) || 
	    						0 !== strcmp($old_client_secret, $client_secret)
	    					) {
	    						delete_post_meta( $this->store->ID, 'production_payment_plans' );
	    					}
	    					break;
	    				default:
	    					// code...
	    					break;
	    			}
	    		}
	    	}
	    }

	    public function init()
	    {
	    	$shopify = SHOPIFY::get_instance();
	    	$shopify->initialize($this->store);
	    	$pace = PACE::get_instance();
	    	$pace->initialize($this->store);

	    	$this->rendered_pace_setting();
	    }

	    public function rendered_pace_setting()
	    {
	    	$shopSetting = SHOPIFY_DATA::get_pace_config($this->store);
	    	require_once PACE_SHOPIFY_PLUGIN_PATH . '/public/template/setting.php';
	    }
	}

	new SHOPIFY_CALLBACK();
}