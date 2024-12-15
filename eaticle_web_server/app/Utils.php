<?php

use Ramsey\Uuid\Uuid;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

if (!function_exists('generateUUIDv7')) {
	/**
	 * UUID v7 を生成する
	 *
	 * @return string
	 */
	function generateUUIDv7(): string
	{
		return Uuid::uuid7()->toString();
	}
}

if (!function_exists('alertErrorMessage')) {
	/**
	 * エラーメッセージをアラートする
	 *
	 * @param Request $request
	 */
	function alertErrorMessage(Request $request)
	{
		if ($request->session()->has('errors')) {
			$errorMessage = $request->session()->pull('errors')->first('message');
			echo "<script>alert('{$errorMessage}');</script>";
		}
	}
}

if (!function_exists('isLoggedIn')) {
	/**
	 * ユーザーがログインしているか確認
	 *
	 * @param Request $request
	 * @return bool
	 */
	function isLoggedIn(Request $request): bool
	{
		return $request->session()->has('user_id');
	}
}

if (!function_exists('loggedInMessage')) {
	/**
	 * ログイン状態及びメッセージを取得する
	 *
	 * @param Request $request
	 * @return array
	 */
	function loggedInMessage(Request $request): array
	{
		$isLoggedIn = isLoggedIn($request);
		return [
			'is_logged_in' => $isLoggedIn,
			'message' => $isLoggedIn ? 'ログイン済み' : 'ログインが必要です',
		];
	}
}

if (!function_exists('isNewArticle')) {
	/**
	 * 記事が新規記事として認識されているか確認
	 *
	 * @param Request $request
	 * @param string $articleId
	 * @return bool
	 */
	function isNewArticle(Request $request, string $articleId): bool
	{
		$newArticleId = $request->session()->get('new_article_id');
		return $newArticleId === $articleId;
	}
}

if (!function_exists('isMyArticle')) {
	/**
	 * 記事がログインユーザーのものか確認
	 *
	 * @param Request $request
	 * @param string $articleId
	 * @return array
	 */
	function isMyArticle(Request $request, string $articleId): array
	{
		$result = [
			'code' => -1,
			'article' => [],
		];

		try {
			$response = Http::get(env('EXTERNAL_API_URL') . "/article/{$articleId}/detail");

			if ($response->failed() || !$response->json('data')) {
				$result['code'] = 404;
				return $result;
			}

			$article = $response->json('data');
			$userId = $request->session()->get('user_id');

			if ($article['user_id'] === $userId) {
				$result['code'] = 200;
				$result['article'] = $article;
			} else {
				$result['code'] = 403;
			}
		} catch (Exception $e) {
			$result['code'] = $e->getCode();
		}

		return $result;
	}
}

if (!function_exists('errorAbort')) {
	/**
	 * エラーコードを受け取って処理する
	 *
	 * @param int $errorCode
	 */
	function errorAbort(int $errorCode)
	{
		switch ($errorCode) {
			case 401:
				abort(401, 'ユーザーが認証されていません。');
				break;
			case 403:
				abort(403, 'この記事への権限がありません。');
				break;
			case 404:
				abort(404, '記事が見つかりません。');
				break;
			default:
				abort($errorCode, 'エラーが発生しました。');
				break;
		}
	}
}
