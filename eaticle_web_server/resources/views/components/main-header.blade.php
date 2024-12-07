<header class="flex w-full items-center justify-between bg-gray-100 px-4 py-4">
  <!-- サービスロゴ -->
  <a href="/article/list"
    class="flex h-10 items-center justify-center rounded-lg bg-custom-orange px-4 font-tattoo text-2xl font-[500] text-white">
    eaticle
  </a>

  <!-- 動的な部分 -->
  <div class="flex items-center gap-4">
    @if (!$isLoggedIn)
      <!-- 未ログイン状態 -->
      <button id="login-button" class="flex h-10 items-center justify-center rounded bg-gray-200 px-4 text-black">
        ログイン
      </button>
    @else
      <!-- ログイン済み状態 -->
      @if (!$isMyPage)
        <!-- 通常のログイン済み -->
        <div class="relative">
          <!-- ユーザーアイコン -->
          <button id="user-icon-button" class="flex items-center">
            <img src="{{ $userImg }}" alt="User Icon" class="h-10 w-10 rounded-full">
          </button>

          <!-- ドロップダウンメニュー -->
          @include('components.user-dropdown', ['eaticleId' => '仮のeaticle_id'])
          {{-- @include('components.user-dropdown', ['eaticleId' => session('eaticle_id', '仮のeaticle_id')]) --}}
        </div>
        <a href="/article/create"
          class="flex h-10 items-center justify-center gap-2 rounded bg-[#F5A77A] px-3 text-white transition hover:bg-[#e48f6e] md:px-4">
          <img src="/images/pen.svg" alt="Pen Icon" class="h-5 w-5" />
          <span class="hidden md:inline">投稿</span>
        </a>
      @else
        <!-- マイページ -->
        <div class="flex h-10 items-center gap-2">
          <div class="relative">
            <!-- ユーザーアイコン -->
            <button id="user-icon-button" class="flex items-center">
              <img src="{{ $userImg }}" alt="User Icon" class="h-10 w-10 rounded-full">
            </button>

            <!-- ドロップダウンメニュー -->
            @include('components.user-dropdown', ['eaticleId' => '仮のeaticle_id'])
            {{-- @include('components.user-dropdown', ['eaticleId' => session('eaticle_id', '仮のeaticle_id')]) --}}
          </div>

          <span class="hidden md:inline">{{ $userName }}</span>
        </div>
      @endif
    @endif
  </div>
</header>

@include('components.login-modal')
