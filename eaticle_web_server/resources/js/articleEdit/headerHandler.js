import { getArticleIdFromUrl } from "./utils"; // 記事IDを取得する関数をインポート
import { easyMDE } from "./editorHandler"; // easyMDEをインポート
import { getCurrentThumbnailPath } from "./thumbnailHandler"; // 現在のサムネイルパスを取得
import { getTempImages } from "./editorHandler"; // 一時保存画像を取得

/**
 * ヘッダー部分のイベントリスナーを設定する
 * - 非公開保存ボタンおよび公開保存ボタンのクリックイベントを設定
 * - 記事IDをURLから取得し、保存処理を呼び出す
 */
export function initializeHeader() {
	const savePrivateButton = document.getElementById("save-private-button"); // 非公開保存ボタン
	const savePublicButton = document.getElementById("save-public-button"); // 公開保存ボタン
	let tempImages = getTempImages(); // 一時保存画像を取得

	// 記事 ID を URL から取得
	const articleId = getArticleIdFromUrl();

	// 非公開保存ボタンのクリックイベントを設定
	if (savePrivateButton) {
		savePrivateButton.addEventListener("click", () => {
			sendSaveRequest(articleId, false, tempImages); // 非公開フラグで保存リクエストを送信
		});
	} else {
		console.warn("#save-private-button が見つかりません"); // ボタンが見つからない場合の警告
	}

	// 公開保存ボタンのクリックイベントを設定
	if (savePublicButton) {
		savePublicButton.addEventListener("click", () => {
			sendSaveRequest(articleId, true, tempImages); // 公開フラグで保存リクエストを送信
		});
	} else {
		console.warn("#save-public-button が見つかりません"); // ボタンが見つからない場合の警告
	}
}

/**
 * 記事保存リクエストを送信する
 * @param {string} articleId - 記事 ID
 * @param {boolean} isPublic - 公開フラグ (true: 公開, false: 非公開)
 * @param {Array} tempImages - 一時画像の配列
 */
function sendSaveRequest(articleId, isPublic, tempImages) {
	// 保存に必要なデータの収集
	const thumbnailInput = document.getElementById("thumbnail-upload"); // サムネイルアップロード要素
	const thumbnailFile = thumbnailInput.files[0]; // アップロードされたファイル
	const thumbnailPath = getCurrentThumbnailPath(); // 現在のサムネイルパス（URL）

	const title = document.getElementById("title").value.trim(); // 記事タイトル
	const body = easyMDE.value(); // 記事本文
	const tags = Array.from(document.querySelectorAll(".tag-item")).map((tag) =>
		tag.getAttribute("data-tag-name"),
	); // タグリストを取得

	// 一時画像の仮URLとファイル名をマッピング
	const tempImageUrls = tempImages.map((img) => ({
		tempUrl: img.tempUrl,
		fileName: img.fileName,
	}));

	// バリデーションチェック
	if (!title) {
		alert("記事タイトルを入力してください。");
		return;
	}

	if (!body) {
		alert("記事本文を入力してください。");
		return;
	}

	// 保存データをFormDataにまとめる
	const formData = new FormData();
	formData.append("article_id", articleId); // 記事IDを追加
	if (thumbnailFile) {
		formData.append("article_thumbnail_file", thumbnailFile); // 新しいサムネイルファイル
	} else {
		formData.append("article_thumbnail_path", thumbnailPath); // 既存のサムネイルパス
	}
	formData.append("article_title", title); // 記事タイトル
	formData.append("article_body", body); // 記事本文
	formData.append("public", isPublic); // 公開/非公開フラグ
	tags.forEach((tag) => {
		formData.append("article_tag_name_list[]", tag); // タグリストを追加
	});

	formData.append("temp_image_urls", JSON.stringify(tempImageUrls)); // 仮URLをJSON形式で追加
	tempImages.forEach((image, index) => {
		formData.append(`temp_images[${index}]`, image.file); // 各画像ファイルを添付
	});

	const uploadUrl = "/article/save"; // 保存先のURL
	const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]'); // CSRFトークンを取得
	if (!csrfTokenMeta) {
		console.error("CSRFトークンが見つかりません。");
		alert(
			"保存処理に必要なセキュリティ情報が見つかりません。ページを再読み込みしてください。",
		);
		return;
	}

	const csrfToken = csrfTokenMeta.getAttribute("content"); // トークンの内容を取得

	// 保存リクエストの送信
	fetch(uploadUrl, {
		method: "POST",
		headers: {
			"X-CSRF-TOKEN": csrfToken, // CSRFトークンをヘッダーに追加
		},
		body: formData, // データ本体
	})
		.then((response) => {
			if (!response.ok) {
				// サーバーエラーの処理
				response.text().then((errorText) => {
					console.error("サーバーからのエラーレスポンス:", errorText);
				});
				throw new Error(
					`サーバーエラーが発生しました。ステータスコード: ${response.status}`,
				);
			}

			return response.json();
		})
		.then((data) => {
			alert("記事が保存されました。");
		})
		.catch((error) => {
			// リクエスト失敗時のエラーハンドリング
			console.error("保存エラー:", error);
			alert("保存に失敗しました。");
		});
}
