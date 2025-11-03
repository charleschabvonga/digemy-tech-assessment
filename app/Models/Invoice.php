<?php

declare(strict_types=1);

namespace App\Models;

use App\States\Invoice\InvoiceState;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\ModelStates\HasStates;
use ReflectionClass;

class Invoice extends Model
{
    use HasFactory, HasStates;

    protected $fillable = ['title', 'description', 'total_amount', 'state'];

    protected $casts = [
        'state' => InvoiceState::class,
        'total_amount' => 'decimal:2',
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

    public function getStateMetaAttribute(): array
    {
        /** @var InvoiceState $s */
        $s = $this->state;
        $className = get_class($s);
        $reflection = new ReflectionClass($className);
        try {
            $nameProperty = $reflection->getProperty('name');
            $name = $nameProperty->isStatic() ? $nameProperty->getValue() : class_basename($s);
        } catch (\ReflectionException $e) {
            $name = class_basename($s);
        }

        return [
            'name' => $name,
            'description' => $s->description(),
            'display' => $s->displayAmount(),
            'intent' => $s->intent()->value,
        ];
    }
}
