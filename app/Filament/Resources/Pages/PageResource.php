<?php

namespace App\Filament\Resources\Pages;

use App\Filament\Resources\Pages\Pages\ManagePages;
use App\Models\Page;
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

class PageResource extends Resource
{
    protected static ?string $model = Page::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDocumentText;

    protected static string|UnitEnum|null $navigationGroup = 'Контент';

    protected static ?int $navigationSort = 8;

    protected static ?string $navigationLabel = 'Сторінки';

    protected static ?string $modelLabel = 'сторінку';

    protected static ?string $pluralModelLabel = 'Сторінки';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('slug')->required()->unique(ignoreRecord: true)->maxLength(120),
                Toggle::make('is_published')->default(true),
                TranslatableTabs::make([
                    'title' => ['label' => 'Заголовок', 'required' => true],
                    'body' => ['label' => 'Контент', 'type' => 'textarea', 'rows' => 12],
                    'seo_title' => ['label' => 'SEO title'],
                    'seo_description' => ['label' => 'SEO description', 'type' => 'textarea'],
                ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('slug')->searchable(),
                TextColumn::make('title')->searchable(),
                IconColumn::make('is_published')->boolean(),
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

    public static function getPages(): array
    {
        return [
            'index' => ManagePages::route('/'),
        ];
    }
}
