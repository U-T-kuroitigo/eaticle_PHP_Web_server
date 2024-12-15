import { initializeEditor } from "./editorHandler"; // マークダウンエディターの初期化
import { initializeThumbnail } from "./thumbnailHandler"; // サムネイル管理の初期化
import { initializeTitle } from "./titleHandler"; // タイトル入力の初期化
import { initializeTags } from "./tagHandler"; // タグ管理の初期化
import { initializeHeader } from "./headerHandler"; // ヘッダーの初期化

// DOMContentLoaded イベント後の初期化処理
document.addEventListener("DOMContentLoaded", () => {
	// サムネイルの初期化
	// - 削除アイコンのパスとプレースホルダー画像を指定して初期化
	initializeThumbnail(cancelIconPath, placeholderImage);

	// タイトルの初期化
	// - 文字数制限と文字数カウンターの更新をサポート
	initializeTitle();

	// タグデータの初期化
	// - サーバーから渡されたタグデータをJSON形式で取得
	const initialTags = JSON.parse(
		document.getElementById("tag-data").textContent,
	);
	initializeTags(cancelIconPath, initialTags);

	// マークダウンエディターの初期化
	// - 本文入力用のリッチテキストエディターを設定
	initializeEditor();

	// ヘッダーの初期化
	// - 保存ボタンのイベントリスナーを設定
	initializeHeader();
});
