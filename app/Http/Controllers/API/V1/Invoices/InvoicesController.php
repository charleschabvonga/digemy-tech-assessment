<?php

namespace App\Http\Controllers\API\V1\Invoices;

use App\Domain\Invoices\Contracts\InvoiceServiceInterface;
use App\Http\Controllers\Controller;
use App\Http\Resources\InvoiceResource;
use Illuminate\Http\Request;

class InvoicesController extends Controller
{
  public function __construct(
    private readonly InvoiceServiceInterface $invoiceService
  ) {}

  public function __invoke(Request $request)
  {
    $perPage = $request->input('per_page', 5);
    $perPage = max(5, min(50, (int) $perPage));
    
    $invoices = $this->invoiceService->listInvoices($perPage);
    
    return InvoiceResource::collection($invoices);
  }
}

