docker-compose exec app rm -rf vendor composer.lock
docker-compose exec app composer install
docker-compose exec app php artisan key:generate