let currentThumbnailPath = ""; // サムネイルパスをモジュールスコープで管理

/**
 * サムネイル管理を初期化する関数
 * @param {string} cancelIconPath - 削除ボタンのアイコンパス
 * @param {string} placeholderImage - サムネイルのプレースホルダー画像のURL
 */
export function initializeThumbnail(cancelIconPath, placeholderImage) {
	const thumbnailInput = document.getElementById("thumbnail-upload"); // サムネイル入力要素
	const thumbnailPreview = document.getElementById("thumbnail-preview"); // サムネイルのプレビュー要素
	const thumbnailRemoveButton = document.createElement("button"); // サムネイル削除ボタン
	const dropZone = thumbnailPreview.parentNode; // ドロップゾーン要素

	// 初期状態でサムネイルが既存の場合、パスを設定
	currentThumbnailPath =
		thumbnailPreview.src === placeholderImage ? "" : thumbnailPreview.src;

	// 削除ボタンの設定
	thumbnailRemoveButton.className =
		"absolute top-3 right-3 hidden rounded-full shadow hover:bg-gray-400 flex items-center justify-center";
	thumbnailRemoveButton.innerHTML = `<img src="${cancelIconPath}" alt="削除" class="w-10 h-10">`;
	thumbnailPreview.parentNode.appendChild(thumbnailRemoveButton);

	// 初期状態でサムネイルが既存の場合、削除ボタンを表示
	if (currentThumbnailPath) {
		thumbnailRemoveButton.classList.remove("hidden");
	}

	// サムネイル変更時の処理
	thumbnailInput.addEventListener("change", (event) => {
		const file = event.target.files[0];
		if (file) {
			processThumbnail(file, thumbnailPreview, thumbnailRemoveButton);
			currentThumbnailPath = ""; // ローカルファイルの場合、保存されていないため空に設定
		} else {
			resetThumbnail(
				thumbnailPreview,
				thumbnailInput,
				thumbnailRemoveButton,
				placeholderImage,
			);
		}
	});

	// サムネイル削除ボタンのクリック処理
	thumbnailRemoveButton.addEventListener("click", () => {
		resetThumbnail(
			thumbnailPreview,
			thumbnailInput,
			thumbnailRemoveButton,
			placeholderImage,
		);
		currentThumbnailPath = ""; // 削除時はパスを空にする
	});

	// ドラッグ＆ドロップのイベントリスナーを設定
	dropZone.addEventListener("dragover", (event) => {
		event.preventDefault();
		dropZone.classList.add(
			"border-dashed",
			"border-2",
			"border-gray-500",
			"bg-gray-200/50",
		);
	});

	dropZone.addEventListener("dragleave", () => {
		dropZone.classList.remove(
			"border-dashed",
			"border-2",
			"border-gray-500",
			"bg-gray-200/50",
		);
	});

	dropZone.addEventListener("drop", (event) => {
		event.preventDefault();
		dropZone.classList.remove(
			"border-dashed",
			"border-2",
			"border-gray-500",
			"bg-gray-200/50",
		);
		const file = event.dataTransfer.files[0];
		if (file && file.type.startsWith("image/")) {
			processThumbnail(file, thumbnailPreview, thumbnailRemoveButton);
			currentThumbnailPath = ""; // ローカルファイルの場合、保存されていないため空に設定
		} else {
			alert("画像ファイルのみアップロード可能です。");
		}
	});

	// ホバーイベントの設定
	dropZone.addEventListener("mouseenter", () => {
		dropZone.classList.add("bg-gray-200/50");
	});

	dropZone.addEventListener("mouseleave", () => {
		dropZone.classList.remove("bg-gray-200/50");
	});
}

/**
 * 現在のサムネイルパスを取得する関数
 * @returns {string} - 現在のサムネイルパス
 */
export function getCurrentThumbnailPath() {
	return currentThumbnailPath;
}

/**
 * サムネイルの処理を行う関数
 * - プレビュー画像を表示
 * - 削除ボタンを有効化
 * @param {File} file - アップロードされた画像ファイル
 * @param {HTMLElement} thumbnailPreview - サムネイルのプレビュー要素
 * @param {HTMLElement} thumbnailRemoveButton - サムネイル削除ボタン
 */
function processThumbnail(file, thumbnailPreview, thumbnailRemoveButton) {
	const reader = new FileReader();
	reader.onload = (e) => {
		thumbnailPreview.src = e.target.result; // ファイル内容をプレビューに表示
		thumbnailPreview.classList.remove("hidden"); // プレビューを表示
		thumbnailRemoveButton.classList.remove("hidden"); // 削除ボタンを表示
	};
	reader.readAsDataURL(file); // ファイルを読み込み
}

/**
 * サムネイルをリセットする関数
 * - プレースホルダー画像に戻す
 * @param {HTMLElement} thumbnailPreview - サムネイルのプレビュー要素
 * @param {HTMLInputElement} thumbnailInput - ファイル入力要素
 * @param {HTMLElement} thumbnailRemoveButton - サムネイル削除ボタン
 * @param {string} placeholderImage - プレースホルダー画像のURL
 */
function resetThumbnail(
	thumbnailPreview,
	thumbnailInput,
	thumbnailRemoveButton,
	placeholderImage,
) {
	thumbnailPreview.src = placeholderImage; // プレビューをプレースホルダー画像に変更
	thumbnailPreview.classList.remove("hidden"); // プレビューを表示
	thumbnailInput.value = ""; // ファイル入力をリセット
	thumbnailRemoveButton.classList.add("hidden"); // 削除ボタンを非表示
}
