<?php

namespace App\Filament\Resources\Services\Pages;

use App\Filament\Resources\Services\ServiceResource;
use App\Models\FaqItem;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditService extends EditRecord
{
    protected static string $resource = ServiceResource::class;

    protected ?string $previousSlug = null;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    protected function beforeSave(): void
    {
        $this->previousSlug = $this->getRecord()->getOriginal('slug');
    }

    protected function afterSave(): void
    {
        $record = $this->getRecord();

        if ($this->previousSlug && $this->previousSlug !== $record->slug) {
            FaqItem::query()
                ->where('category_slug', $this->previousSlug)
                ->update(['category_slug' => $record->slug]);
        }
    }
}
