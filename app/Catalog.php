<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Catalog extends Model
{
    protected $fillable = [
        'title',
        'file_url',
        'file_name',
        'catalogable_id',
        'catalogable_type',
    ];

    public function user()
    {
        return $this->catalogable()->user();
    }

    public function catalogable()
    {
        return $this->morphTo();
    }

    public function getInfoAttribute()
    {
        return [
            'plural' => 'کاتالوگ ها',
            'singular' => 'کاتالوگ',
            'route' => 'catalog',
            'model' => 'App\Catalog',
            'parentable' => 'catalogable',
            'type' => 'form',
            'icon' => asset('icons/Catalog.png'),
        ];
    }

    public function getInputsAttribute()
    {
        return [
            'title' => [
                'type' => 'text',
                'name' => 'title',
                'label' => 'عنوان',
            ],
            'file' => [
                'type' => 'file',
                'name' => 'file',
                'label' => 'فایل کاتالوگ به صورت pdf',
            ],
        ];
    }

    public function getRulesAttribute()
    {
        return [
            'title' => 'required',
            'file' => 'required',
        ];
    }

    public function getRulesInEditPageAttribute()
    {
        return [
            'title' => 'required',
            'file' => 'required',
        ];
    }

    public function getMessagesAttribute()
    {
        return [
            'title.required' => __('لطفا عنوان را وارد کنید'),
            'file.required' => __('لطفا فایل کاتالوگ را وارد کنید'),
        ];
    }
}
