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

    $ docker-compose exec app bash
    $ composer install
    $ php artisan migrate
    $ php artisan db:seed

The application should run on **http://localhost:8000**

# Assessment

### Introduction

Please note that there is no wrong answer here. We want to assess how you tackle an issue, the steps you take to resolve a problem in Laravel, and how readable and robust is your code vs the business requirement. Most importantly, we also want to assess whether you can actually look at external packages, and learn and use them efficiently in our code base.

### Story

Let’s assume that we have a client that has an invoicing application. For the sake of this assessment, we will disregard customers and invoice line items and rather concentrate
on the total amount of the invoice.

We want to be able to change the state of an invoice based on the payment received for it.


For example, when an invoice total amount is R100.00, and we receive a payment of R10.00, the invoice state should change from “awaiting payment” to “partially paid”.
Similarly, when we receive an amount equal to the invoice’s total amount, its state should change to “paid in full”.
If a payment is deleted for that invoice, we should be able to also revert the state to partially paid or awaiting payment, depending on the total payments remaining after a payment is deleted.

What you will do

1. Create an invoices table to hold a title, a description of the invoice, and the total amount
2. Create a payments table where all the payments for the invoices will be logged
3. Build a state management logic for the scenario mentioned above. We require that you make use of (https://github.com/spatie/laravel-model-states) [Spatie laravel model states).
4. Please build a simple UI to showcase how your logic works or write tests.


Hints

* The default state of an invoice is "created"
* We can start logging payments for the invoice only when the invoice state is changed to "awaiting-payment"
* When a partial payment is received, the invoice state should change to "partially-paid"
* When a full payment is received, the invoice state should change to "fully-paid"
* When a payment is deleted, we need to revert back to "partially paid" or "awaiting payment" depending on the payment amount deleted

Good luck! We look forward to seeing your work 😃.


