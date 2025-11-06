<?php

namespace App\Http\Controllers\API\V1\Invoices;

use App\Domain\Invoices\Contracts\InvoiceServiceInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Invoice\StoreInvoiceRequest;

class CreateInvoiceController extends Controller
{
  public function __construct(
    private readonly InvoiceServiceInterface $invoiceService
  ) {}

  public function __invoke(StoreInvoiceRequest $request)
  {
    $dto = $request->toDTO();

    $invoice = $this->invoiceService->createInvoice($dto);

    return response()->json($invoice, 201);
  }
}
