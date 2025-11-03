<?php

namespace App\Http\Controllers\API\V1\Invoices;

use App\Http\Controllers\Controller;
use App\Http\Requests\Invoice\StoreInvoiceRequest;
use App\Models\Invoice;
use App\States\Invoice\Created;

class CreateInvoiceController extends Controller
{
  public function __invoke(StoreInvoiceRequest $request)
  {
    $dto = $request->toDTO();

    $invoice = Invoice::create([
      'title' => $dto->title,
      'description' => $dto->description,
      'total_amount' => $dto->totalAmount,
      'state' => Created::class,
    ]);

    return response()->json($invoice, 201);
  }
}
