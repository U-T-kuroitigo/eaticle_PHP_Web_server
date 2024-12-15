<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Article\ArticleListController;
use App\Http\Controllers\Article\ArticleCreateController;
use App\Http\Controllers\Article\ArticleEditController;
use App\Http\Controllers\Auth\LoginLogoutController;


Route::get('/', function () {
	return view('welcome');
});

Route::get('/article/list', [ArticleListController::class, 'index'])->name('article.list');
Route::get('/api/article/list', [ArticleListController::class, 'getArticles'])->name('api.article.list');

Route::get('/article/create', [ArticleCreateController::class, 'create'])->name('article.create');

Route::get('/article/{article_id}/edit', [ArticleEditController::class, 'edit'])->name('article.edit');

Route::post('/article/save', [ArticleEditController::class, 'save'])->name('article.save');

Route::get('/login/{user_id}', [LoginLogoutController::class, 'login'])->name('login');	// プロバイダ認証の処理実装時に削除
Route::post('/logout', [LoginLogoutController::class, 'logout'])->name('logout');
