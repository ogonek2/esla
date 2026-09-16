<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class FaqItem extends Model
{
    use HasTranslations;

    protected $fillable = [
        'category_slug',
        'question',
        'answer',
        'sort',
        'is_active',
    ];

    public array $translatable = [
        'question',
        'answer',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort' => 'integer',
        ];
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
