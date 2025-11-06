<?php
declare(strict_types=1);

namespace App\Http\Requests\Invoice;

use App\DTO\Invoices\InvoiceData;
use Illuminate\Foundation\Http\FormRequest;

class StoreInvoiceRequest extends FormRequest
{
  public function rules(): array
  {
    return [
      'title' => ['required','string','max:255'],
      'description' => ['nullable','string'],
      'total_amount' => ['required','numeric','min:0.01'],
    ];
  }

  public function toDTO(): InvoiceData
  {
    $validated = $this->validated();

    return new InvoiceData(
      title: $validated['title'],
      description: $validated['description'] ?? null,
      totalAmount: (string) $validated['total_amount'],
    );
  }
}