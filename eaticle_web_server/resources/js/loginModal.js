document.addEventListener("DOMContentLoaded", () => {
	const loginButton = document.getElementById("login-button");
	const loginModal = document.getElementById("login-modal");
	const closeModal = document.getElementById("close-modal");

	if (loginButton && loginModal && closeModal) {
		loginButton.addEventListener("click", () => {
			loginModal.classList.remove("hidden");
		});

		closeModal.addEventListener("click", () => {
			loginModal.classList.add("hidden");
		});

		loginModal.addEventListener("click", (event) => {
			if (event.target === loginModal) {
				loginModal.classList.add("hidden");
			}
		});
	}
});
