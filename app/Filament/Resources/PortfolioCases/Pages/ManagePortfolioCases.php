<?php

namespace App\Filament\Resources\PortfolioCases\Pages;

use App\Filament\Resources\PortfolioCases\PortfolioCaseResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManagePortfolioCases extends ManageRecords
{
    protected static string $resource = PortfolioCaseResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
