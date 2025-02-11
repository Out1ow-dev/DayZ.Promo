#!/bin/bash
# Создаем директории
mkdir -p CrazyDayZ.Promo/wwwroot/qr-codes
mkdir -p CrazyDayZ.Promo/wwwroot/promo-images
mkdir -p CrazyDayZ.Promo/wwwroot/images

# Устанавливаем права на директории
sudo chown -R 1000:1000 CrazyDayZ.Promo/wwwroot
sudo chmod -R 777 CrazyDayZ.Promo/wwwroot 