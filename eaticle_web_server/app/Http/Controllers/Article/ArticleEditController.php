<?php

namespace App\Http\Controllers\Article;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;
use App\Http\Controllers\Controller;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\Log;

class ArticleEditController extends Controller
{
	/**
	 * 記事編集ページの表示
	 *
	 * @param Request $request
	 * @param string $article_id
	 * @return \Illuminate\View\View|\Illuminate\Http\RedirectResponse
	 */
	public function edit(Request $request, string $article_id)
	{
		// セッション内エラーメッセージをアラート表示
		alertErrorMessage($request);

		// ログイン確認
		$logged_in_message_set = loggedInMessage($request);
		if (!$logged_in_message_set['is_logged_in']) {
			return redirect()->route('article.list')->withErrors([
				'message' => $logged_in_message_set['message'],
			]);
		}

		// 新規記事か既存記事かを判定
		$is_new_article = isNewArticle($request, $article_id);

		if (!$is_new_article) {
			// 既存記事の場合、外部APIで詳細を取得
			$is_my_article_set = isMyArticle($request, $article_id);
			if ($is_my_article_set['code'] !== 200) {
				errorAbort($is_my_article_set['code']);
			}
			$article = $is_my_article_set['article'];
		} else {
			// 新規記事の場合のデフォルト設定
			$article = [
				'article_id' => $article_id,
				'article_thumbnail_path' => null,
				'article_title' => null,
				'article_tag_list' => [
					'list' => [],
					'total_count' => 0,
				],
				'article_body' => null,
				'eaticle_id' => $request->session()->get('eaticle_id'),
				'user_name' => $request->session()->get('user_name', '仮のユーザーネーム'),
				'user_img' => $request->session()->get('user_img', asset('images/default_user_icon.png')),
			];
		}

		// 編集ページを表示
		return view('article.edit', compact('article', 'is_new_article'));
	}

	/**
	 * 記事保存処理
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function save(Request $request)
	{
		// CSRFトークンの確認
		if ($request->session()->token() !== $request->header('X-CSRF-TOKEN')) {
			return response()->json(['error' => 'CSRF token mismatch.'], 419);
		}

		try {
			// 入力データのバリデーション
			$request_data = $request->validate([
				'article_id' => 'required|string',
				'article_thumbnail_file' => 'nullable|file|image|max:2048',
				'article_thumbnail_path' => 'nullable|string|url',
				'article_title' => 'required|string|max:255',
				'article_body' => 'required|string',
				'public' => 'required|in:true,false,1,0',
				'article_tag_name_list' => 'array',
				'article_tag_name_list.*' => 'string',
			]);

			// ログイン確認
			$logged_in_message_set = loggedInMessage($request);
			if (!$logged_in_message_set['is_logged_in']) {
				return response()->json(['error' => $logged_in_message_set['message']], 401);
			}

			// 記事の権限確認
			$article_id = $request_data['article_id'];
			if (!isNewArticle($request, $article_id)) {
				$is_my_article_set = isMyArticle($request, $article_id);
				if ($is_my_article_set['code'] !== 200) {
					errorAbort($is_my_article_set['code']);
				}
			}

			$user_id = $request->session()->get('user_id');
			if (!$user_id) {
				return response()->json(['error' => 'ユーザーが認証されていません。'], 401);
			}

			// サムネイル処理
			$article_thumbnail_path = null;
			if ($request->hasFile('article_thumbnail_file')) {
				// サムネイル画像をCloudinaryにアップロード
				$uploadedFile = $request->file('article_thumbnail_file');
				$response = Cloudinary::uploadFile($uploadedFile->getRealPath(), [
					'folder' => env('CLOUDINARY_FOLDER', 'default_folder'),
				]);
				$article_thumbnail_path = $response->getSecurePath();
			} else {
				$article_thumbnail_path = $request_data['article_thumbnail_path'] ?? null;
			}

			// 一時画像の処理
			$temp_image_urls = json_decode($request->input('temp_image_urls'), true) ?? [];
			$temp_images = $request->file('temp_images') ?? [];
			$article_body = $request_data['article_body'];

			foreach ($temp_images as $temp_image) {
				try {
					$file_name = $temp_image->getClientOriginalName();
					$response = Cloudinary::uploadFile($temp_image->getRealPath(), [
						'folder' => env('CLOUDINARY_FOLDER', 'default_folder'),
					]);
					$uploaded_url = $response->getSecurePath();

					// 一時URLを置換
					$temp_url = collect($temp_image_urls)->firstWhere('fileName', $file_name)['tempUrl'] ?? '';
					$article_body = str_replace($temp_url, $uploaded_url, $article_body);
				} catch (\Throwable $e) {
					Log::error('画像アップロードエラー', ['details' => $e->getMessage()]);
					return response()->json(['error' => '画像アップロード中にエラーが発生しました。', 'details' => $e->getMessage()], 500);
				}
			}

			// 外部APIに記事を保存
			$save_data = [
				'article_id' => $article_id,
				'user_id' => $user_id,
				'article_thumbnail_path' => $article_thumbnail_path,
				'article_title' => $request_data['article_title'],
				'article_body' => $article_body,
				'public' => filter_var($request_data['public'], FILTER_VALIDATE_BOOLEAN),
				'article_tag_name_list' => $request_data['article_tag_name_list'],
			];

			$response = Http::post(env('EXTERNAL_API_URL') . '/article/save', $save_data);

			if ($response->failed()) {
				Log::error('外部API保存エラー', ['details' => $response->body()]);
				return response()->json(['error' => '記事の保存に失敗しました。', 'details' => $response->body()], 500);
			}

			// セッションデータのクリア
			$request->session()->forget('new_article_id');
			return response()->json(['message' => '記事が保存されました。', 'data' => $response->json()], 200);
		} catch (\Throwable $e) {
			Log::error('保存処理エラー', ['details' => $e->getMessage()]);
			return response()->json(['error' => '保存処理中にエラーが発生しました。', 'details' => $e->getMessage()], 500);
		}
	}
}
