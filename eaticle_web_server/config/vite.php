<?php

return [

	/*
    |--------------------------------------------------------------------------
    | Asset URL
    |--------------------------------------------------------------------------
    |
    | This value is the base URL for your Vite assets. When this is set, Vite
    | will use this URL to prefix all asset paths. This is useful for
    | serving assets from a CDN like Cloudflare.
    |
    */

	'asset_url' => env('VITE_ASSET_URL', null),

	/*
    |--------------------------------------------------------------------------
    | Development Server URL
    |--------------------------------------------------------------------------
    |
    | This URL is used during local development to serve assets from the Vite
    | development server. You should include the protocol and port number.
    |
    */

	'server' => [
		'host' => env('VITE_DEV_SERVER_HOST', 'localhost'),
		'port' => env('VITE_DEV_SERVER_PORT', '5173'),
		'https' => env('VITE_DEV_SERVER_HTTPS', false),
	],

	/*
    |--------------------------------------------------------------------------
    | Additional Entries
    |--------------------------------------------------------------------------
    |
    | Here you may specify additional JavaScript or CSS entries that should
    | be included with each page served by your application. These should
    | be relative to the "resources" directory and will be served during
    | development by Vite and during production by Laravel.
    |
    */

	'entry_points' => [
		'resources/css/app.css',
		'resources/js/app.js',
	],

];
