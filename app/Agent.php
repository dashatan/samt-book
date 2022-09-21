<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Scout\Searchable;

class Agent extends Model
{

    protected $fillable = [
        'name',
        'address',
        'province_id',
        'phone',
        'location',
        'agentable_id',
        'agentable_type'
    ];

    protected $appends = ['label','icon','caption'];

    public function toSearchableArray()
    {
        return [
            'name' => $this->name,
            'address' => $this->address,
        ];
    }

    public function province()
    {
        return $this->belongsTo('App\Province', 'province_id');
    }

    public function user()
    {
        return $this->agentable()->user();
    }

    public function agentable()
    {
        return $this->morphTo();
    }

    public function getInfoAttribute()
    {
        return [
            'route' => 'agent',
            'model' => 'App\Agent',
            'plural' => 'نمایندگی ها',
            'singular' => 'نمایندگی',
            'parentable' => 'agentable',
            'type' => 'form',
            'icon' => asset('icons/Booth.png'),
        ];
    }

    public function getInputsAttribute()
    {
        return [
            'name' => [
                'type' => 'text',
                'name' => 'name',
                'label' => 'نام',
            ],
            'phone' => [
                'type' => 'number',
                'name' => 'phone',
                'label' => 'شماره تلفن',
            ],
            'province' => [
                'type' => 'select',
                'name' => 'province_id',
                'model' => 'App\Province',
                'options_type' => 'from_model',
                'label' => 'استان',
                'constraints' => [
                    'sortBy' => [
                        'key' => 'orderBy',
                        'val' => ['title']
                    ],
                ],
            ],
            'address' => [
                'type' => 'textarea',
                'cols' => '10',
                'rows' => '3',
                'name' => 'address',
                'label' => 'آدرس',
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
            'name' => 'required',
            'address' => 'required',
        ];
    }

    public function getMessagesAttribute()
    {
        return [
            'name.required' => __('لطفا نام را وارد کنید'),
            'address.required' => __('لطفا آدرس را وارد کنید'),
        ];
    }

    public function getIconAttribute()
    {
        if (!empty($this->image_path)){
            return 'storage/images/'.$this->image_path;
        }
        return 'icons/special-flat/marketing.svg';
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
