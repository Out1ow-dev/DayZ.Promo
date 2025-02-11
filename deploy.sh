#!/bin/bash

# Остановить все контейнеры
docker compose down

# Очистить старые данные
sudo rm -rf CrazyDayZ.Promo/wwwroot/*

# Создать необходимые директории
./setup-folders.sh

# Пересобрать и запустить контейнеры
docker compose up -d --build 