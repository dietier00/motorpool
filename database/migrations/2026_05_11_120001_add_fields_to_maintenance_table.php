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
        Schema::table('maintenance', function (Blueprint $table) {
            $table->unsignedBigInteger('vehicle_id')->nullable();
            $table->string('service_type')->nullable();
            $table->date('service_date')->nullable();
            $table->string('status')->default('scheduled');
            $table->string('mechanic')->nullable();
            $table->decimal('cost', 10, 2)->default(0);
            $table->date('next_due_date')->nullable();

            $table->foreign('vehicle_id')->references('id')->on('vehicles')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('maintenance', function (Blueprint $table) {
            $table->dropForeign(['vehicle_id']);
            $table->dropColumn([
                'vehicle_id',
                'service_type',
                'service_date',
                'status',
                'mechanic',
                'cost',
                'next_due_date',
            ]);
        });
    }
};
