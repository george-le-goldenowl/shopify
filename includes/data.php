<?php

if (!defined('ABSPATH')) {
	return;
}

if (!class_exists('SHOPIFY_DATA')) {
	
	/**
	 * Shopify data class
	 */
	class SHOPIFY_DATA
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

	    public static function getShopify($shop)
	    {
	    	global $wpdb;
	    	try {
	    		$query = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}posts WHERE post_title = '$shop'");

	    		if (null === $query) {
	    			throw new Exception('Not found shopify URL');
	    		}

	    		return $query;
	    	} catch (Exception $e) {
	    		error_log($shop . ': ' . $e->getMessage());
	    		return;
	    	}
	    }

	    public static function get_pace_config($store)
	    {
	    	global $wpdb;
	    	$results = $wpdb->get_results(
	    		$wpdb->prepare(
	    			"SELECT meta_key,meta_value FROM {$wpdb->prefix}postmeta WHERE post_id = %d", $store->ID
	    		)
	    	);

	    	$merge = array();

	    	if ($results) {
	    		foreach ($results as $result) {
	    			$merge[$result->meta_key] = $result->meta_value;
	    		}
	    	}
	    	
	    	return $merge;
	    }

	    public static function delete_shopify($shop)
	    {
	    	global $wpdb;
	    	$wpdb->query(
	    		"DELETE p,pm FROM {$wpdb->prefix}posts p INNER JOIN {$wpdb->prefix}postmeta pm ON p.ID = pm.post_id WHERE p.post_title = '{$shop}'"
	    	);
	    }
	}

	SHOPIFY_DATA::get_instance();
}