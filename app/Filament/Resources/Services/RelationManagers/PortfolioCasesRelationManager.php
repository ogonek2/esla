<?php

namespace App\Filament\Resources\Services\RelationManagers;

use App\Models\Doctor;
use App\Support\TranslatableTabs;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PortfolioCasesRelationManager extends RelationManager
{
    protected static string $relationship = 'portfolioCases';

    protected static ?string $title = 'Кейси портфоліо';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('slug')->required()->maxLength(120)->unique(ignoreRecord: true),
                Select::make('doctor_id')
                    ->label('Лікар')
                    ->options(fn () => Doctor::query()->orderBy('sort')->get()->mapWithKeys(
                        fn (Doctor $d) => [$d->id => $d->getTranslation('name', 'uk')]
                    ))
                    ->searchable()
                    ->nullable(),
                TextInput::make('sort')->numeric()->default(0)->label('Порядок'),
                Toggle::make('is_active')->default(true)->label('Активний'),
                FileUpload::make('before_path')
                    ->label('Фото «до»')
                    ->image()
                    ->directory('portfolio')
                    ->disk('public'),
                FileUpload::make('after_path')
                    ->label('Фото «після»')
                    ->image()
                    ->directory('portfolio')
                    ->disk('public'),
                TranslatableTabs::make([
                    'title' => ['label' => 'Заголовок', 'required' => true],
                    'description' => ['label' => 'Опис', 'type' => 'textarea'],
                ]),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('sort')->sortable()->label('#'),
                ImageColumn::make('after_path')->disk('public')->label('Після'),
                TextColumn::make('title')->limit(40)->searchable(),
                TextColumn::make('slug')->toggleable(isToggledHiddenByDefault: true),
                IconColumn::make('is_active')->boolean(),
            ])
            ->defaultSort('sort')
            ->headerActions([
                CreateAction::make(),
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
