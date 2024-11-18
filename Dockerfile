# ベースイメージ
FROM node:20

# アプリケーションディレクトリを作成
WORKDIR /app

# アプリケーションの依存関係をインストール
# COPY package*.json ./
# RUN npm install

# アプリケーションのソースをバンドル (.venv, .vnodeenv, node_modulesフォルダを除く)
# COPY . .
# RUN rm -rf .venv .vnodeenv node_modules

RUN npm install -g serve
RUN apt-get update && apt-get install -y xsel --no-install-recommends && rm -rf /var/lib/apt/lists/*

EXPOSE 3000
