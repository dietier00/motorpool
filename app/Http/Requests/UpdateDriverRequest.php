<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDriverRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:100',
            'license_number' => 'required|string|max:50|unique:drivers,license_number,' . $this->driver->id,
            'cp_number' => 'required|string|max:20|unique:drivers,cp_number,' . $this->driver->id,
            'status' => 'required|in:available,on_trip,off_duty,inactive',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Driver name is required.',
            'license_number.unique' => 'This license number is already registered.',
            'cp_number.unique' => 'This phone number is already registered.',
            'status.required' => 'Please select a valid status.',
        ];
    }
}
