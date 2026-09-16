<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Review */
class ReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'author_name' => $this->author_name,
            'text' => $this->text,
            'source' => $this->source,
            'rating' => $this->rating,
            'photo_url' => $this->photoUrl(),
            'sort' => $this->sort,
        ];
    }
}
