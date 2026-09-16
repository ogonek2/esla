<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\PortfolioCase */
class PortfolioCaseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'description' => $this->description,
            'before_url' => $this->beforeUrl(),
            'after_url' => $this->afterUrl(),
            'sort' => $this->sort,
            'service' => ServiceResource::make($this->whenLoaded('service')),
            'doctor' => DoctorResource::make($this->whenLoaded('doctor')),
        ];
    }
}
