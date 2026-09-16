<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;
use Spatie\Translatable\HasTranslations;

class Service extends Model
{
    use HasTranslations;

    protected $fillable = [
        'service_category_id',
        'slug',
        'name',
        'short_description',
        'description',
        'indications',
        'contraindications',
        'price_from',
        'price_label',
        'is_featured',
        'sort',
        'is_active',
        'seo_title',
        'seo_description',
        'cover_path',
        'about_title',
        'journey_title',
        'journey_steps',
        'trust_items',
    ];

    public array $translatable = [
        'name',
        'short_description',
        'description',
        'indications',
        'contraindications',
        'price_label',
        'seo_title',
        'seo_description',
        'about_title',
        'journey_title',
    ];

    protected function casts(): array
    {
        return [
            'price_from' => 'integer',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'sort' => 'integer',
            'journey_steps' => 'array',
            'trust_items' => 'array',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class, 'service_category_id');
    }

    public function doctors(): BelongsToMany
    {
        return $this->belongsToMany(Doctor::class)->orderBy('sort');
    }

    public function portfolioCases(): HasMany
    {
        return $this->hasMany(PortfolioCase::class)->orderBy('sort');
    }

    /** FAQ bound to this service slug via category_slug. */
    public function faqItems(): HasMany
    {
        return $this->hasMany(FaqItem::class, 'category_slug', 'slug')->orderBy('sort');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function coverUrl(): ?string
    {
        if (! $this->cover_path) {
            return null;
        }

        if (str_starts_with($this->cover_path, 'http://') || str_starts_with($this->cover_path, 'https://')) {
            return $this->cover_path;
        }

        return Storage::disk('public')->url($this->cover_path);
    }

    /**
     * Localized journey steps for API/front.
     *
     * @return list<array{title: string|null, text: string|null}>
     */
    public function localizedJourneySteps(?string $locale = null): array
    {
        $locale = $locale ?: app()->getLocale();
        $fallback = config('app.fallback_locale', 'uk');
        $steps = $this->journey_steps ?? [];

        return collect($steps)
            ->map(function (array $step) use ($locale, $fallback) {
                return [
                    'title' => $this->pickLocale($step['title'] ?? null, $locale, $fallback),
                    'text' => $this->pickLocale($step['text'] ?? null, $locale, $fallback),
                ];
            })
            ->filter(fn (array $step) => filled($step['title']) || filled($step['text']))
            ->values()
            ->all();
    }

    /**
     * Localized trust strip items.
     *
     * @return list<array{label: string|null, text: string|null}>
     */
    public function localizedTrustItems(?string $locale = null): array
    {
        $locale = $locale ?: app()->getLocale();
        $fallback = config('app.fallback_locale', 'uk');
        $items = $this->trust_items ?? [];

        return collect($items)
            ->map(function (array $item) use ($locale, $fallback) {
                return [
                    'label' => $this->pickLocale($item['label'] ?? null, $locale, $fallback),
                    'text' => $this->pickLocale($item['text'] ?? null, $locale, $fallback),
                ];
            })
            ->filter(fn (array $item) => filled($item['label']) || filled($item['text']))
            ->values()
            ->all();
    }

    protected function pickLocale(mixed $value, string $locale, string $fallback): ?string
    {
        if (! is_array($value)) {
            return filled($value) ? (string) $value : null;
        }

        $picked = $value[$locale] ?? $value[$fallback] ?? reset($value) ?: null;

        return filled($picked) ? (string) $picked : null;
    }
}
