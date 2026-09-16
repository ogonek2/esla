<?php

namespace App\Filament\Resources\PortfolioCases;

use App\Filament\Resources\PortfolioCases\Pages\ManagePortfolioCases;
use App\Models\Doctor;
use App\Models\PortfolioCase;
use App\Models\Service;
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

class PortfolioCaseResource extends Resource
{
    protected static ?string $model = PortfolioCase::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedPhoto;

    protected static string|UnitEnum|null $navigationGroup = 'Контент';

    protected static ?int $navigationSort = 4;

    protected static ?string $navigationLabel = 'Портфоліо';

    protected static ?string $modelLabel = 'кейс';

    protected static ?string $pluralModelLabel = 'Портфоліо';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('slug')->required()->unique(ignoreRecord: true)->maxLength(120),
                Select::make('service_id')
                    ->label('Послуга')
                    ->options(fn () => Service::query()->orderBy('sort')->get()->mapWithKeys(
                        fn (Service $s) => [$s->id => $s->getTranslation('name', 'uk')]
                    ))
                    ->searchable(),
                Select::make('doctor_id')
                    ->label('Лікар')
                    ->options(fn () => Doctor::query()->orderBy('sort')->get()->mapWithKeys(
                        fn (Doctor $d) => [$d->id => $d->getTranslation('name', 'uk')]
                    ))
                    ->searchable(),
                TextInput::make('sort')->numeric()->default(0),
                Toggle::make('is_active')->default(true),
                FileUpload::make('before_path')->label('До')->image()->directory('portfolio')->disk('public'),
                FileUpload::make('after_path')->label('Після')->image()->directory('portfolio')->disk('public'),
                TranslatableTabs::make([
                    'title' => ['label' => 'Заголовок', 'required' => true],
                    'description' => ['label' => 'Опис', 'type' => 'textarea'],
                ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('sort')->sortable(),
                ImageColumn::make('before_path')->disk('public')->label('До'),
                ImageColumn::make('after_path')->disk('public')->label('Після'),
                TextColumn::make('slug')->searchable(),
                TextColumn::make('title')->searchable(),
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
            'index' => ManagePortfolioCases::route('/'),
        ];
    }
}
