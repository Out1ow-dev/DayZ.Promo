#!/bin/bash

# Создаем директорию для данных PostgreSQL
mkdir -p .containers/servers-db

# Устанавливаем правильные права
sudo chown -R 999:999 .containers/servers-db
sudo chmod -R 700 .containers/servers-db

# Создаем директории для wwwroot
mkdir -p CrazyDayZ.Promo/wwwroot/qr-codes
mkdir -p CrazyDayZ.Promo/wwwroot/promo-images
mkdir -p CrazyDayZ.Promo/wwwroot/images

# Устанавливаем права для wwwroot
sudo chmod -R 777 CrazyDayZ.Promo/wwwroot 