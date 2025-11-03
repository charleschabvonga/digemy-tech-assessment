<?php

namespace App\Http\Controllers\API\V1\Invoices;

use App\Http\Controllers\Controller;
use App\Models\Invoice;

class ShowInvoiceController extends Controller
{
  public function __invoke(Invoice $invoice)
  {
    return $invoice->load('payments');
  }
}
