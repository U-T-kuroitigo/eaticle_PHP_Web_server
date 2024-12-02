<?php

use PhpCsFixer\Config;
use PhpCsFixer\Finder;

$finder = Finder::create()
	->in(__DIR__) // プロジェクト全体を対象
	->exclude(['vendor', 'storage', 'bootstrap/cache']) // 除外するディレクトリ
	->name('*.php') // PHPファイルのみを対象
	->ignoreDotFiles(true)
	->ignoreVCS(true);

return (new Config())
	->setRules([
		'@PSR12' => true, // PSR-12規約に準拠
		'array_syntax' => ['syntax' => 'short'], // 配列を短縮構文に
		'no_unused_imports' => true, // 未使用のuse文を削除
		'single_quote' => true, // シングルクォートを使用
		'no_extra_blank_lines' => true, // 余分な空行を削除
		'no_trailing_whitespace' => true, // 行末の空白を削除
		'indentation_type' => true, // インデントをタブに統一
	])
	->setIndent("\t") // インデントをタブ文字に設定
	->setLineEnding("\n") // 改行コードを統一
	->setFinder($finder);
