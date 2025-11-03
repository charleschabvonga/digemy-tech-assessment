<?php

namespace App\Http\Controllers\API\V1\Invoices;

use App\Domain\Invoices\Contracts\InvoicePaymentServiceInterface;
use App\Http\Controllers\Controller;
use App\Models\Invoice;

class SendInvoiceToCustomerController extends Controller
{
  public function __invoke(Invoice $invoice, InvoicePaymentServiceInterface $svc)
  {
    return $svc->sendInvoiceToCustomer($invoice);
  }
}

