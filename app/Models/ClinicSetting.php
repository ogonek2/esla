<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClinicSetting extends Model
{
    protected $fillable = [
        'phones',
        'messengers',
        'address',
        'schedule',
        'map_embed_url',
        'map_lat',
        'map_lng',
        'social',
        'ga4_id',
        'gtm_id',
        'meta_pixel_id',
        'tiktok_pixel_id',
        'email',
    ];

    protected function casts(): array
    {
        return [
            'phones' => 'array',
            'messengers' => 'array',
            'address' => 'array',
            'schedule' => 'array',
            'social' => 'array',
        ];
    }

    public static function current(): self
    {
        return static::query()->firstOrCreate([]);
    }
}
