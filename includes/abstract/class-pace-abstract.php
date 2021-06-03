<?php

if (!defined('ABSPATH')) {
	return;
}

if (!class_exists('PACE_ABSTRACT')) {
	
	abstract class PACE_ABSTRACT
	{
		public static function unit_cents( $price ) {
			$cents = intval(strval(floatval(preg_replace("/[^0-9.]/", "", $price) * 100)));

			return apply_filters( 'woocommerce_pace_convert_unitcents', $cents );
		}

	    public static function get_pace_items($line_items)
	    {
	    	if (empty($line_items)) {
	    		return array();
	    	}

	    	$items = array();

	    	foreach ($line_items as $item) {
	    		array_push($items, array(
	    			'itemID' => $item->product_id,
	    			'itemType' => '',
	    			'name' => $item->name,
	    			'quantity' => $item->quantity,
	    			'unitPrice' => self::unit_cents($item->price),
	    			'productUrl' => '',
	    			'imageUrl' => '',
	    			'brand' => '',
	    			'tags' => ''
	    		));
	    	}

	    	return $items;
	    }

	    public static function get_pace_redirect()
	    {
	    	return array(
	    		'success' => '',
	    		'cancelled' => '',
	    		'failed' => ''
	    	);
	    }

	    public static function get_pace_billing($billing_address)
	    {
	    	return array(
	    		'firstName' => $billing_address->first_name,
	    		'lastName' => $billing_address->Biller,
	    		'addr1' => $billing_address->address1,
	    		'addr2' => $billing_address->address2 ?? '',
	    		'city' => $billing_address->city,
	    		'state' => $billing_address->province,
	    		'region' => '',
	    		'postalCode' => $billing_address->zip,
	    		'countryIsoCode' => $billing_address->country_code,
	    		'phone' => $billing_address->phone,
	    		'email' => ''
	    	);
	    }

	    public static function get_pace_shipping($shipping_address)
	    {
	    	return array(
	    		'firstName' => $shipping_address->first_name,
	    		'lastName' => $shipping_address->Biller,
	    		'addr1' => $shipping_address->address1,
	    		'addr2' => $shipping_address->address2 ?? '',
	    		'city' => $shipping_address->city,
	    		'state' => $shipping_address->province,
	    		'region' => '',
	    		'postalCode' => $shipping_address->zip,
	    		'countryIsoCode' => $shipping_address->country_code,
	    		'phone' => $shipping_address->phone,
	    		'email' => ''
	    	); 
	    }
	}
}