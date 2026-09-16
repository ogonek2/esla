<?php

namespace App\Models;

use App\Support\ContentBlocks;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Spatie\Translatable\HasTranslations;

class Post extends Model
{
    use HasTranslations;

    protected $fillable = [
        'slug',
        'title',
        'excerpt',
        'body',
        'blocks',
        'cover_path',
        'published_at',
        'is_published',
        'seo_title',
        'seo_description',
    ];

    public array $translatable = [
        'title',
        'excerpt',
        'body',
        'blocks',
        'seo_title',
        'seo_description',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'is_published' => 'boolean',
        ];
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function coverUrl(): ?string
    {
        return $this->cover_path ? Storage::disk('public')->url($this->cover_path) : null;
    }

    /**
     * @return list<array{type: string, data: array<string, mixed>}>
     */
    public function contentBlocks(?string $locale = null): array
    {
        $locale = $locale ?: app()->getLocale();
        $blocks = $this->getTranslation('blocks', $locale, true);

        return ContentBlocks::normalizeForApi(
            $blocks,
            $this->getTranslation('body', $locale, true),
        );
    }
}
