<?php

namespace App\Http\Controllers\API\V1\Payments;

use App\Domain\Invoices\Contracts\PaymentServiceInterface;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Payment;

class ReversePaymentController extends Controller
{
  public function __invoke(
    Invoice $invoice,
    Payment $payment,
    PaymentServiceInterface $paymentService
  )
  {
    abort_unless($payment->invoice_id === $invoice->id, 404);
    
    $paymentService->deletePayment($payment);

    return response()->noContent();
  }
}

