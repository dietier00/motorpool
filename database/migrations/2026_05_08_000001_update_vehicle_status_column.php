<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'sqlite') {
            DB::statement('PRAGMA foreign_keys=OFF;');
            DB::statement("UPDATE vehicles SET status = 'available' WHERE status = 'inactive'");
            DB::statement('ALTER TABLE vehicles RENAME TO vehicles_old;');

            Schema::create('vehicles', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('model');
                $table->string('plate_num')->unique();
                $table->year('year');
                $table->enum('status', ['active', 'maintenance', 'available'])->default('active');
                $table->unsignedBigInteger('driver_id')->nullable();
                $table->foreign('driver_id')->references('id')->on('drivers')->onDelete('set null');
                $table->timestamps();
            });

            DB::statement('INSERT INTO vehicles (id, name, model, plate_num, year, status, driver_id, created_at, updated_at) SELECT id, name, model, plate_num, year, status, driver_id, created_at, updated_at FROM vehicles_old;');
            DB::statement('DROP TABLE vehicles_old;');
            DB::statement('PRAGMA foreign_keys=ON;');
            return;
        }

        if (in_array($driver, ['mysql', 'mariadb'], true)) {
            DB::statement("UPDATE vehicles SET status = 'available' WHERE status = 'inactive'");
            DB::statement("ALTER TABLE vehicles MODIFY COLUMN status ENUM('active', 'maintenance', 'available') NOT NULL DEFAULT 'active'");
            return;
        }

        Schema::table('vehicles', function (Blueprint $table) {
            $table->string('status')->default('active')->change();
        });
    }

    public function down(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'sqlite') {
            DB::statement('PRAGMA foreign_keys=OFF;');
            DB::statement("UPDATE vehicles SET status = 'inactive' WHERE status = 'available'");
            DB::statement('ALTER TABLE vehicles RENAME TO vehicles_old;');

            Schema::create('vehicles', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('model');
                $table->string('plate_num')->unique();
                $table->year('year');
                $table->enum('status', ['active', 'inactive', 'maintenance'])->default('active');
                $table->unsignedBigInteger('driver_id')->nullable();
                $table->foreign('driver_id')->references('id')->on('drivers')->onDelete('set null');
                $table->timestamps();
            });

            DB::statement('INSERT INTO vehicles (id, name, model, plate_num, year, status, driver_id, created_at, updated_at) SELECT id, name, model, plate_num, year, status, driver_id, created_at, updated_at FROM vehicles_old;');
            DB::statement('DROP TABLE vehicles_old;');
            DB::statement('PRAGMA foreign_keys=ON;');
            return;
        }

        if (in_array($driver, ['mysql', 'mariadb'], true)) {
            DB::statement("UPDATE vehicles SET status = 'inactive' WHERE status = 'available'");
            DB::statement("ALTER TABLE vehicles MODIFY COLUMN status ENUM('active', 'inactive', 'maintenance') NOT NULL DEFAULT 'active'");
            return;
        }

        Schema::table('vehicles', function (Blueprint $table) {
            $table->string('status')->default('active')->change();
        });
    }
};
