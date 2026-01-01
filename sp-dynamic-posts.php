<?php

/**
 * Plugin Name:       Sp Dynamic Posts
 * Description:       A block to display dynamic posts..
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Mohammad Ullah
 * Author URI: 		  https://mohammad-frontend-dev.vercel.app
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       sp-dynamic-posts
 *
 * @package CreateBlock
 */

if (! defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

function create_block_sp_dynamic_posts_block_init()
{
	register_block_type_from_metadata(
		__DIR__ . '/build/sp-dynamic-posts',
		array(
			'render_callback' => 'render_sp_dynamic_posts_block',
		)
	);
}

function render_sp_dynamic_posts_block($attributes)
{
	$arg = array('posts_per_page' => $attributes['numberOfPosts'], 'post_status' => 'publish');
	$recent_posts = get_posts($arg);

	$posts = "<ul " . get_block_wrapper_attributes() . ">";
	foreach ($recent_posts as $post) {
		$title = get_the_title($post);
		if (empty($title)) {
			$title = __('No title', 'sp-dynamic-posts');
		} else {
			$title = esc_html($title);
		}
		$permalink = get_the_permalink($post);
		$excerpt = get_the_excerpt($post);

		$posts .= "<li>";

		if ($attributes['displayFeaturedImage'] && has_post_thumbnail($post)) {
			$posts .= get_the_post_thumbnail($post, 'thumbnail');
		}

		$posts .= "<h3> <a href=" . esc_url($permalink) . ">" . $title . " </a> </h3>";
		$posts .= "<time datetime=" . esc_attr(get_the_date('c', $post)) . ">" . get_the_date("", $post) . "</time>";
		if (!empty($excerpt)) {
			$posts .= "<p>$excerpt</p>";
		}
		$posts .= "</li>";
	}
	$posts .= "</ul>";

	return $posts;
}

add_action('init', 'create_block_sp_dynamic_posts_block_init');
