<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ArticleListController extends Controller
{
	// 内部API: 外部APIから記事データを取得
	public function getArticles(Request $request)
	{
		$offset = $request->query('offset', 0);
		$search = $request->query('search', '');
		$sort = $request->query('sort', 'created_at_desc');

		try {
			$response = Http::get(env('EXTERNAL_API_URL') . '/article/list', [
				'offset' => $offset,
				'search' => $search,
				'sort' => $sort,
			]);

			if ($response->successful()) {
				return $response->json('data');
			} else {
				Log::error('外部APIエラー: ' . $response->status());
				return [
					'article_list' => [],
					'pagination' => ['offset' => $offset, 'has_more' => false],
				];
			}
		} catch (\Exception $e) {
			Log::error('APIリクエストエラー: ' . $e->getMessage());
			return [
				'article_list' => [],
				'pagination' => ['offset' => $offset, 'has_more' => false],
			];
		}
	}

	// ビューの表示
	public function index(Request $request)
	{
		// 内部APIを使用してデータを取得
		$data = $this->getArticles($request);

		// データをビューに渡す
		$articles = $data['article_list'] ?? [];
		$pagination = $data['pagination'] ?? ['offset' => 0, 'has_more' => false];

		return view('article.list', compact('articles', 'pagination'));
	}
}
