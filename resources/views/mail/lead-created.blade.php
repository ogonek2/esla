Нова заявка Esla

Тип: {{ $lead->type }}
Ім'я: {{ $lead->name }}
Телефон: {{ $lead->phone }}
@if($lead->email)
Email: {{ $lead->email }}
@endif
@if($lead->service)
Послуга: {{ $lead->service->getTranslation('name', 'uk') }}
@endif
@if($lead->doctor)
Лікар: {{ $lead->doctor->getTranslation('name', 'uk') }}
@endif
@if($lead->preferred_date)
Дата: {{ $lead->preferred_date->format('Y-m-d') }}
@endif
@if($lead->preferred_time)
Час: {{ $lead->preferred_time }}
@endif
@if($lead->comment)
Коментар: {{ $lead->comment }}
@endif
@if($lead->page_url)
URL: {{ $lead->page_url }}
@endif
Locale: {{ $lead->locale }}
Status: {{ $lead->status }}
