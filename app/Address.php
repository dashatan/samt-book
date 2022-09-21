<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $fillable = [
        'title', 'address', 'postal_code', 'location', 'addressable_id', 'addressable_type'
    ];

    protected $appends = ['info', 'label', 'caption', 'icon'];

    public function addressable()
    {
        return $this->morphTo();
    }

    public function parent()
    {
        return $this->addressable();
    }

    public function getInfoAttribute()
    {
        return [
            'route' => 'address',
            'active-li' => 'addressesm ',
            'open-li' => 'addresses',
            'name' => 'address',
            'model' => 'App\Address',
            'plural' => 'آدرس ها',
            'singular' => 'آدرس',
            'parentable' => 'addressable',
            'type' => 'form',
            'icon' => asset('icons/Info.png'),
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
            'address' => [
                'type' => 'textarea',
                'name' => 'address',
                'label' => 'آدرس',
                'cols' => '1',
                'rows' => '3',
            ],
            'postal_code' => [
                'type' => 'number',
                'name' => 'postal_code',
                'label' => 'کد پستی',
            ],
            'location' => [
                'type' => 'map',
                'name' => 'location',
                'label' => 'مختصات جغرافیایی',
            ],
        ];
    }

    public function getRulesAttribute()
    {
        return [
            'title' => 'required',
            'address' => 'required',
        ];
    }

    public function getMessagesAttribute()
    {
        return [
            'title.required' => __('لطفا عنوان را وارد کنید'),
            'address.required' => __('لطفا آدرس را وارد کنید'),
        ];
    }

    public function getIconAttribute()
    {
        return 'icons/special-flat/map.svg';
    }

    public function getLabelAttribute()
    {
        return $this->title;
    }

    public function getCaptionAttribute()
    {
        return $this->address;
    }
}
