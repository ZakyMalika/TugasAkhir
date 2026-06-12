<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCarRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Assuming admin middleware already checks authorization
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'category' => 'required|string',
            'price_per_day' => 'required|numeric|min:10000000|max:99000000',
            'image_url' => 'required|url',
            'description' => 'nullable|string',
            'horsepower' => 'nullable|integer|min:0',
            'top_speed' => 'nullable|integer|min:0',
            'transmission' => 'required|in:Automatic,Manual',
            'status' => 'required|in:pending,on_rent,completed,canceled,available,rented,maintenance'
        ];
    }
}
