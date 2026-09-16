<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Post */
class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $detailed = filled($request->route('slug')) || $request->boolean('detailed');

        $payload = [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'cover_url' => $this->coverUrl(),
            'published_at' => $this->published_at?->toIso8601String(),
            'seo' => [
                'title' => $this->seo_title,
                'description' => $this->seo_description,
            ],
        ];

        if ($detailed) {
            $payload['body'] = $this->body;
            $payload['blocks'] = $this->contentBlocks();
        }

        return $payload;
    }
}
