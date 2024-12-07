document.addEventListener("DOMContentLoaded", () => {
	const userIconButton = document.getElementById("user-icon-button");
	const dropdownMenu = document.getElementById("dropdown-menu");

	// トグル表示
	userIconButton.addEventListener("click", () => {
		dropdownMenu.classList.toggle("hidden");
	});

	// 外部クリックでメニューを閉じる
	document.addEventListener("click", (event) => {
		if (
			!dropdownMenu.contains(event.target) &&
			!userIconButton.contains(event.target)
		) {
			dropdownMenu.classList.add("hidden");
		}
	});
});
