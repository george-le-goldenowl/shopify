<?php

if (!defined('ABSPATH')) {
	return;
}

if (!class_exists('SHOPIFY_ADMIN_SETUP')) {
	
	/**
	 * Shopify admin setup class
	 */
	class SHOPIFY_ADMIN_SETUP
	{
	    /**
	     * summary
	     */
	    public function __construct()
	    {	
	    	add_action( 'init', array($this, 'init') );
	    	add_action( 'rest_api_init', array($this, 'register_rest_api') );
	    }

	    public function init()
	    {
	    	$this->register_shopify_posttype();
	        $this->register_shopify_route();
	        
	        add_filter( 'query_vars', array($this, 'add_query_params') );
	        add_action( 'template_include', array($this, 'rendered_template') );
	    }

	    /**
    	 * Registers a new post type
    	 * @uses $wp_post_types Inserts new post type object into the list
    	 *
    	 * @param string  Post type key, must not exceed 20 characters
    	 * @param array|string  See optional args description above.
    	 * @return object|WP_Error the registered post type object, or an error object
    	 */
	    public function register_shopify_posttype()
	    {
    		$labels = array(
    			'name'               => __( 'Shopify', 'pace-for-shopify' ),
    			'singular_name'      => __( 'Shopify', 'pace-for-shopify' ),
    			'add_new'            => _x( 'Add New Shopify', 'pace-for-shopify', 'pace-for-shopify' ),
    			'add_new_item'       => __( 'Add New Shopify', 'pace-for-shopify' ),
    			'edit_item'          => __( 'Edit Shopify', 'pace-for-shopify' ),
    			'new_item'           => __( 'New Shopify', 'pace-for-shopify' ),
    			'view_item'          => __( 'View Shopify', 'pace-for-shopify' ),
    			'search_items'       => __( 'Search Shopify', 'pace-for-shopify' ),
    			'not_found'          => __( 'No Shopify found', 'pace-for-shopify' ),
    			'not_found_in_trash' => __( 'No Shopify found in Trash', 'pace-for-shopify' ),
    			'parent_item_colon'  => __( 'Parent Shopify:', 'pace-for-shopify' ),
    			'menu_name'          => __( 'Shopify', 'pace-for-shopify' ),
    		);
    	
    		$args = array(
    			'labels'              => $labels,
    			'hierarchical'        => false,
    			'description'         => 'description',
    			'taxonomies'          => array(),
    			'public'              => true,
    			'show_ui'             => true,
    			'show_in_menu'        => true,
    			'show_in_admin_bar'   => true,
    			'menu_position'       => null,
    			'menu_icon'           => null,
    			'show_in_nav_menus'   => true,
    			'publicly_queryable'  => true,
    			'exclude_from_search' => false,
    			'has_archive'         => true,
    			'query_var'           => true,
    			'can_export'          => true,
    			'rewrite'             => false,
    			'capability_type'     => 'post',
    			'supports'            => array(
    				'title',
    				'editor',
    				'author',
    				'thumbnail',
    				'excerpt',
    				'custom-fields',
    				'trackbacks',
    				'comments',
    				'revisions',
    				'page-attributes',
    				'post-formats',
    			),
    		);
    	
    		register_post_type( 'shopify', $args );
	    }

	    public function register_shopify_route()
	    {
	    	add_rewrite_rule( 'shopify/([a-z0-9-]+)[/]?$', 'index.php?route=$matches[1]', 'top' );
	    }

	    public function register_rest_api()
	    {
	    	register_rest_route( 'shopify/v1', '/webhooks/(?P<shop>[a-zA-Z0-9\.\-]+)/(?P<topic>[a-zA-Z\/\-]+)', array( 
	    		'methods' => 'POST',
	    		'callback' => array('SHOPIFY', 'webhooks_action')
	    	) );
	    }

	    public function add_query_params($queries)
	    {
	    	$queries[] = 'route';

	    	return $queries;
	    }

	    public function rendered_template($template)
	    {
	    	if ( get_query_var( 'route' ) == false || get_query_var( 'route' ) == '' ) {
		        return $template;
		    }

		    $route = get_query_var( 'route' );

		    return PACE_SHOPIFY_PLUGIN_PATH . '/public/' . $route . '.php';
	    }
	}

	new SHOPIFY_ADMIN_SETUP();
}