#!/bin/bash

# Остановить контейнеры
docker compose down

# Удалить данные базы
sudo rm -rf .containers/servers-db/*

# Пересоздать директории
mkdir -p .containers/servers-db
chmod -R 777 .containers/servers-db

# Запустить контейнеры
docker compose up -d 