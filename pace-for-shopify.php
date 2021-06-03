<?php

/**
 * Plugin Name: Pace For Shopify
 * Plugin URI: https://developers.pacenow.co/#plugins-shopify
 * Description: Provides Pace as a payment method in Shopify.
 * Version: 1.0.0
 * Requires at least: 5.3
 * Requires PHP: 7.*
 * Author: Pace Enterprise Pte Ltd
 * Author URI: http://pacenow.co/
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * Text Domain: pace-for-shopify
 * Domain Path: /languages
 *
 * WC requires at least: 3.0
 */


define('PACE_SHOPIFY_PLUGIN_VERSION', '1.0.0');
define('PACE_SHOPIFY_PLUGIN_NAME', 'Pace For Shopify');
define('PACE_SHOPIFY_PLUGIN_PATH', untrailingslashit(plugin_dir_path(__FILE__)));
define('PACE_SHOPIFY_PLUGIN_URL', untrailingslashit(plugins_url(basename(plugin_dir_path(__FILE__)), basename(__FILE__))));


/**
 * Active plugins
 *
 * @since 1.0.0 run setting when plugins is active
 */
add_action('plugins_loaded', 'shopify_gateway_pace_init');

if (!function_exists('shopify_gateway_pace_init')) {

    function shopify_gateway_pace_init() {
        load_plugin_textdomain('pace-for-shopify', false, plugin_basename(dirname(__FILE__)) . '/languages');

        if (!class_exists('SHOPIFY_PACE_GATEWAY')) { 
            
            /**
             * Shopify integrate Pace payment gateway
             */
            class WC_PACE_GATEWAY
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

                public function __construct()
                {
                    add_action('admin_init', array($this, 'isActive'));
                    $this->init();
                }

                public static function isActive () 
                {
                    if (!is_plugin_active(plugin_basename(__FILE__))) {
                        return;
                    }

                    if (is_admin()) {
                        return;
                    }
                }

                public function init() {
                    require_once dirname(__FILE__) . '/admin/setup.php';
                    require_once dirname(__FILE__) . '/includes/data.php';
                    require_once dirname(__FILE__) . '/includes/pace.php';
                    require_once dirname(__FILE__) . '/includes/common.php';
                    require_once dirname(__FILE__) . '/includes/shopify.php';
                    require_once dirname(__FILE__) . '/includes/http-client.php';
                }
            }

            // run
            WC_PACE_GATEWAY::get_instance();
        }
    }
}