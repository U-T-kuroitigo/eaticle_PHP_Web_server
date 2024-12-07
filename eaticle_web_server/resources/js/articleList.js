document.addEventListener("DOMContentLoaded", () => {
	// 状態管理用
	let offset = parseInt(
		document.querySelector('meta[name="pagination-offset"]').content,
	);
	let hasMore =
		document.querySelector('meta[name="pagination-has-more"]').content ===
		"true";

	// 初期値をURLクエリパラメータから取得
	const urlParams = new URLSearchParams(window.location.search);
	let searchQuery = urlParams.get("search") || ""; // 検索条件
	let sortOrder = urlParams.get("sort") || "created_at_desc"; // ソート条件

	// 検索フォームとソートプルダウンに初期値を設定
	const searchInput = document.getElementById("search-input");
	const searchButton = document.getElementById("search-button");
	const sortSelect = document.getElementById("sort-select");
	if (searchInput) searchInput.value = searchQuery;
	if (sortSelect) sortSelect.value = sortOrder;

	const articleList = document.getElementById("article-list");
	const loadingIndicator = document.getElementById("loading-indicator");
	let isLoading = false;

	// 共通のデータ取得関数
	const fetchArticles = async (url, append = false) => {
		try {
			const response = await fetch(url);

			if (!response.ok) {
				throw new Error("記事の取得に失敗しました");
			}

			const data = await response.json();

			const articleListData =
				data.article_list || data.data?.article_list || [];
			const paginationData = data.pagination ||
				data.data?.pagination || { has_more: false, offset: 0 };

			if (!append) {
				articleList.innerHTML = ""; // 現在の記事をクリア
				offset = 0; // ページネーションリセット
			}

			articleListData.forEach((article) => {
				const articleItem = createArticleItem(article);
				articleList.appendChild(articleItem);
			});

			offset = append ? offset + 15 : 0;
			hasMore = paginationData.has_more;
		} catch (error) {
			console.error("記事の取得に失敗しました:", error);
		} finally {
			isLoading = false;
			loadingIndicator.classList.add("hidden");
		}
	};

	// 記事要素を作成
	const createArticleItem = (article) => {
		const articleItem = document.createElement("div");
		articleItem.className = "relative block";
		articleItem.innerHTML = `
    <!-- サムネイル画像とタイトル -->
    <a href="/article/detail/${article.article_id}" class="group block">
      <div class="aspect-h-9 aspect-w-16 relative overflow-hidden bg-gray-200">
        <img src="${article.article_thumbnail_path || "/images/templates/no_image.png"}"
             alt="Thumbnail"
             class="absolute inset-0 h-full w-full object-contain transition duration-200 group-hover:opacity-50" />
      </div>
      <h2 class="mt-2 line-clamp-3 max-h-[5rem] text-xl font-semibold leading-tight">
        ${article.article_title}
      </h2>
    </a>

    <!-- ユーザー情報と作成日時 -->
    <div class="mt-3 flex justify-between">
      <!-- ユーザー情報 -->
      <a href="${externalApiUrl}/user-page/${article.eaticle_id}/article"
         class="flex items-center">
        <img src="${article.user_img || "/images/templates/user_icon.png"}" alt="User Icon"
             class="mr-2 h-6 w-6 rounded-full" />
        <span>${article.user_name}</span>
      </a>

      <!-- 作成日時 -->
      <span class="whitespace-nowrap text-sm text-gray-500">
        ${new Date(article.created_at).toLocaleString("ja-JP", {
					year: "numeric",
					month: "numeric",
					day: "numeric",
					hour: "2-digit",
					minute: "2-digit",
				})}
      </span>
    </div>
  `;
		return articleItem;
	};

	// 初期ロード時に検索条件とソート条件を使って記事を取得
	const initialUrl = `/api/article/list?offset=0&search=${encodeURIComponent(
		searchQuery,
	)}&sort=${sortOrder}`;
	fetchArticles(initialUrl);

	// URLを更新する関数
	const updateUrl = () => {
		const newUrl = `/article/list?offset=0&search=${encodeURIComponent(
			searchQuery,
		)}&sort=${sortOrder}`;
		history.pushState(null, "", newUrl);
	};

	// スクロールイベントでページネーション実行
	window.addEventListener("scroll", () => {
		if (
			window.innerHeight + window.scrollY >=
			document.body.offsetHeight - 100
		) {
			if (!isLoading && hasMore) {
				isLoading = true;
				loadingIndicator.classList.remove("hidden");

				const url = `/api/article/list?offset=${offset + 15}&search=${encodeURIComponent(
					searchQuery,
				)}&sort=${sortOrder}`;
				fetchArticles(url, true);
			}
		}
	});

	// 検索・ソートイベント
	searchButton.addEventListener("click", () => {
		searchQuery = searchInput.value;
		sortOrder = sortSelect.value;
		updateUrl();

		const url = `/api/article/list?offset=0&search=${encodeURIComponent(
			searchQuery,
		)}&sort=${sortOrder}`;
		fetchArticles(url);
	});

	sortSelect.addEventListener("change", () => {
		searchQuery = searchInput.value;
		sortOrder = sortSelect.value;
		updateUrl();

		const url = `/api/article/list?offset=0&search=${encodeURIComponent(
			searchQuery,
		)}&sort=${sortOrder}`;
		fetchArticles(url);
	});

	// ブラウザの戻る・進むボタン対応
	window.addEventListener("popstate", () => {
		const urlParams = new URLSearchParams(window.location.search);
		searchQuery = urlParams.get("search") || "";
		sortOrder = urlParams.get("sort") || "created_at_desc";

		if (searchInput) searchInput.value = searchQuery;
		if (sortSelect) sortSelect.value = sortOrder;

		const url = `/api/article/list?offset=0&search=${encodeURIComponent(
			searchQuery,
		)}&sort=${sortOrder}`;
		fetchArticles(url);
	});
});
