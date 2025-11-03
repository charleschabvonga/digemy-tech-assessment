<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Domain\Invoices\Contracts\InvoicePaymentServiceInterface;
use App\Domain\Invoices\Services\InvoicePaymentService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(InvoicePaymentServiceInterface::class, InvoicePaymentService::class);
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
