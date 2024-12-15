<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class LoginLogoutController extends Controller
{
	/**
	 * プロバイダ認証後のログイン処理
	 *
	 * @param string $userId プロバイダ認証後に付与されるユーザーID
	 */
	public function login(Request $request, string $userId)
	{
		// user_idが存在しない場合はエラーレスポンスを返す
		if (empty($userId)) {
			return redirect()->route('article.list')->withErrors(['message' => 'ログイン処理に失敗しました']);
		}

		// セッションにユーザーIDを保存
		$request->session()->put('user_id', $userId);

		// $request->session()->put('eaticle_id', generateUUIDv7());
		$request->session()->put('eaticle_id', 'test_eaticle_id_0001');


		// 記事一覧ページにリダイレクト
		return redirect()->route('article.list')->with('message', 'ログインしました');
	}

	/**
	 * ログアウト処理
	 */
	public function logout(Request $request)
	{
		// セッションからユーザーIDを削除
		if ($request->session()->has('user_id')) {
			$request->session()->forget('user_id');
		}

		// 記事一覧ページにリダイレクト
		return redirect()->route('article.list')->with('message', 'ログアウトしました');
	}
}
