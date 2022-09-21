<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Board extends Model
{
    protected $fillable = [
        'name',
        'role',
        'image_path',
        'dsc',
        'boardable_id',
        'boardable_type',
    ];

    protected $appends = ['info', 'image', 'label', 'icon', 'caption'];

    public function toSearchableArray()
    {
        return [
            'name' => $this->name,
            'family_name' => $this->family_name,
            'dsc' => $this->dsc,
        ];
    }

    public function user()
    {
        return $this->boardable()->user();
    }

    public function boardable()
    {
        return $this->morphTo();
    }

    public function parent()
    {
        return $this->boardable();
    }

    public function getInfoAttribute()
    {
        return [
            'plural' => 'هیئت مدیره',
            'singular' => 'عضو هیئت مدیره',
            'route' => 'board',
            'model' => 'App\Board',
            'parentable' => 'boardable',
            'type' => 'form',
            'icon' => asset('icons/Boards.png'),
        ];
    }

    public function getInputsAttribute()
    {
        return [
            'image' => [
                'type' => 'file',
                'name' => 'image',
                'label' => 'تصویر',
            ],
            'name' => [
                'type' => 'text',
                'name' => 'name',
                'label' => 'نام و نام خانوادگی',
            ],
            'role' => [
                'type' => 'text',
                'name' => 'role',
                'label' => 'سمت شغلی',
            ],
            'user_id' => [
                'type' => 'number',
                'name' => 'user_id',
                'label' => 'شناسه کاربری صمت بوک',
            ],
            'dsc' => [
                'type' => 'textarea',
                'cols' => '10',
                'rows' => '6',
                'name' => 'dsc',
                'label' => 'توضیحات',
            ],
        ];
    }

    public function getRulesAttribute()
    {
        return [
            'name' => 'required',
            'role' => 'required',
        ];
    }

    public function getRulesInEditPageAttribute()
    {
        return [
            'name' => 'required',
        ];
    }

    public function getMessagesAttribute()
    {
        return [
            'name.required' => __('لطفا نام را وارد کنید'),
            'role.required' => __('لطفا سمت شغلی عضو هیئت مدیره را وارد کنید'),
        ];
    }

    public function getDefaultImageAttribute()
    {
        return asset('icons/user/avatar/man-1.svg');
    }

    public function getImageAttribute()
    {
        if (empty($this->image_path)) {
            return $this->getDefaultImageAttribute();
        }
        return asset('storage/images/' . $this->image_path);
    }

    public function getIconAttribute()
    {
        if (empty($this->image_path)) {
            return 'icons/user/avatar/man-1.svg';
        }
        return 'storage/images/' . $this->image_path;
    }

    public function getLabelAttribute()
    {
        return $this->name;
    }

    public function getCaptionAttribute()
    {
        return $this->role;
    }
}
