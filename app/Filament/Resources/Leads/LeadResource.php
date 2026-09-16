<?php

namespace App\Filament\Resources\Leads;

use App\Filament\Resources\Leads\Pages\ManageLeads;
use App\Models\Lead;
use BackedEnum;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use UnitEnum;

class LeadResource extends Resource
{
    protected static ?string $model = Lead::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedInbox;

    protected static string|UnitEnum|null $navigationGroup = 'Заявки';

    protected static ?int $navigationSort = 1;

    protected static ?string $navigationLabel = 'Ліди';

    protected static ?string $modelLabel = 'лід';

    protected static ?string $pluralModelLabel = 'Ліди';

    public static function canCreate(): bool
    {
        return false;
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('type')->disabled(),
                TextInput::make('name')->disabled(),
                TextInput::make('phone')->disabled(),
                TextInput::make('email')->disabled(),
                TextInput::make('preferred_date')->disabled(),
                TextInput::make('preferred_time')->disabled(),
                TextInput::make('messenger')->disabled(),
                Textarea::make('comment')->disabled()->rows(4),
                TextInput::make('page_url')->disabled(),
                TextInput::make('locale')->disabled(),
                Select::make('status')
                    ->options([
                        Lead::STATUS_NEW => 'Нова',
                        Lead::STATUS_IN_PROGRESS => 'В роботі',
                        Lead::STATUS_DONE => 'Завершена',
                        Lead::STATUS_SPAM => 'Спам',
                    ])
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('created_at')->dateTime()->sortable(),
                TextColumn::make('type')->badge(),
                TextColumn::make('name')->searchable(),
                TextColumn::make('phone')->searchable(),
                TextColumn::make('status')->badge(),
                TextColumn::make('service.name')->label('Послуга')->toggleable(),
                TextColumn::make('doctor.name')->label('Лікар')->toggleable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('type')->options([
                    Lead::TYPE_CONSULTATION => 'consultation',
                    Lead::TYPE_BOOKING => 'booking',
                    Lead::TYPE_FEEDBACK => 'feedback',
                ]),
                SelectFilter::make('status')->options([
                    Lead::STATUS_NEW => 'new',
                    Lead::STATUS_IN_PROGRESS => 'in_progress',
                    Lead::STATUS_DONE => 'done',
                    Lead::STATUS_SPAM => 'spam',
                ]),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageLeads::route('/'),
        ];
    }
}
