FROM php:8.1-apache

# Instalar extensiones de PHP necesarias para MySQL
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Habilitar mod_rewrite para soporte de .htaccess en Apache
RUN a2enmod rewrite

# Ajustar directorio de trabajo
WORKDIR /var/www/html
