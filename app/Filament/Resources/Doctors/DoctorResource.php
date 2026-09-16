<?php

namespace App\Filament\Resources\Doctors;

use App\Filament\Resources\Doctors\Pages\ManageDoctors;
use App\Models\Doctor;
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

class DoctorResource extends Resource
{
    protected static ?string $model = Doctor::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUserGroup;

    protected static string|UnitEnum|null $navigationGroup = 'Контент';

    protected static ?int $navigationSort = 3;

    protected static ?string $navigationLabel = 'Лікарі';

    protected static ?string $modelLabel = 'лікаря';

    protected static ?string $pluralModelLabel = 'Лікарі';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('slug')->required()->unique(ignoreRecord: true)->maxLength(120),
                TextInput::make('experience_years')->numeric()->label('Досвід (років)'),
                TextInput::make('sort')->numeric()->default(0),
                Toggle::make('is_active')->default(true),
                FileUpload::make('photo_path')
                    ->label('Фото')
                    ->image()
                    ->directory('doctors')
                    ->disk('public'),
                Select::make('services')
                    ->label('Послуги')
                    ->multiple()
                    ->relationship('services', 'slug')
                    ->getOptionLabelFromRecordUsing(fn (Service $record) => $record->getTranslation('name', 'uk'))
                    ->preload()
                    ->searchable(),
                TranslatableTabs::make([
                    'name' => ['label' => 'Імʼя', 'required' => true],
                    'position' => ['label' => 'Посада'],
                    'bio' => ['label' => 'Біо', 'type' => 'textarea', 'rows' => 6],
                    'seo_title' => ['label' => 'SEO title'],
                    'seo_description' => ['label' => 'SEO description', 'type' => 'textarea'],
                ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('sort')->sortable(),
                ImageColumn::make('photo_path')->disk('public')->circular(),
                TextColumn::make('slug')->searchable(),
                TextColumn::make('name')->searchable(),
                TextColumn::make('position'),
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
            'index' => ManageDoctors::route('/'),
        ];
    }
}
