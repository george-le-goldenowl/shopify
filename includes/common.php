<?php

if (!function_exists('redirect_404')) {
	
	function redirect_404()
	{
		global $wp_query;
		$wp_query->set_404();
		status_header( 404 );
		get_template_part( 404 ); 
		exit();
	}
}

if (!function_exists('shopify_get_config')) {
	
	function shopify_get_config($shop)
	{
		$code = wp_hash( $shop );
		$content = file_get_contents(PACE_SHOPIFY_PLUGIN_PATH . '/locked/config-' . $code . '.json');

		return json_decode( $content, true );
	}
}

if (!function_exists('shopify_put_config')) {
	
	function shopify_put_config($shop, $name, $value, $multi = false)
	{
		$content = shopify_get_config($shop);

		if ($multi) {
			if (isset($content[$name])) {
				$content[$name] = explode(',', $content[$name]);
				$content[$name][] = $value;
				$content[$name] = join(',', $content[$name]);	
			} else {
				$content[$name] = $value;
			}
		} else {
			$content[$name] = $value;
		}
		
		$code = wp_hash( $shop );
		file_put_contents(PACE_SHOPIFY_PLUGIN_PATH . '/locked/config-' . $code . '.json', json_encode($content));
	}
}