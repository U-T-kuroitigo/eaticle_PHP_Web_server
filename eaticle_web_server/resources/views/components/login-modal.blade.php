@vite(['resources/js/loginModal.js'])

<!-- モーダル（ポップアップ） -->
<div id="login-modal" class="modal fixed inset-0 z-50 flex hidden items-center justify-center bg-black bg-opacity-50">
  <div class="modal-content relative w-80 rounded-lg bg-white p-6 text-center">
    <h2 class="mb-4 text-xl font-bold">ログイン</h2>
    <div class="flex flex-col gap-4">
      <!-- Google -->
      <a href="/auth/google"
        class="flex items-center justify-center gap-2 rounded border bg-white px-4 py-2 text-black shadow hover:bg-gray-100">
        <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google Logo" class="h-5 w-5" />
        <span>Sign in with Google</span>
      </a>
      {{--
     <!-- GitHub -->
     <a href="/auth/github"
     class="flex items-center justify-center gap-2 rounded border bg-gray-800 px-4 py-2 text-white shadow hover:bg-gray-700">
     <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub Logo"
     class="h-5 w-5">
     <span>Sign in with GitHub</span>
     </a>
     <!-- Twitter -->
     <a href="/auth/twitter"
     class="flex items-center justify-center gap-2 rounded border bg-blue-500 px-4 py-2 text-white shadow hover:bg-blue-400">
     <img src="https://abs.twimg.com/icons/apple-touch-icon-192x192.png" alt="Twitter Logo" class="h-5 w-5">
     <span>Sign in with Twitter</span>
     </a>
   --}}
    </div>
    <button id="close-modal" class="mt-4 w-full rounded bg-gray-200 py-2 text-black">
      閉じる
    </button>
  </div>
</div>
