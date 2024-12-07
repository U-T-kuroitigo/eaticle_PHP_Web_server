@vite(['resources/js/userDropdown.js'])


<div id="dropdown-menu" class="absolute right-0 mt-2 hidden w-32 rounded-md bg-white shadow-lg">
  <a href="/user-page/{{ $eaticleId }}/article"
    class="block px-2 py-2 text-center text-sm text-gray-700 hover:bg-gray-100">
    マイページ
  </a>
  <form method="POST" action="/logout" class="block">
    @csrf
    <button type="submit"
      class="w-full px-2 py-2 text-center text-sm text-gray-700 hover:bg-gray-100 focus:outline-none">
      ログアウト
    </button>
  </form>
</div>
