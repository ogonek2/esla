<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\FaqItem */
class FaqItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category_slug' => $this->category_slug,
            'question' => $this->question,
            'answer' => $this->answer,
            'sort' => $this->sort,
        ];
    }
}
