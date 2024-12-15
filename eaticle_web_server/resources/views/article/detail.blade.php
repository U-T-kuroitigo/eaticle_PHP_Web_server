<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>記事詳細</title>
  @vite(['resources/css/app.css'])
</head>

<body>
  <!-- ヘッダー -->
  @include('components.main-header', [
      'isLoggedIn' => session()->has('user_id'),
      'userImg' => session()->has('user_id') ? asset('images/templates/user_icon.png') : null, // 仮置きのユーザーアイコン
      'isMyPage' => false, // 必要に応じて動的に設定可能
      'userName' => session()->has('user_id') ? '仮のアカウント名' : null, // 仮置きのユーザーネーム
  ])

  <div class="container mx-auto my-8 px-4 lg:px-48">

    <!-- 編集ボタン -->
    @if (session()->has('user_id') && $article['user_id'] == session('user_id'))
      <div class="my-4 flex justify-end">
        <a href="{{ url('article/' . $article['article_id'] . '/edit') }}"
          class="rounded bg-blue-500 px-4 py-2 text-white shadow hover:bg-blue-600">
          編集
        </a>
      </div>
    @endif


    <div class="my-4">
      <div class="aspect-h-9 aspect-w-16 relative mt-2">
        <img
          src="{{ !empty($article['article_thumbnail_path']) ? $article['article_thumbnail_path'] : asset('images/templates/no_image.png') }}"
          alt="サムネイルプレビュー" id="thumbnail-preview"
          class="absolute inset-0 h-full w-full rounded border object-contain" />
      </div>
    </div>

    <!-- タイトル -->
    <h1 class="mt-6 text-3xl font-bold text-gray-800">
      {{ $article['article_title'] }}
    </h1>

    <!-- 作成者情報 -->
    <div class="my-4 flex items-center gap-4">
      <!-- 作成者アイコン -->
      <img src="{{ $article['user_img'] }}" alt="作成者アイコン" class="h-12 w-12 rounded-full shadow">
      <div>
        <!-- 作成者ネーム -->
        <p class="text-lg font-semibold text-gray-700">
          {{ $article['user_name'] }}
        </p>
        <!-- 作成日時 -->
        <p class="text-sm text-gray-500">
          {{ \Carbon\Carbon::parse($article['created_at'])->format('Y年n月j日 G:i') }}
        </p>
      </div>
    </div>

    <!-- タグリスト -->
    @if (!empty($article['article_tag_list']['list']))
      <div class="my-4 flex flex-wrap gap-2">
        @foreach ($article['article_tag_list']['list'] as $tag)
          <a href="{{ url('article/list') . '?search=' . urlencode($tag['article_tag_name']) }}"
            class="rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 transition-shadow duration-200 hover:bg-gray-300 hover:shadow-md">
            #{{ $tag['article_tag_name'] }}
          </a>
        @endforeach
      </div>
    @endif


    <hr class="mt-8">

    <!-- 本文 -->
    <div class="prose mb-24 mt-4 max-w-none">
      {!! $article['parsed_body'] !!} <!-- MarkdownをHTMLに変換して出力 -->
    </div>

  </div>
</body>

</html>
