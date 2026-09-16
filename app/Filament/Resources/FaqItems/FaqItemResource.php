<?php

namespace App\Filament\Resources\FaqItems;

use App\Filament\Resources\FaqItems\Pages\ManageFaqItems;
use App\Models\FaqItem;
use App\Support\TranslatableTabs;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

class FaqItemResource extends Resource
{
    protected static ?string $model = FaqItem::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedQuestionMarkCircle;

    protected static string|UnitEnum|null $navigationGroup = 'Контент';

    protected static ?int $navigationSort = 6;

    protected static ?string $navigationLabel = 'FAQ';

    protected static ?string $modelLabel = 'питання';

    protected static ?string $pluralModelLabel = 'FAQ';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('category_slug')->label('Категорія (slug)')->maxLength(120),
                TextInput::make('sort')->numeric()->default(0),
                Toggle::make('is_active')->default(true),
                TranslatableTabs::make([
                    'question' => ['label' => 'Питання', 'required' => true],
                    'answer' => ['label' => 'Відповідь', 'type' => 'textarea', 'rows' => 5, 'required' => true],
                ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('sort')->sortable(),
                TextColumn::make('category_slug')->label('Категорія'),
                TextColumn::make('question')->limit(60)->searchable(),
                IconColumn::make('is_active')->boolean(),
            ])
            ->defaultSort('sort')
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

    public static function getPages(): array
    {
        return [
            'index' => ManageFaqItems::route('/'),
        ];
    }
}
