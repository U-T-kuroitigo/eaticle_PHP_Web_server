<?php

namespace App\Http\Controllers\Article;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Parsedown;

class ArticleDetailController extends Controller
{
	/**
	 * 記事詳細ページ表示
	 */
	public function detail($article_id)
	{
		try {
			// APIから記事詳細情報を取得
			$response = Http::get(env('EXTERNAL_API_URL') . "/article/{$article_id}/detail");

			if ($response->failed() || !$response->json('data')) {
				abort(404, '記事が見つかりません。');
			}

			// 記事データ
			$article = $response->json('data');

			// MarkdownをHTMLに変換
			$parsedown = new Parsedown();
			$article['parsed_body'] = $parsedown->text($article['article_body'] ?? '');

			// Bladeに渡すデータの整形
			$data = [
				'article' => [
					'article_id' => $article['article_id'] ?? '',
					'article_thumbnail_path' => $article['article_thumbnail_path'] ?? '',
					'article_title' => $article['article_title'] ?? 'タイトルなし',
					'user_id' => $article['user_id'] ?? '不明なユーザーID',
					'user_img' => $article['user_img'] ?? asset('images/default_user_icon.png'),
					'user_name' => $article['user_name'] ?? '不明なユーザー',
					'created_at' => $article['created_at'] ?? '',
					'article_tag_list' => $article['article_tag_list'] ?? ['list' => []],
					'parsed_body' => $article['parsed_body'],
				],
			];

			// Bladeビューを返す
			return view('article.detail', $data);
		} catch (\Throwable $e) {
			Log::error('記事詳細ページエラー', ['details' => $e->getMessage()]);
			abort(500, '記事詳細ページの読み込み中にエラーが発生しました。');
		}
	}
}
