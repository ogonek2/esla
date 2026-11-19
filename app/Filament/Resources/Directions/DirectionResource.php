<?php

namespace App\Filament\Resources\Directions;

use App\Filament\Resources\Directions\Pages\ManageDirections;
use App\Models\Direction;
use App\Models\ServiceCategory;
use App\Support\TranslatableTabs;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

class DirectionResource extends Resource
{
    protected static ?string $model = Direction::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSquares2x2;

    protected static string|UnitEnum|null $navigationGroup = 'Контент';

    protected static ?int $navigationSort = 2;

    protected static ?string $navigationLabel = 'Напрямки';

    protected static ?string $modelLabel = 'напрям';

    protected static ?string $pluralModelLabel = 'Напрямки';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('slug')->required()->unique(ignoreRecord: true)->maxLength(120),
                TextInput::make('sort')->numeric()->default(0)->label('Порядок'),
                Toggle::make('is_active')->label('Показувати на сайті')->default(true),
                Select::make('service_category_id')
                    ->label('Розділ прайсу')
                    ->helperText('Якщо обрати розділ, картка відкриє прайс уже з цим фільтром. Порожнє значення веде на весь прайс.')
                    ->relationship('category', 'slug')
                    ->getOptionLabelFromRecordUsing(fn (ServiceCategory $record) => $record->getTranslation('name', 'uk'))
                    ->searchable()
                    ->preload(),
                FileUpload::make('image_path')
                    ->label('Фото')
                    ->image()
                    ->directory('directions')
                    ->disk('public'),
                TranslatableTabs::make([
                    'name' => ['label' => 'Назва', 'required' => true],
                ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('sort')->label('Порядок')->sortable(),
                ImageColumn::make('image_path')->disk('public')->label('Фото'),
                TextColumn::make('name')->label('Назва')->searchable(),
                TextColumn::make('category.name')->label('Прайс'),
                IconColumn::make('is_active')->label('На сайті')->boolean(),
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
            'index' => ManageDirections::route('/'),
        ];
    }
}
