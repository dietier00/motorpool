#!/bin/sh
set -e

# Generate application key if not set
if [ -z "$APP_KEY" ]; then
    php /app/artisan key:generate
fi

# Run database migrations
php /app/artisan migrate --force

# Run Supervisor to manage PHP-FPM, Nginx, and Queue Worker
/usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
