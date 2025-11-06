<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Domain\Invoices\Contracts\PaymentServiceInterface;
use App\Domain\Invoices\Services\PaymentService;
use App\Domain\Invoices\Contracts\InvoiceServiceInterface;
use App\Domain\Invoices\Services\InvoiceService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(PaymentServiceInterface::class, PaymentService::class);
        $this->app->bind(InvoiceServiceInterface::class, InvoiceService::class);
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
