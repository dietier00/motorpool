# Stage 1: Build Node.js assets
FROM node:22-alpine AS node-builder

WORKDIR /build

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY resources/ ./resources/
COPY assets/ ./assets/
COPY vite.config.js postcss.config.js tailwind.config.js ./
COPY jsconfig.json ./

# Build assets
RUN npm run build

# Stage 2: PHP application
FROM php:8.3-fpm-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    build-base \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    zlib-dev \
    libzip-dev \
    oniguruma-dev \
    curl \
    git \
    postgresql-dev \
    sqlite-dev \
    nginx \
    supervisor

RUN docker-php-ext-install pdo pdo_mysql

# Install PHP extensions
RUN docker-php-ext-configure gd --with-jpeg --with-webp && \
    docker-php-ext-install -j$(nproc) \
    gd \
    zip \
    mbstring \
    pdo \
    pdo_pgsql \
    pdo_sqlite \
    opcache

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application files
COPY . .

# Copy built assets from Node stage
COPY --from=node-builder /build/public/build ./public/build

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Create necessary directories with proper permissions
RUN mkdir -p storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache && \
    chown -R www-data:www-data /app && \
    chmod -R 755 /app && \
    chmod -R 775 storage bootstrap/cache

# Set environment
ENV APP_ENV=production
ENV LOG_CHANNEL=stack
ENV CACHE_STORE=file
ENV SESSION_DRIVER=cookie

# Copy Nginx configuration
COPY docker/nginx.conf /etc/nginx/http.d/default.conf

# Copy Supervisor configuration
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy startup script
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8000

CMD ["/start.sh"]
