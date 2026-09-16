<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\ClinicSetting */
class ClinicSettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $locale = app()->getLocale();

        return [
            'phones' => array_values($this->phones ?? []),
            'messengers' => $this->messengers ?? [],
            'address' => data_get($this->address, $locale)
                ?? data_get($this->address, 'uk')
                ?? (is_string($this->address) ? $this->address : null),
            'schedule' => data_get($this->schedule, $locale)
                ?? data_get($this->schedule, 'uk')
                ?? (is_string($this->schedule) ? $this->schedule : null),
            'map' => [
                'embed_url' => $this->map_embed_url,
                'lat' => $this->map_lat,
                'lng' => $this->map_lng,
            ],
            'social' => $this->social ?? [],
            'email' => $this->email,
            'analytics' => [
                'ga4_id' => $this->ga4_id,
                'gtm_id' => $this->gtm_id,
                'meta_pixel_id' => $this->meta_pixel_id,
                'tiktok_pixel_id' => $this->tiktok_pixel_id,
            ],
            'locale' => $locale,
        ];
    }
}
