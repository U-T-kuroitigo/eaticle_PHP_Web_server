/**
 * 記事タイトルの入力欄を初期化する関数
 * - 文字数制限の適用
 * - 文字数カウンターの更新
 */
export function initializeTitle() {
	const titleTextarea = document.getElementById("title"); // タイトル入力欄
	const titleCharCounter = document.getElementById("title-char-counter"); // 文字数カウンター要素
	const maxTitleChars = 100; // タイトルの最大文字数

	// 初期状態で文字数カウンターを更新
	updateCharCounter();

	// 入力イベントで文字数制限およびカウンターを更新
	titleTextarea.addEventListener("input", () => {
		// 最大文字数を超えた場合、入力内容を制限
		if (titleTextarea.value.length > maxTitleChars) {
			titleTextarea.value = titleTextarea.value.substring(0, maxTitleChars); // 超過部分を削除
		}
		// 文字数カウンターを更新
		updateCharCounter();
	});

	/**
	 * 文字数カウンターを更新する関数
	 * - 現在の入力文字数を表示
	 */
	function updateCharCounter() {
		const currentLength = titleTextarea.value.length; // 現在の入力文字数
		titleCharCounter.textContent = `${currentLength} / ${maxTitleChars}文字`; // カウンターを更新
	}
}
