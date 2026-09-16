<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;
use Spatie\Translatable\HasTranslations;

class PortfolioCase extends Model
{
    use HasTranslations;

    protected $fillable = [
        'slug',
        'title',
        'description',
        'service_id',
        'doctor_id',
        'before_path',
        'after_path',
        'sort',
        'is_active',
    ];

    public array $translatable = [
        'title',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort' => 'integer',
        ];
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function beforeUrl(): ?string
    {
        return $this->mediaUrl($this->before_path);
    }

    public function afterUrl(): ?string
    {
        return $this->mediaUrl($this->after_path);
    }

    protected function mediaUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        return Storage::disk('public')->url($path);
    }
}
