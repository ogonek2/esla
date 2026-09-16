<?php

namespace App\Filament\Resources\Reviews;

use App\Filament\Resources\Reviews\Pages\ManageReviews;
use App\Models\Review;
use App\Support\TranslatableTabs;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

class ReviewResource extends Resource
{
    protected static ?string $model = Review::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedChatBubbleLeftRight;

    protected static string|UnitEnum|null $navigationGroup = 'Контент';

    protected static ?int $navigationSort = 5;

    protected static ?string $navigationLabel = 'Відгуки';

    protected static ?string $modelLabel = 'відгук';

    protected static ?string $pluralModelLabel = 'Відгуки';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('author_name')->required()->maxLength(120),
                TextInput::make('source')->maxLength(120),
                TextInput::make('rating')->numeric()->minValue(1)->maxValue(5),
                TextInput::make('sort')->numeric()->default(0),
                Toggle::make('is_published')->label('Опубліковано'),
                FileUpload::make('photo_path')->image()->directory('reviews')->disk('public'),
                TranslatableTabs::make([
                    'text' => ['label' => 'Текст', 'type' => 'textarea', 'rows' => 5, 'required' => true],
                ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('sort')->sortable(),
                TextColumn::make('author_name')->searchable(),
                TextColumn::make('source'),
                TextColumn::make('rating'),
                IconColumn::make('is_published')->boolean(),
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
            'index' => ManageReviews::route('/'),
        ];
    }
}
