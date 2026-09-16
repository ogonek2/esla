<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Doctor */
class DoctorResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $detailed = $this->resource->relationLoaded('portfolioCases');

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'position' => $this->position,
            'bio' => $this->when($detailed, $this->bio),
            'experience_years' => $this->experience_years,
            'photo_url' => $this->photoUrl(),
            'sort' => $this->sort,
            'seo' => [
                'title' => $this->seo_title,
                'description' => $this->seo_description,
            ],
            'services' => ServiceResource::collection($this->whenLoaded('services')),
            'portfolio' => PortfolioCaseResource::collection($this->whenLoaded('portfolioCases')),
        ];
    }
}
