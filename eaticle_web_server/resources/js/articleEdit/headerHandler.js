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

	initializeCloseHandler(isNewArticle, articleId, tempImages);

	// 非公開保存ボタンのクリックイベントを設定
	if (savePrivateButton) {
		savePrivateButton.addEventListener("click", () => {
			// 非公開フラグで保存リクエストを送信
			sendSaveRequest(articleId, false, tempImages).then((success) => {
				if (success) {
					window.location.href = `/article/${articleId}/detail`;
				}
			});
		});
	} else {
		console.warn("#save-private-button が見つかりません"); // ボタンが見つからない場合の警告
	}

	// 公開保存ボタンのクリックイベントを設定
	if (savePublicButton) {
		savePublicButton.addEventListener("click", () => {
			// 公開フラグで保存リクエストを送信
			sendSaveRequest(articleId, true, tempImages).then((success) => {
				if (success) {
					window.location.href = `/article/${articleId}/detail`;
				}
			});
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
 * @returns {Promise<boolean>} - 保存成功で `true`、失敗で `false`
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
		return Promise.resolve(false);
	}

	if (!body) {
		alert("記事本文を入力してください。");
		return Promise.resolve(false);
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
		return Promise.resolve(false);
	}

	const csrfToken = csrfTokenMeta.getAttribute("content"); // トークンの内容を取得

	// 保存リクエストの送信
	return fetch(uploadUrl, {
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

			return true;
		})
		.then(() => {
			alert("記事が保存されました。");
			return true;
		})
		.catch((error) => {
			// リクエスト失敗時のエラーハンドリング
			console.error("保存エラー:", error);
			alert("保存に失敗しました。");
			return false;
		});
}

/**
 * 記事編集ページの閉じるボタンとモーダルの動作を初期化する
 * @param {boolean} isNewArticle - 新規記事かどうか (true: 新規記事, false: 既存記事)
 * @param {string} articleId - 記事 ID
 * @param {Array} tempImages - 一時画像の配列
 */
function initializeCloseHandler(isNewArticle, articleId, tempImages) {
	const closeButton = document.getElementById("close-button");
	const modal = document.getElementById("close-modal");
	const cancelModalButton = document.getElementById("cancel-modal-button");
	const saveDraftButton = document.getElementById("save-draft-button"); // クラスに変更
	const confirmCloseButton = document.getElementById("confirm-close-button");

	// 必要な要素が存在するか確認
	if (
		!closeButton ||
		!modal ||
		!cancelModalButton ||
		!saveDraftButton ||
		!confirmCloseButton
	) {
		console.warn("モーダルの要素が見つかりません");
		return;
	}

	// 閉じるボタンでモーダル表示
	closeButton.addEventListener("click", () => {
		modal.classList.remove("hidden");
	});

	// キャンセルボタンでモーダル非表示
	cancelModalButton.addEventListener("click", () => {
		modal.classList.add("hidden");
	});

	// 下書き保存ボタンの処理
	saveDraftButton.addEventListener("click", () => {
		// 非公開フラグで保存リクエストを送信
		sendSaveRequest(articleId, false, tempImages).then((success) => {
			if (success) {
				window.location.href = `/article/${articleId}/detail`;
				modal.classList.add("hidden");
			}
		});
	});

	// 閉じる確認ボタンの処理
	confirmCloseButton.addEventListener("click", () => {
		modal.classList.add("hidden");
		// ページ遷移処理
		const redirectUrl = isNewArticle
			? "/article/list"
			: `/article/${articleId}/detail`;
		window.location.href = redirectUrl;
	});
}
