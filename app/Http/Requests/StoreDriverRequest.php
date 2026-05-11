<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDriverRequest extends FormRequest
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
            'license_number' => 'required|string|unique:drivers,license_number|max:50',
            'cp_number' => 'required|string|unique:drivers,cp_number|max:20',
            'status' => 'required|in:available,on_trip,off_duty,inactive',
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
