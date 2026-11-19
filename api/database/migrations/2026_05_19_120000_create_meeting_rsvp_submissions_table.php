<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meeting_rsvp_submissions', function (Blueprint $table) {
            $table->id();
            $table->string('meeting_value', 80);
            $table->string('meeting_title', 160);
            $table->json('responses');
            $table->timestamps();

            $table->index('meeting_value');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meeting_rsvp_submissions');
    }
};
