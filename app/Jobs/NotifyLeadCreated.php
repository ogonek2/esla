<?php

namespace App\Jobs;

use App\Mail\LeadCreatedMail;
use App\Models\Lead;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class NotifyLeadCreated implements ShouldQueue
{
    use Queueable;

    public function __construct(public Lead $lead) {}

    public function handle(): void
    {
        $this->lead->loadMissing(['service', 'doctor']);

        $to = config('mail.from.address');
        if ($to) {
            Mail::to($to)->send(new LeadCreatedMail($this->lead));
        }

        $token = config('services.telegram.bot_token');
        $chatId = config('services.telegram.chat_id');

        if (! $token || ! $chatId) {
            Log::info('Lead created (Telegram skipped)', ['lead_id' => $this->lead->id]);

            return;
        }

        $text = $this->formatTelegramMessage();

        Http::post("https://api.telegram.org/bot{$token}/sendMessage", [
            'chat_id' => $chatId,
            'text' => $text,
            'parse_mode' => 'HTML',
        ]);
    }

    private function formatTelegramMessage(): string
    {
        $lead = $this->lead;

        return implode("\n", array_filter([
            '<b>Нова заявка Esla</b>',
            'Тип: '.$lead->type,
            'Імʼя: '.$lead->name,
            'Телефон: '.$lead->phone,
            $lead->email ? 'Email: '.$lead->email : null,
            $lead->service ? 'Послуга: '.$lead->service->getTranslation('name', 'uk') : null,
            $lead->doctor ? 'Лікар: '.$lead->doctor->getTranslation('name', 'uk') : null,
            $lead->preferred_date ? 'Дата: '.$lead->preferred_date->format('Y-m-d') : null,
            $lead->preferred_time ? 'Час: '.$lead->preferred_time : null,
            $lead->comment ? 'Коментар: '.$lead->comment : null,
            $lead->page_url ? 'URL: '.$lead->page_url : null,
        ]));
    }
}
