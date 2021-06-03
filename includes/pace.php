<?php

if (!defined('ABSPATH')) {
	return;
}

define('PACE_GATEWAY_NAME', 'Pay with Pace');

if (!class_exists('PACE')) {
	
	require_once 'abstract/class-pace-abstract.php';

	/**
	 * Pace class
	 */
	class PACE extends PACE_ABSTRACT
	{
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

	    /**
	     * summary
	     */
	    public function __construct()
	    {
	        $this->is_available();
	    }

	    public function initialize($store)
	    {	
	    	$config = SHOPIFY_DATA::get_pace_config($store);
	    	$this->get_payment_plans($store, $config);
	    }

	    public function get_payment_plans($store, $config)
	    {
	    	$mode = self::get_mode($config);

	    	if (isset($mode) && !empty($mode)) {
	    		$plans = $config[$mode . '_payment_plans'];

	    		if (!$plans) {
	    			$response = HTTP_CLIENT::pace('/checkouts/plans', $config);

	    			if (201 < $response['code']) {
	    				return;
	    			}

	    			update_post_meta( $store->ID, $mode . '_payment_plans', $response['results'] );

	    			return $response['resultsJson'];
	    		}

	    		return $plans;
	    	}

	    	return;
	    }

	    public static function get_mode($config)
	    {
	    	if (isset($config->enable_playground) && 'on' == $config->enable_playground) {
	    	 	return 'playground';
	    	} elseif (isset($config->enable) && 'on' == $config->enable) {
	    		return 'production';
	    	} else {
	    		return '';
	    	}
	    }

	    public static function is_available()
	    {
	    	
	    }

	    public static function create_transaction($store, $params)
	    {
	    	try {
	    		if (is_null($params['gateway']) || $params['gateway'] !== PACE_GATEWAY_NAME) {
	    			throw new Exception('Invalid payment gateway');	
	    		}

				$args = array(
					'items' => self::get_pace_items($params['line_items']),
					'amount' => self::unit_cents($params['total_price']),
					'currency' => $params['currency'],
					// 'webhookUrl' => self::get_pace_webhooks(),
					'referenceID' => $params['id'],
					'redirectUrls' => self::get_pace_redirect(),
					'billingAddress' => self::get_pace_billing($params['billing_address']),
					'shippingAddress' => self::get_pace_shipping($params['shipping_address'])
				);
				$config = SHOPIFY_DATA::get_pace_config($store);
				$endpoint = array();
				$response = HTTP_CLIENT::pace('/checkouts', $store, 'POST', $args);

				if (201 < $response['code']) {
					$message = isset($response['resultsJson']) ? $response['resultsJson']->error->message . ' code: ' . $response['resultsJson']->correlation_id : $response['message'];
					throw new Exception($message);
				}

				// Send the payment link of the transaction
				$endpoint = '/checkouts/' . $response['resultsJson']->transactionID . '/send_payment_link';
				$response = HTTP_CLIENT::pace($endpoint, $config, 'POST' );

				if (201 < $response['code']) {
					throw new Exception($response['message']);
				}
	    	} catch (Exception $e) {
	    		error_log($e->getMessage());
	    	}
	    }
	}
}