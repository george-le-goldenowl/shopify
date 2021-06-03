<?php

if (!defined('ABSPATH')) {
	return;
}

if (!class_exists('HTTP_CLIENT')) {
	
	/**
	 * Http client class
	 */
	class HTTP_CLIENT
	{
	    public static function shopify($endpoint, $token, $method = 'GET', $options = array())
	    {	
	    	$args = array(
	    		'method' => $method,
	    		'headers' => array(
	    			'Content-Type' => 'application/json', 
	    			'X-Shopify-Access-Token' => $token
	    		)
	    	);

	    	if ($options) {
	    		$args['body'] = json_encode($options);
	    	}

	    	$response = wp_remote_request( $endpoint, $args );

	    	return array(
	    		'code' => wp_remote_retrieve_response_code( $response ),
	    		'message' => wp_remote_retrieve_response_message( $response ),
	    		'results' => wp_remote_retrieve_body( $response ),
	    		'resultsJson' => json_decode( wp_remote_retrieve_body( $response ) )
	    	);
	    }

	    public static function pace($endpoint, $config, $method = 'GET', $options = array())
	    {	
	    	$args = array(
	    		'method' => $method,
	    		'headers' => self::get_pace_headers($config)
	    	);

	    	if ($options) {
	    		$args['body'] = json_encode($options);
	    	}

	    	$response = wp_remote_request( self::get_pace_prefix($config) . '/v1' . $endpoint, $args );

	    	return array(
	    		'code' => wp_remote_retrieve_response_code( $response ),
	    		'message' => wp_remote_retrieve_response_message( $response ),
	    		'results' => wp_remote_retrieve_body( $response ),
	    		'resultsJson' => json_decode( wp_remote_retrieve_body( $response ) )
	    	);
	    }

	    protected static function get_pace_headers($config)
	    {
	    	return array(
	    		'user-agent' => $_SERVER['HTTP_USER_AGENT'],
	    		'content-type' => 'application/json',
	    		'pace-version' => PACE_SHOPIFY_PLUGIN_VERSION,
	    		'authorization' => 'Basic ' . self::get_pace_auth($config),
	    		'x-pace-platformversion' => sprintf( '%s-%s, %s, %s', PACE_SHOPIFY_PLUGIN_NAME, 'shopify', PACE_SHOPIFY_PLUGIN_VERSION, SHOPIFY_API_VERSION )
	    	);
	    }

	    protected static function get_pace_prefix($config)
	    {
	    	if (isset($config->enable_playground) && 'on' == $config->enable_playground) {
	    		return 'https://api-playground.pacenow.co';
	    	} elseif (isset($config->enable) && 'on' == $config->enable) {
	    		return 'https://api.pacenow.co';
	    	} else {
	    		return '';
	    	}
	    }

	    protected static function get_pace_auth($config)
	    {
	    	if (isset($config->enable_playground) && 'on' == $config->enable_playground) {
	    		if (
	    			(isset($config->playground_client_id) || !empty($config->playground_client_id)) &&
	    			(isset($config->playground_client_secret) || !empty($config->playground_client_secret))
	    		) {
	    			return base64_encode($config->playground_client_id . ':' . $config->playground_client_secret);
	    		}
	    	} elseif (isset($config->enable) && 'on' == $config->enable) {
	    		if (
	    			(isset($config->pace_client_id) || !empty($config->pace_client_id)) &&
	    			(isset($config->pace_client_secret) || !empty($config->pace_client_secret))
	    		) {
	    			return base64_encode($config->pace_client_id . ':' . $config->pace_client_secret); 
	    		}
	    	} else {
	    		return '';
	    	}
	    }
	}
}