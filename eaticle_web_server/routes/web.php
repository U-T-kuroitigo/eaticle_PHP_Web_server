<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArticleListController;

Route::get('/', function () {
	return view('welcome');
});

Route::get('/article/list', [ArticleListController::class, 'index'])->name('article.list');
Route::get('/api/article/list', [ArticleListController::class, 'getArticles'])->name('api.article.list');
