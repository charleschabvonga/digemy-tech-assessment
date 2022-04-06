<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400"></a></p>

<p align="center">
<a href="https://travis-ci.org/laravel/framework"><img src="https://travis-ci.org/laravel/framework.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

# Installation

Please ensure you have the latest version of docker installed in your local machine.

After cloning the repository in you machine, please follow the following instructions.

    $ cd digemy-tech-assessment/
    $ cp .docker/docker-compose.local.yml docker-compose.yml
    $ cp .env.example .env
    $ docker-compose up -d

After docker has finished building the containers, you can then install the packages.

    $ docker exec -i digemy-tech-assessment-app-1 composer install
    $ docker exec -i digemy-tech-assessment-app-1 php artisan key:generate
    $ docker exec -i digemy-tech-assessment-app-1 php artisan optimize
    $ docker exec -i digemy-tech-assessment-app-1 php artisan migrate

The application should run on **http://localhost:8000**
