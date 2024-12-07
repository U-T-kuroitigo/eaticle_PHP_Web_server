<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- ページネーション情報 -->
  <meta name="pagination-offset" content="{{ $pagination['offset'] ?? 0 }}" />
  <meta name="pagination-has-more"
    content="{{ isset($pagination['has_more']) && $pagination['has_more'] ? 'true' : 'false' }}" />

  <title>記事一覧</title>
  @vite(['resources/css/app.css', 'resources/js/app.js', 'resources/js/articleList.js'])
</head>

<body>
  <!-- ヘッダー -->
  @include('components.main-header', [
      'isLoggedIn' => true,
      'userImg' => asset('images/templates/user_icon.png'), // 仮置きユーザーアイコン
      'isMyPage' => false,
      'userName' => '仮のアカウント名', // 仮置きユーザーネーム
  ])

  {{--
    @include('components.main-header', [
    'isLoggedIn' => true,
    'userImg' => asset('images/templates/user_icon.png'), // 仮置きユーザーアイコン
    'isMyPage' => true,
    'userName' => '仮のアカウント名', // 仮置きユーザーネーム
    ])
  --}}

  {{-- @include('components.main-header', ['isLoggedIn' => false]) --}}

  {{--
    'userImg' => asset('images/templates/user_icon.png'), // TODO: セッションからユーザー情報を取得する
    'userName' => '仮のアカウント名', // TODO: セッションからユーザー情報を取得する

    'userImg' => session('userImg', asset('images/templates/user_icon.png')),
    'userName' => session('userName', 'デフォルトのアカウント名'),
  --}}

  <div class="container mx-auto">
    <div class="container mx-auto px-4 lg:px-16">
      <!-- 検索とソート -->
      <div class="my-4 flex flex-col items-center justify-between gap-4 md:flex-row">
        <!-- 検索フォーム -->
        <div class="flex w-full flex-grow items-center gap-2 md:w-auto">
          <input type="text" id="search-input" class="w-full max-w-xs rounded border px-4 py-2"
            placeholder="Search" />
          <button id="search-button" class="rounded bg-gray-200 px-4 py-2 text-black">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
              class="h-5 w-5">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-4.35-4.35M16.65 16.65a7.65 7.65 0 10-10.8 0 7.65 7.65 0 0010.8 0z" />
            </svg>
          </button>
        </div>

        <!-- ソートプルダウン -->
        <div class="w-full md:w-auto">
          <select id="sort-select" class="w-full max-w-xs rounded border px-4 py-2 md:w-auto">
            <option value="created_at_desc">作成日時降順</option>
            <option value="created_at_asc">作成日時昇順</option>
            <option value="updated_at_desc">更新日時降順</option>
            <option value="updated_at_asc">更新日時昇順</option>
          </select>
        </div>
      </div>

      <!-- 記事リスト -->
      <div id="article-list" class="my-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        @foreach ($articles as $article)
          <div class="relative block">
            <!-- サムネイル画像とタイトル -->
            <a href="/article/detail/{{ $article['article_id'] }}" class="group block">
              <div class="aspect-h-9 aspect-w-16 relative overflow-hidden bg-gray-200">
                <img src="{{ $article['article_thumbnail_path'] ?: asset('images/templates/no_image.png') }}"
                  alt="Thumbnail"
                  class="absolute inset-0 h-full w-full object-contain transition duration-200 group-hover:opacity-50" />
              </div>
              <h2 class="mt-2 line-clamp-3 max-h-[5rem] text-xl font-semibold leading-tight">
                {{ $article['article_title'] }}
              </h2>
            </a>

            <!-- ユーザー情報と作成日時 -->
            <div class="mt-3 flex justify-between">
              <!-- ユーザー情報 -->
              <a href="{{ env('EXTERNAL_API_URL') }}/user-page/{{ $article['eaticle_id'] }}/article"
                class="flex items-center">
                <img src="{{ $article['user_img'] ?: asset('images/templates/user_icon.png') }}" alt="User Icon"
                  class="mr-2 h-6 w-6 rounded-full" />
                <span>{{ $article['user_name'] }}</span>
              </a>

              <!-- 作成日時 -->
              <span class="whitespace-nowrap text-sm text-gray-500">
                {{ \Carbon\Carbon::parse($article['created_at'])->format('Y年n月j日 G:i') }}
              </span>
            </div>
          </div>
        @endforeach
      </div>
    </div>

    <!-- ローディング表示 -->
    <div id="loading-indicator" class="hidden py-4 text-center">
      読み込み中...
    </div>
  </div>
  <script>
    const externalApiUrl = '{{ env('EXTERNAL_API_URL') }}';
  </script>
</body>

</html>
