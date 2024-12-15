<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>記事編集</title>
  {{-- @vite(['resources/css/app.css', 'resources/js/app.js', 'resources/js/articleEdit.js']) --}}
  @vite(['resources/css/app.css', 'resources/js/app.js', 'resources/js/articleEdit/main.js'])
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/easymde/dist/easymde.min.css">

  <script>
    const placeholderImage = "{{ asset('images/templates/image_placeholder.png') }}";
    const cancelIconPath = "{{ asset('images/cancel_icon_red.svg') }}";
  </script>
</head>

<body class="bg-gray-100">
  <div class="container mx-auto my-4">
    <!-- ヘッダー -->
    <header class="flex items-center justify-between bg-gray-100 px-4 py-4">
      <!-- 左側ボタン -->
      <button id="close-button" class="rounded bg-gray-300 px-4 py-2 text-black">
        閉じる
      </button>

      <!-- 右側ボタン -->
      <div class="flex items-center gap-2">
        <button id="save-private-button" class="rounded bg-gray-300 px-4 py-2 text-black">
          下書き保存
        </button>
        <button id="save-public-button" class="rounded bg-gray-300 px-4 py-2 text-black">
          公開
        </button>
      </div>
    </header>





    <div class="container mx-auto">
      <div class="container mx-auto px-4 lg:px-48">

        <!-- サムネイルゾーン -->
        <div class="my-4">
          <label class="block text-sm font-medium text-gray-700">サムネイル画像</label>
          <div class="aspect-h-9 aspect-w-16 relative mt-2">
            <input type="file" id="thumbnail-upload" accept="image/*" class="hidden" />
            <label for="thumbnail-upload" class="cursor-pointer">
              <img
                src="{{ !empty($article['article_thumbnail_path']) ? $article['article_thumbnail_path'] : asset('images/templates/image_placeholder.png') }}"
                alt="サムネイルプレビュー" id="thumbnail-preview"
                class="absolute inset-0 h-full w-full rounded border object-contain" />
            </label>
          </div>
        </div>

        <!-- 記事タイトルゾーン -->
        <div class="my-4">
          <label for="title" class="block text-sm font-medium text-gray-700">記事タイトル</label>
          <textarea name="title" id="title" rows="3"
            class="mt-1 block w-full resize-none rounded border px-4 py-2 shadow-sm" placeholder="記事タイトルを入力してください">{{ $article['article_title'] }}</textarea>
          <div id="title-char-counter" class="mt-1 text-sm text-gray-600">
            0 / 100文字
          </div>
        </div>



        <!-- タグゾーン -->
        <div class="my-4">
          <label for="tag-input" class="block text-sm font-medium text-gray-700">タグ</label>
          <div class="mt-2 flex items-center gap-2">
            <input type="text" id="tag-input" class="max-w-60 min-w-32 flex-1 rounded border px-4 py-2 shadow-sm"
              placeholder="#タグ" aria-label="タグ入力" maxlength="30">
            <button id="add-tag-button" class="flex-shrink-0 rounded bg-gray-300 px-3 py-2" aria-label="タグ追加">
              ＋
            </button>
          </div>
          <!-- 現在の文字数表示 -->
          <div id="tag-char-counter" class="mt-1 text-sm text-gray-600">
            0 / 30文字
          </div>
          <!-- 現在のタグ数表示 -->
          <div id="tag-counter" class="mt-1 text-sm text-gray-600">
            タグ数: 0 / 10
          </div>
          <!-- タグリスト -->
          <div id="tag-list" class="mt-2 flex flex-wrap gap-2"></div>
        </div>

        <!-- 初期タグデータを JSON 形式で埋め込む -->
        <script id="tag-data" type="application/json">
					@json(array_map(fn($tag) => $tag['article_tag_name'], $article['article_tag_list']['list']))
				</script>


        <!-- 本文ゾーン -->
        <div class="my-4">
          <label for="content" class="block text-sm font-medium text-gray-700">本文</label>
          <textarea id="content-editor" rows="10" class="w-full">{{ $article['article_body'] }}</textarea>
        </div>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/easymde/dist/easymde.min.js"></script>
  {{-- <script src="/resources/js/articleEdit.js"></script> --}}
</body>

</html>
