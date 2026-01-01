<?php
// This file is generated. Do not modify it manually.
return array(
	'sp-dynamic-posts' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'create-block/sp-dynamic-posts',
		'version' => '0.1.0',
		'title' => 'Sp Dynamic Posts',
		'category' => 'widgets',
		'icon' => 'format-aside',
		'description' => 'A block to display dynamic posts.',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'textdomain' => 'sp-dynamic-posts',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js',
		'attributes' => array(
			'numberOfPosts' => array(
				'type' => 'number',
				'default' => 5
			),
			'displayFeaturedImage' => array(
				'type' => 'boolean',
				'default' => true
			),
			'imageSize' => array(
				'type' => 'string',
				'default' => 'thumbnail'
			)
		)
	)
);
