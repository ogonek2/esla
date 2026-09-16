<?php

namespace App\Filament\Resources\Services\RelationManagers;

use App\Support\TranslatableTabs;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class FaqItemsRelationManager extends RelationManager
{
    protected static string $relationship = 'faqItems';

    protected static ?string $title = 'FAQ послуги';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('sort')->numeric()->default(0)->label('Порядок'),
                Toggle::make('is_active')->default(true)->label('Активне'),
                TranslatableTabs::make([
                    'question' => ['label' => 'Питання', 'required' => true],
                    'answer' => ['label' => 'Відповідь', 'type' => 'textarea', 'rows' => 5, 'required' => true],
                ]),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('sort')->sortable()->label('#'),
                TextColumn::make('question')->limit(70)->searchable()->label('Питання'),
                IconColumn::make('is_active')->boolean()->label('Активне'),
            ])
            ->defaultSort('sort')
            ->headerActions([
                CreateAction::make()
                    ->mutateFormDataUsing(function (array $data): array {
                        $data['category_slug'] = $this->getOwnerRecord()->slug;

                        return $data;
                    }),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
