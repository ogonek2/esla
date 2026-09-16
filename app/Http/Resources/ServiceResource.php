<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Service */
class ServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $detailed = (bool) $this->resource->relationLoaded('doctors')
            || (bool) $this->resource->relationLoaded('portfolioCases');

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'short_description' => $this->short_description,
            'description' => $this->when($detailed, $this->description),
            'indications' => $this->when($detailed, $this->indications),
            'contraindications' => $this->when($detailed, $this->contraindications),
            'price_from' => $this->price_from,
            'price_label' => $this->price_label,
            'is_featured' => $this->is_featured,
            'sort' => $this->sort,
            'cover_url' => $this->when($detailed, $this->coverUrl()),
            'about_title' => $this->when($detailed, $this->about_title),
            'journey_title' => $this->when($detailed, $this->journey_title),
            'journey_steps' => $this->when($detailed, $this->localizedJourneySteps()),
            'trust_items' => $this->when($detailed, $this->localizedTrustItems()),
            'seo' => [
                'title' => $this->seo_title,
                'description' => $this->seo_description,
            ],
            'category' => ServiceCategoryResource::make($this->whenLoaded('category')),
            'doctors' => DoctorResource::collection($this->whenLoaded('doctors')),
            'portfolio' => PortfolioCaseResource::collection($this->whenLoaded('portfolioCases')),
        ];
    }
}
