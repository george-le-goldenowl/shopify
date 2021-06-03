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
	    }

	    public function initialize($store)
	    {	
	    	$config = SHOPIFY_DATA::get_pace_config($store);
	    	self::get_payment_plans($store, $config);
	    }

	    public static function webhooks_callback(WP_REST_Request $request)
	    {
	    	$params = $request->get_params();
	    	$store = SHOPIFY_DATA::getShopify($params['shop']);

	    	try {
	    		if (isset($params['status']) && 'success' !== $params['status']) {
	    			throw new Exception('Unsuccessfully handle webhooks callback');
	    		}

	    		switch ($params['event']) {
	    			case 'cancelled':
	    				SHOPIFY::cancelled_order($store, $params);
	    				break;
	    			case 'approved':
	    				SHOPIFY::completed_order($store, $params);
	    				break;
	    			default:
	    				// code...
	    				break;
	    		}
	    	} catch (Exception $e) {
	    		error_log($e->getMessage());
	    	}
	    }

	    public static function get_payment_plans($store, $config)
	    {
	    	$mode = self::get_mode($config);
	    	
	    	if (isset($mode) && !empty($mode)) {

	    		if (!isset($config[$mode . '_payment_plans'])) {
	    			$response = HTTP_CLIENT::pace('/checkouts/plans', $config);

	    			if (201 < $response['code']) {
	    				return;
	    			}

	    			update_post_meta( $store->ID, $mode . '_payment_plans', $response['results'] );

	    			return $response['results'];
	    		}

	    		return $config[$mode . '_payment_plans'];;
	    	}

	    	return;
	    }

	    public static function get_mode($config)
	    {
	    	if (isset($config['enable_playground']) && 'on' == $config['enable_playground']) {
	    	 	return 'playground';
	    	} elseif (isset($config['enable']) && 'on' == $config['enable']) {
	    		return 'production';
	    	} else {
	    		return '';
	    	}
	    }

	    public static function is_available($store, $config, $params)
	    {
	    	$plans = self::get_payment_plans($store, $config);

	    	if (!$plans) {
	    		return;
	    	}

	    	$plansJson = json_decode( $plans );
	    	$plansList = $plansJson->list;
	    	$shopifyStore = json_decode( $config['store'] );
	    	$listAvailableCurrencies = array();

	    	foreach ($plansList as $plan) {
	    		$listAvailableCurrencies[$plan->currencyCode] = $plan;
	    	}

	    	if (!in_array($shopifyStore->currency, array_keys($listAvailableCurrencies))) {
	    		return;
	    	}

	    	$availablePlan = $listAvailableCurrencies[$shopifyStore->currency];

	    	if ($availablePlan->country !== $shopifyStore->country_code) {
	    		return;
	    	}

	    	$amount = self::unit_cents($params['total_price']);

	    	if (
	    		$amount < $availablePlan->minAmount->value || 
				$amount > $availablePlan->maxAmount->value 
			) {
	    		return;
	    	}

	    	return true;
	    }

	    public static function create_transaction($store, $params)
	    {	
	    	try {
	    		if (is_null($params['gateway']) || $params['gateway'] !== PACE_GATEWAY_NAME) {
	    			throw new Exception('Invalid payment gateway');	
	    		}

	    		$config = SHOPIFY_DATA::get_pace_config($store);

	    		if (!self::is_available($store, $config, $params)) {
	    			throw new Exception('Pace payment gateway is not available');
	    		}

				$args = array(
					'items' => self::get_pace_items($params['line_items']),
					'amount' => self::unit_cents($params['total_price']),
					'currency' => $params['currency'],
					'webhookUrl' => get_rest_url(null, 'pace/v1/webhook-callback/' . $params['shop']),
					'referenceID' => (string) $params['id'],
					'redirectUrls' => self::get_pace_redirect(),
					'billingAddress' => self::get_pace_billing($params['billing_address']),
					'shippingAddress' => self::get_pace_shipping($params['shipping_address'])
				);
				$response = HTTP_CLIENT::pace('/checkouts', $config, 'POST', $args);

				if (201 < $response['code']) {
					$message = isset($response['resultsJson']) ? $response['resultsJson']->error->message . ' code: ' . $response['resultsJson']->correlation_id : $response['message'];
					throw new Exception($message);
				}
				// Send the payment link of the transaction
				add_post_meta( $store->ID, 'transactions', $response['results'], false );
				$options  = array(
					'TransactionID' => $response['resultsJson']->transactionID,
					'email' => $params['email'],
					'phone' => $params['phone']
				);
				$endpoint = '/checkouts/' . $response['resultsJson']->transactionID . '/send_payment_link';
				$response = HTTP_CLIENT::pace($endpoint, $config, 'POST', $options );

				if (201 < $response['code']) {
					throw new Exception($response['message']);
				}
	    	} catch (Exception $e) {
	    		error_log($e->getMessage());
	    	}
	    }
	}
}