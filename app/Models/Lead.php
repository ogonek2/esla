<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lead extends Model
{
    public const TYPE_CONSULTATION = 'consultation';

    public const TYPE_BOOKING = 'booking';

    public const TYPE_FEEDBACK = 'feedback';

    public const STATUS_NEW = 'new';

    public const STATUS_IN_PROGRESS = 'in_progress';

    public const STATUS_DONE = 'done';

    public const STATUS_SPAM = 'spam';

    protected $fillable = [
        'type',
        'name',
        'phone',
        'email',
        'service_id',
        'doctor_id',
        'preferred_date',
        'preferred_time',
        'messenger',
        'comment',
        'consent',
        'page_url',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
        'locale',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'consent' => 'boolean',
            'preferred_date' => 'date',
        ];
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class);
    }
}
