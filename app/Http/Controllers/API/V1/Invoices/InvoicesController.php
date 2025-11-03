<?php

namespace App\Http\Controllers\API\V1\Invoices;

use App\Http\Controllers\Controller;
use App\Models\Invoice;

class InvoicesController extends Controller
{
  public function __invoke()
  {
    return Invoice::withSum(['payments' => fn($q) => $q->whereNull('deleted_at')], 'amount')
      ->latest()
      ->paginate();
  }
}

