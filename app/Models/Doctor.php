<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;
use Spatie\Translatable\HasTranslations;

class Doctor extends Model
{
    use HasTranslations;

    protected $fillable = [
        'slug',
        'name',
        'position',
        'bio',
        'experience_years',
        'photo_path',
        'sort',
        'is_active',
        'seo_title',
        'seo_description',
    ];

    public array $translatable = [
        'name',
        'position',
        'bio',
        'seo_title',
        'seo_description',
    ];

    protected function casts(): array
    {
        return [
            'experience_years' => 'integer',
            'is_active' => 'boolean',
            'sort' => 'integer',
        ];
    }

    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class)->orderBy('sort');
    }

    public function portfolioCases(): HasMany
    {
        return $this->hasMany(PortfolioCase::class)->orderBy('sort');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function photoUrl(): ?string
    {
        return $this->photo_path ? Storage::disk('public')->url($this->photo_path) : null;
    }
}
