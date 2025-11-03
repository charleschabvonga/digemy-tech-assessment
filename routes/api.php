<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\V1\Auth\{LoginController, LogoutController};
use App\Http\Controllers\API\V1\Invoices\{InvoicesController, CreateInvoiceController, ShowInvoiceController, SendInvoiceToCustomerController};
use App\Http\Controllers\API\V1\Payments\{MakePaymentController, ReversePaymentController};

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::prefix('v1')->group(function () {
    // public auth endpoints
    Route::post('auth/login', LoginController::class);

    // protected API
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('auth/logout', LogoutController::class);

        Route::prefix('invoices')->group(function () {
            Route::get('/', InvoicesController::class)->name('invoices.index');
            Route::post('/', CreateInvoiceController::class)->name('invoices.store');
            Route::get('{invoice}', ShowInvoiceController::class)->name('invoices.show');
            Route::post('{invoice}/send', SendInvoiceToCustomerController::class)->name('invoices.send');

            Route::prefix('{invoice}/payments')->name('payments.')->scopeBindings()->group(function () {
                Route::post('/', MakePaymentController::class)->name('store');
                Route::delete('{payment}', ReversePaymentController::class)->name('destroy');
            });
        });
    });
});
