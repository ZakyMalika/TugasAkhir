<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCarRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'price_per_day' => ['required', 'numeric', 'min:10000000', 'max:99000000'],
            'horsepower' => ['required', 'integer', 'min:0'],
            'top_speed' => ['required', 'integer', 'min:0'],
            'status' => ['required', 'in:Pending,On-Going,Completed,Cancelled'],
            'image_url' => ['nullable', 'url'],
        ];
    }
}
