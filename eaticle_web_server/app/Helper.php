<?php

use Carbon\Carbon;

if (!function_exists('formatDate')) {
	function formatDate($datetime)
	{
		return Carbon::parse($datetime)->format('Y年n月j日 G:i');
	}
}
