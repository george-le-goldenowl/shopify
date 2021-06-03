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
	    		foreach ($_POST as $key => $value) {
	    			update_post_meta( $this->store->ID, $key, untrailingslashit( $value ) );
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