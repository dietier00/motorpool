<?php

namespace Database\Factories;

use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

class VehicleFactory extends Factory
{
    protected $model = Vehicle::class;

    public function definition(): array
    {
        $makes = ['Toyota', 'Mitsubishi', 'Isuzu', 'Ford', 'Nissan', 'Honda'];
        $models = ['Hilux', 'L300', 'N-Series', 'Ranger', 'Navara', 'CR-V'];
        $statuses = ['available', 'active', 'maintenance', 'deployed'];

        return [
            'name' => $this->faker->randomElement($makes),
            'model' => $this->faker->randomElement($models),
            'plate_num' => strtoupper($this->faker->bothify('???-####')),
            'status' => $this->faker->randomElement($statuses),
            'recent_mileage' => $this->faker->numberBetween(1000, 50000),
        ];
    }
}