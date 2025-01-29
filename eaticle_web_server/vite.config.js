import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";

export default defineConfig({
	plugins: [
		laravel({
			input: [
				"resources/css/app.css",
				"resources/js/app.js",
				"resources/js/articleList.js",
				"resources/js/loginModal.js",
			],
			refresh: true,
		}),
	],
	build: {
		outDir: "public/build", // ビルド先ディレクトリ
		assetsDir: "", // アセットは直接build配下に配置
		manifest: true, // LaravelがアセットのURLを正しく認識するために必要
		rollupOptions: {
			output: {
				entryFileNames: "assets/[name]-[hash].js",
				chunkFileNames: "assets/[name]-[hash].js",
				assetFileNames: "assets/[name]-[hash].[ext]",
			},
		},
	},
});
