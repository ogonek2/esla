<?php

namespace App\Filament\Pages;

use App\Models\ClinicSetting;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\EmbeddedSchema;
use Filament\Schemas\Components\Form;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use UnitEnum;

/**
 * @property-read Schema $form
 */
class ManageClinicSettings extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCog6Tooth;

    protected static string|UnitEnum|null $navigationGroup = 'Налаштування';

    protected static ?string $navigationLabel = 'Клініка';

    protected static ?string $title = 'Налаштування клініки';

    protected static ?int $navigationSort = 1;

    /**
     * @var array<string, mixed>|null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $settings = ClinicSetting::current();

        $this->form->fill($settings->attributesToArray());
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Контакти')->schema([
                    TextInput::make('email')->email(),
                    KeyValue::make('phones')
                        ->label('Телефони')
                        ->keyLabel('Мітка')
                        ->valueLabel('Номер')
                        ->reorderable(),
                    KeyValue::make('messengers')
                        ->label('Месенджери')
                        ->keyLabel('Канал')
                        ->valueLabel('Посилання / номер'),
                    KeyValue::make('social')
                        ->label('Соцмережі')
                        ->keyLabel('Мережа')
                        ->valueLabel('URL'),
                ]),
                Section::make('Адреса та графік')->schema([
                    KeyValue::make('address')
                        ->label('Адреса (uk/en/ru)')
                        ->keyLabel('locale')
                        ->valueLabel('Адреса'),
                    KeyValue::make('schedule')
                        ->label('Графік (uk/en/ru)')
                        ->keyLabel('locale')
                        ->valueLabel('Графік'),
                    TextInput::make('map_embed_url')->label('Google Maps embed URL')->columnSpanFull(),
                    TextInput::make('map_lat')->label('Lat'),
                    TextInput::make('map_lng')->label('Lng'),
                ])->columns(2),
                Section::make('Аналітика')->schema([
                    TextInput::make('ga4_id')->label('GA4'),
                    TextInput::make('gtm_id')->label('GTM'),
                    TextInput::make('meta_pixel_id')->label('Meta Pixel'),
                    TextInput::make('tiktok_pixel_id')->label('TikTok Pixel'),
                ])->columns(2),
            ])
            ->statePath('data');
    }

    public function content(Schema $schema): Schema
    {
        return $schema
            ->components([
                Form::make([
                    EmbeddedSchema::make('form'),
                ])
                    ->id('form')
                    ->livewireSubmitHandler('save')
                    ->footer([
                        Actions::make([
                            Action::make('save')
                                ->label('Зберегти')
                                ->submit('save'),
                        ]),
                    ]),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();

        $settings = ClinicSetting::current();
        $settings->fill($data);
        $settings->save();

        Notification::make()
            ->title('Збережено')
            ->success()
            ->send();
    }
}
