/**
 * タグ管理を初期化する関数
 * @param {string} cancelIconPath - タグ削除ボタンに使用するアイコンのパス
 * @param {Array<string>} initialTags - 初期表示するタグの配列
 */
export function initializeTags(cancelIconPath, initialTags) {
	const tagInput = document.getElementById("tag-input"); // タグ入力欄
	const addTagButton = document.getElementById("add-tag-button"); // タグ追加ボタン
	const tagList = document.getElementById("tag-list"); // タグリストの表示領域
	const tagCharCounter = document.getElementById("tag-char-counter"); // タグ文字数カウンター
	const tagCounter = document.getElementById("tag-counter"); // タグ数カウンター
	const maxTags = 10; // 最大タグ数
	const maxTagChars = 30; // タグ1つの最大文字数

	// 初期タグを追加
	initialTags.forEach((tag) => addTag(tag));

	/**
	 * タグ入力イベントの設定
	 * - 入力内容にスペースが含まれている場合はエラー表示
	 * - 入力文字数をリアルタイムでカウント
	 */
	tagInput.addEventListener("input", () => {
		// スペースを含む場合の処理
		if (/\s/.test(tagInput.value)) {
			if (!document.getElementById("space-error")) {
				const errorMessage = document.createElement("div");
				errorMessage.id = "space-error";
				errorMessage.textContent = "スペースは使用できません。";
				errorMessage.className = "text-red-600 text-sm";
				tagCharCounter.parentNode.insertBefore(errorMessage, tagCharCounter);
			}
			// 入力値からスペースを削除
			tagInput.value = tagInput.value.replace(/\s/g, "");
		} else {
			// エラーメッセージを削除
			const existingError = document.getElementById("space-error");
			if (existingError) existingError.remove();
		}

		// 入力文字数を更新
		const currentLength = tagInput.value.length;
		tagCharCounter.textContent = `${currentLength} / ${maxTagChars}文字`;

		// 最大文字数を超えた場合の処理
		if (currentLength > maxTagChars) {
			tagInput.value = tagInput.value.slice(0, maxTagChars); // 入力値を制限
			tagCharCounter.textContent = `${maxTagChars} / ${maxTagChars}文字`;
		}
	});

	/**
	 * タグ追加ボタンのクリックイベントを設定
	 */
	addTagButton.addEventListener("click", () => {
		const tagName = tagInput.value.trim(); // 入力値をトリム
		const tagCount = tagList.children.length; // 現在のタグ数

		// バリデーションチェック
		if (!tagName) {
			alert("タグを入力してください。");
			return;
		}

		if (tagCount >= maxTags) {
			alert("これ以上タグを追加できません。");
			return;
		}

		if (isDuplicateTag(tagName)) {
			alert("このタグはすでに追加されています。");
			return;
		}

		if (tagName.length > maxTagChars) {
			alert(`タグは${maxTagChars}文字以内で入力してください。`);
			return;
		}

		// タグを追加してリストをソート
		addTag(tagName);
		sortTags();

		// 入力欄をクリア
		tagInput.value = "";
		tagCharCounter.textContent = `0 / ${maxTagChars}文字`;
	});

	/**
	 * タグを追加する関数
	 * @param {string} tagName - 追加するタグ名
	 */
	function addTag(tagName) {
		// タグ要素を作成
		const tagItem = document.createElement("span");
		tagItem.className =
			"tag-item relative flex items-center gap-1 rounded bg-gray-200 px-2 py-1 overflow-hidden whitespace-nowrap";
		tagItem.setAttribute("data-tag-name", tagName);

		// タグ名を表示する要素
		const tagNameSpan = document.createElement("span");
		tagNameSpan.className = "truncate";
		tagNameSpan.style.marginRight = "32px";
		tagNameSpan.textContent = `#${tagName}`;

		// タグ削除ボタン
		const removeButton = document.createElement("button");
		removeButton.className =
			"remove-tag-button absolute right-1 top-1 flex items-center justify-center w-6 h-6";
		removeButton.innerHTML = `<img src="${cancelIconPath}" alt="削除" class="w-full h-full">`;
		removeButton.addEventListener("click", () => {
			tagItem.remove(); // タグを削除
			updateTagListState(); // タグリストの状態を更新
		});

		// タグ要素をタグリストに追加
		tagItem.appendChild(tagNameSpan);
		tagItem.appendChild(removeButton);
		tagList.appendChild(tagItem);

		// タグリストの状態を更新
		updateTagListState();
	}

	/**
	 * タグリストを文字数順に並び替える関数
	 */
	function sortTags() {
		const tags = Array.from(tagList.children);
		tags.sort(
			(a, b) =>
				a.getAttribute("data-tag-name").length -
				b.getAttribute("data-tag-name").length,
		);
		tags.forEach((tag) => tagList.appendChild(tag)); // 並び替えた順に追加
	}

	/**
	 * タグが重複しているか確認する関数
	 * @param {string} tagName - チェックするタグ名
	 * @returns {boolean} - 重複している場合は true
	 */
	function isDuplicateTag(tagName) {
		return Array.from(tagList.children).some(
			(tag) => tag.getAttribute("data-tag-name") === tagName,
		);
	}

	/**
	 * タグリストの状態を更新する関数
	 * - 現在のタグ数を表示
	 */
	function updateTagListState() {
		const tagCount = tagList.children.length;
		tagCounter.textContent = `タグ数: ${tagCount} / ${maxTags}`;
	}

	// 初期状態のタグ数を更新
	updateTagListState();
}
