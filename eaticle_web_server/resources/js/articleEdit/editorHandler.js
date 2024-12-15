import { getArticleIdFromUrl } from "./utils"; // 記事IDを取得する関数をインポート

export let easyMDE = null; // easyMDEエディターのインスタンスを外部からアクセス可能に
let tempImages = []; // 一時保存用の画像データを格納する配列

/**
 * エディターを初期化する関数
 * - EasyMDEの設定を行い、画像アップロード機能やドラッグ＆ドロップをサポートします。
 */
export function initializeEditor() {
	easyMDE = new EasyMDE({
		element: document.getElementById("content-editor"), // エディターを埋め込むHTML要素
		spellChecker: false, // スペルチェックを無効化
		placeholder: "本文を入力してください...", // 入力欄のプレースホルダー
		imageUpload: true, // 画像アップロードを有効化
		imageUploadFunction: (file, onSuccess, onError) => {
			// 独自の画像アップロード処理
			if (file) {
				handleImageUpload(file, tempImages, onSuccess, onError);
			} else {
				onError("ファイルが選択されていません。");
			}
		},
		toolbar: [
			"bold", // 太字
			"italic", // 斜体
			"heading", // 見出し
			"|",
			"quote", // 引用
			"unordered-list", // 箇条書きリスト
			"ordered-list", // 番号付きリスト
			"horizontal-rule", // 水平線
			"table", // 表
			"code", // コードブロック
			"|",
			"link", // リンク
			"image", // 画像挿入
			"|",
			"preview", // プレビュー表示
			"side-by-side", // サイドバイサイド表示
			"fullscreen", // 全画面表示
			"guide", // ガイドリンク
		],
		previewRender: (plainText) => {
			// Markdownのプレビューをレンダリング
			return easyMDE.markdown(plainText);
		},
	});

	// ドラッグ＆ドロップのサポート
	easyMDE.codemirror.on("drop", (editor, event) => {
		event.preventDefault();
		const files = event.dataTransfer.files;
		if (files && files[0]) {
			const file = files[0];
			if (file.type.startsWith("image/")) {
				// ドラッグされたファイルが画像の場合
				handleImageUpload(
					file,
					tempImages,
					(tempUrl) => {
						// 成功時、エディターにMarkdown形式で画像を挿入
						const cm = easyMDE.codemirror;
						const doc = cm.getDoc();
						const cursor = doc.getCursor(); // 現在のカーソル位置を取得
						doc.replaceRange(`![画像](${tempUrl})`, cursor); // Markdown形式で画像を挿入
					},
					(error) => {
						// エラーハンドリング
						alert("画像アップロードに失敗しました。");
						console.error(error);
					},
				);
			} else {
				alert("画像ファイルのみアップロード可能です。");
			}
		}
	});
}

/**
 * 画像の一時保存処理
 * - ファイルを一時保存用に処理し、仮URLを生成します。
 * - 成功時にはonSuccessで仮URLを返します。
 * - エラー発生時にはonErrorでエラーメッセージを返します。
 * @param {File} file - アップロードされたファイル
 * @param {Array} tempImages - 一時保存用の画像配列
 * @param {Function} onSuccess - 成功時のコールバック
 * @param {Function} onError - 失敗時のコールバック
 */
function handleImageUpload(file, tempImages, onSuccess, onError) {
	try {
		const tempUrl = URL.createObjectURL(file); // 一時URL生成
		tempImages.push({ file, tempUrl, fileName: file.name }); // ファイル名も保存
		console.log("Temp Image Added:", { file, tempUrl, fileName: file.name });
		onSuccess(tempUrl); // 仮URLを返す
	} catch (error) {
		onError("画像の一時保存に失敗しました。");
		console.error(error);
	}
}

/**
 * tempImagesを取得する
 * - 一時保存された画像データを返します。
 * @returns {Array} - 現在のtempImages
 */
export function getTempImages() {
	return tempImages;
}
