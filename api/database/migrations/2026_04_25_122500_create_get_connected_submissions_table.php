<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('get_connected_submissions', function (Blueprint $table): void {
            $table->id();
            $table->string('full_name');
            $table->string('age', 20);
            $table->date('date_of_birth')->nullable();
            $table->string('location');
            $table->string('phone');
            $table->string('email');
            $table->string('instagram_handle')->nullable();
            $table->string('occupation')->nullable();
            $table->string('is_student', 10)->nullable();
            $table->string('school_name')->nullable();
            $table->string('program')->nullable();
            $table->string('year_of_study')->nullable();
            $table->string('church_status', 40);
            $table->text('talents')->nullable();
            $table->json('interests')->nullable();
            $table->text('extra_notes')->nullable();
            $table->string('accepted_jesus', 10);
            $table->text('prayer_requests')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('get_connected_submissions');
    }
};

