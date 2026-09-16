<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->string('cover_path')->nullable()->after('seo_description');
            $table->json('about_title')->nullable()->after('cover_path');
            $table->json('journey_title')->nullable()->after('about_title');
            $table->json('journey_steps')->nullable()->after('journey_title');
            $table->json('trust_items')->nullable()->after('journey_steps');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn([
                'cover_path',
                'about_title',
                'journey_title',
                'journey_steps',
                'trust_items',
            ]);
        });
    }
};
