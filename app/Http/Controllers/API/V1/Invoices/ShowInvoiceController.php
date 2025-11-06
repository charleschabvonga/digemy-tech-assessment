<?php

namespace App\Http\Controllers\API\V1\Invoices;

use App\Domain\Invoices\Contracts\PaymentServiceInterface;
use App\Http\Controllers\Controller;
use App\Models\Invoice;

class ShowInvoiceController extends Controller
{
  public function __construct(
    private readonly PaymentServiceInterface $paymentService
  ) {}

  public function __invoke(Invoice $invoice)
  {
    return $this->paymentService->showInvoice($invoice);
  }
}
