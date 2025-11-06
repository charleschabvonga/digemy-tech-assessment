<?php

namespace App\Http\Controllers\API\V1\Payments;

use App\Domain\Invoices\Contracts\PaymentServiceInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\StorePaymentRequest;
use App\Models\Invoice;

class MakePaymentController extends Controller
{
  public function __invoke(
    Invoice $invoice,
    StorePaymentRequest $request,
    PaymentServiceInterface $paymentService
  )
  {
    $payment = $paymentService->makePayment($invoice, $request->toDTO());
    return response()->json($payment, 201);
  }
}

