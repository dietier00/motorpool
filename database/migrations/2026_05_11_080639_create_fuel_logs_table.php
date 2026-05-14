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
        Schema::create('fuel_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
            $table->foreignId('driver_id')->nullable()->constrained()->nullOnDelete();
            $table->date('date');
            $table->decimal('odometer_reading', 10, 2);
            $table->decimal('liters', 8, 2);
            $table->decimal('price_per_liter', 8, 2);
            $table->decimal('total_cost', 10, 2)->storedAs('liters * price_per_liter');
            $table->enum('fuel_type', ['diesel', 'gasoline', 'premium'])->default('diesel');
            $table->string('station')->nullable();
            $table->decimal('km_driven', 10, 2)->nullable();  
            $table->decimal('efficiency', 8, 2)->nullable();  
            $table->decimal('cost_per_km', 8, 2)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fuel_logs');
    }
};
