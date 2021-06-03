<?php

if (!defined('ABSPATH')) {
	return;
}

if (!function_exists('shopify_oauth')) {
	
	function shopify_oauth()
	{
		try {
			if (!isset($_GET['shop']) || empty($_GET['shop'])) {
				throw new Exception('Unknow shop');
			}

			$shop = untrailingslashit( $_GET['shop'] );
			$store = SHOPIFY_DATA::getShopify($shop);

			if (!$store) {
				throw new Exception('Unknow store');
			}

			$nonce = wp_create_nonce( 'shopify_oauth');
			$scopes = 'read_orders,write_orders,write_script_tags,read_themes,write_themes';
			$api_key = get_post_meta( $store->ID, 'client_id', true );
			$callback = site_url( 'shopify/callback' );

			$prompt = str_replace(
				array('{shop}', '{api_key}', '{scopes}', '{redirect_uri}', '{nonce}', '{access_mode}'), 
				array($shop, $api_key, $scopes, $callback, $nonce, 'online'),
				'https://{shop}/admin/oauth/authorize?client_id={api_key}&scope={scopes}&redirect_uri={redirect_uri}&state={nonce}&grant_options[]={access_mode}'
			);
			wp_redirect( $prompt );
			die();

		} catch (Exception $e) {
			error_log($e->getMessage());
			redirect_404();
		}
	}

	shopify_oauth();
}