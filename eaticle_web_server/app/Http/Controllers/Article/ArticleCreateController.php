<?php

namespace App\Http\Controllers\Article;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ArticleCreateController extends Controller
{
	/**
	 * 新規記事作成処理
	 * - UUID v7 を使用して新規記事IDを生成
	 * - 記事IDをセッションに保存
	 * - 記事編集ページにリダイレクト
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\RedirectResponse
	 */
	public function create(Request $request)
	{
		// UUID v7で新しい記事IDを生成
		$newArticleId = generateUUIDv7();

		// 新しい記事IDをセッションに保存
		$this->saveNewArticleIdToSession($request, $newArticleId);

		// セッションから新しい記事IDを取得
		$newArticleId = $request->session()->get('new_article_id');

		if (!$newArticleId) {
			abort(404, '新しい記事IDが見つかりません');
		}

		// 記事編集ページへリダイレクト
		return redirect()->route('article.edit', ['article_id' => $newArticleId]);
	}

	/**
	 * 新規記事IDをセッションに保存
	 * - 記事作成時に生成した新規記事IDをセッションに記録
	 *
	 * @param Request $request
	 * @param string $newArticleId
	 * @return void
	 */
	private function saveNewArticleIdToSession(Request $request, string $newArticleId)
	{
		$request->session()->put('new_article_id', $newArticleId);
	}
}
