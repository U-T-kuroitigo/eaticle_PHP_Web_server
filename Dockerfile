# PHP 8.2をベースとした公式PHP-FPMイメージを使用
FROM php:8.2-fpm

# Node.jsをインストール（Viteのビルドに必要）
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs

# 必要なパッケージをインストール
RUN apt-get update && apt-get install -y \
  zip unzip git curl libpng-dev libjpeg-dev libpq-dev nginx \
  && docker-php-ext-install pdo pdo_mysql pdo_pgsql gd

# Composerをインストール
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# プロジェクトファイルをコンテナにコピー
COPY . /var/www

# 作業ディレクトリをLaravelのルートに設定
WORKDIR /var/www/docker_php_test

# Composerの依存関係をインストール
RUN composer install --no-dev --optimize-autoloader

# npmパッケージをインストール
RUN npm install

# Viteでアセットをビルド
RUN npm run build

# 権限の設定
RUN chown -R www-data:www-data /var/www/docker_php_test/storage /var/www/docker_php_test/bootstrap/cache

# NginxとPHP-FPMを起動するスクリプトをコピー
COPY ./start.sh /usr/local/bin/start.sh

# スクリプトに実行権限を付与
RUN chmod +x /usr/local/bin/start.sh

# Nginxのデフォルト設定を削除（nginx.confを使うため）
RUN rm /etc/nginx/sites-enabled/default
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# NginxとPHP-FPMを起動
CMD ["/usr/local/bin/start.sh"]

RUN npm install -D tailwindcss postcss autoprefixer

RUN npx tailwindcss init -p