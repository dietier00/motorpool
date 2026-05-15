#!/bin/sh
set -e

# 1. Handle the Port (Crucial for Render)
# Replaces ${PORT} in your nginx config with the one Render provides.
export PORT=${PORT:-10000}
envsubst '${PORT}' < /etc/nginx/http.d/default.conf > /etc/nginx/http.d/default.conf.tmp && mv /etc/nginx/http.d/default.conf.tmp /etc/nginx/http.d/default.conf

# 2. App Setup & Migrations
# Only generate key if missing (though you should set this in Render Dashboard)
if [ -z "$APP_KEY" ]; then
    php /app/artisan key:generate --force
fi

# Run migrations automatically
 php /app/artisan migrate --force

# 3. Production Optimizations
# php /app/artisan config:cache
# php artisan route:cache
# php artisan view:cache

# 4. Start the Engine
# Using 'exec' ensures supervisor becomes PID 1 and handles signals correctly.
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf