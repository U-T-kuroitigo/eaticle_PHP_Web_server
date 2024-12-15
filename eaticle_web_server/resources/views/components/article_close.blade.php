<!-- モーダル (閉じる確認) -->
<div id="close-modal" class="fixed inset-0 z-50 flex hidden items-center justify-center bg-gray-800 bg-opacity-50">
  <div class="w-11/12 max-w-md rounded-lg bg-white p-6 shadow-lg">
    <h2 class="mb-4 text-lg font-bold">確認</h2>
    <p class="mb-4">変更を保存しますか？</p>
    <div class="flex justify-end gap-4">
      <!-- 下書き保存 -->
      <button id="save-draft-button" class="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400">
        下書き保存
      </button>
      <!-- 閉じる -->
      <button id="confirm-close-button" class="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">
        閉じる
      </button>
      <!-- キャンセル -->
      <button id="cancel-modal-button" class="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400">
        キャンセル
      </button>
    </div>
  </div>
</div>
