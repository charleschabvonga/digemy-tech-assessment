<?php

declare(strict_types=1);

namespace App\Models;

use App\States\Invoice\AwaitingPayment;
use App\States\Invoice\InvoiceState;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\ModelStates\HasStates;
use ReflectionClass;

class Invoice extends Model
{
    use HasFactory, HasStates, SoftDeletes;

    protected $fillable = ['title', 'description', 'total_amount', 'state', 'refunded_at'];

    protected $casts = [
        'state' => InvoiceState::class,
        'total_amount' => 'decimal:2',
        'refunded_at' => 'datetime',
    ];

    protected $appends = ['state_meta'];

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function totalPaid(): string
    {
        return (string) $this->payments()->sum('amount');
    }

    public function outstanding(): string
    {
        return (string) (bcsub($this->total_amount, $this->totalPaid()));
    }

    public function sendToCustomer(): Invoice
    {
        if (! ($this->state instanceof AwaitingPayment)) {
            $this->state->transitionTo(AwaitingPayment::class);
            $this->save();
        }

        return $this->refresh();
    }

    public function getStateMetaAttribute(): array
    {
        /** @var InvoiceState $state */
        $state = $this->state;
        $className = get_class($state);
        $reflection = new ReflectionClass($className);
        
        // Try to get the static $name property, fallback to class basename
        $name = class_basename($state);
        try {
            $nameProperty = $reflection->getProperty('name');
            if ($nameProperty->isStatic()) {
                $nameProperty->setAccessible(true);
                $name = $nameProperty->getValue();
            }
        } catch (\ReflectionException $e) {
            // Fallback to class basename
        }

        return [
            'name' => $name,
            'description' => $state->description(),
            'display' => $state->displayLabel(),
            'intent' => $state->intent()->value,
        ];
    }
}
