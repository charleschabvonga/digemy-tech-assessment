<?php

namespace App\Http\Controllers\API\V1\Payments;

use App\Domain\Invoices\Contracts\InvoicePaymentServiceInterface;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Payment;

class ReversePaymentController extends Controller
{
  public function __invoke(Invoice $invoice, Payment $payment, InvoicePaymentServiceInterface $svc)
  {
    abort_unless($payment->invoice_id === $invoice->id, 404);
    $svc->deletePayment($payment);
    return response()->noContent();
  }
}

