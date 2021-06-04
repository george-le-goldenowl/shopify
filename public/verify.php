<?php

if (!defined('ABSPATH')) {
    return;
}

if (!function_exists('shopify_verify')) {
    
    function shopify_verify()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            try {
                if (!wp_verify_nonce( untrailingslashit( $_POST['csrf'] ), 'shopify_verify' )) {
                    throw new Exception('Invalid csrf.');
                }

                $shopifyId = wp_insert_post( array('post_title' => untrailingslashit( $_GET['shop'] ), 'post_type' => 'shopify') );

                if (!$shopifyId) {
                    throw new Exception('Cannot create new shopify store.');
                }

                $client_id = untrailingslashit( esc_attr( $_POST['client_id'] ) );
                $client_secret = untrailingslashit( esc_attr( $_POST['client_secret'] ) );
                add_post_meta( $shopifyId, 'client_id', $client_id, true );
                add_post_meta( $shopifyId, 'client_secret', $client_secret, true );

                wp_send_json_success(array('message' => 'Successfully verified.'));
            } catch (Exception $e) {
                wp_send_json_error(array('message' => $e->getMessage()));
            }
        } else {
            try {
                if (!isset($_GET['shop']) || empty($_GET['shop'])) {
                    throw new Exception('Unknow shop');
                }

                $shop = untrailingslashit( wp_kses_data( $_GET['shop'] ) );
                $store = SHOPIFY_DATA::getShopify($shop);

                if ($store) {
                    throw new Exception('Shopify URL is verified');
                }

                require_once PACE_SHOPIFY_PLUGIN_PATH . '/public/template/verify.php';
            } catch (Exception $e) {
                echo $e->getMessage();
            }
        }
    }

    shopify_verify();
}