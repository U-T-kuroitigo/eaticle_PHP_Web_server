/**
 * URL から記事 ID を取得する関数
 * - 現在のページの URL を解析し、記事の編集ページから記事 ID を抽出します。
 * @returns {string|null} 記事 ID (該当するものがない場合は null を返す)
 */
export function getArticleIdFromUrl() {
	const url = window.location.href; // 現在の URL を取得
	const matches = url.match(/\/article\/([a-zA-Z0-9-]+)\/edit/); // 記事 ID を抽出する正規表現
	return matches ? matches[1] : null; // マッチした場合は記事 ID を返す、マッチしない場合は null
}
