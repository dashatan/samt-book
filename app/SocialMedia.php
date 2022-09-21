<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SocialMedia extends Model
{
    protected $fillable = [
        'title',
        'url',
        'socialmediaable_id',
        'socialmediaable_type',
    ];

    protected $appends = ['icon', 'label', 'caption'];

    protected $table = 'socialmedia';

    public function parent()
    {
        return $this->socialmediaable();
    }

    public function socialmediaable()
    {
        return $this->morphTo();
    }

    public function getIconAttribute()
    {
        if (!empty($this->title)) {
            switch ($this->title) {
                case 'instagram':
                case 'اینستاگرام':
                    $icon = 'icons/special-flat/instagram.svg';
                    break;
                case 'telegram':
                case 'تلگرام':
                    $icon = 'images/social-medias/telegram.png';
                    break;
                case 'facebook':
                    $icon = 'images/social-medias/facebook.png';
                    break;
                case 'twitter':
                    $icon = 'icons/special-flat/twitter.svg';
                    break;
                case 'linkedin':
                    $icon = 'images/social-medias/linkedin.png';
                    break;
                case 'soroush':
                    $icon = 'images/social-medias/soroush.png';
                    break;
                case 'eitaa':
                    $icon = 'images/social-medias/eitaa.png';
                    break;
                case 'bale':
                    $icon = 'images/social-medias/bale.png';
                    break;
                case 'aparat':
                    $icon = 'images/social-medias/aparat.png';
                    break;
                case 'whatsapp':
                    $icon = 'images/social-medias/whatsapp.png';
                    break;
                case 'website':
                    $icon = 'icons/special-flat/domain.svg';
                    break;
                case 'email':
                    $icon = 'icons/special-flat/email.svg';
                    break;
            }
            return $icon;
        }
        return 'icons/special-flat/social-media.svg';
    }

    public function getLabelAttribute()
    {
        return $this->title;
    }

    public function getCaptionAttribute()
    {
        return $this->url;
    }

    public function getInfoAttribute()
    {
        return [
            'route' => 'social-media',
            'model' => 'App\Socialmedia',
            'plural' => 'شبکه های اجتماعی',
            'singular' => 'شبکه اجتماعی',
            'parentable' => 'socialmediaable',
            'type' => 'form',
            'icon' => asset('icons/Info.png'),
        ];
    }

    public function getInputsAttribute()
    {
        return [
            'title' => [
                'label' => 'نام شبکه اجتماعی',
                'type' => 'select',
                'name' => 'title',
                'select_type' => '',
                'options_type' => 'inner',
                'options' => [
                    ['value' => 'soroush', 'label' => 'سروش'],
                    ['value' => 'eitaa', 'label' => 'ایتا'],
                    ['value' => 'bale', 'label' => 'بله'],
                    ['value' => 'aparat', 'label' => 'آپارات'],
                    ['value' => 'instagram', 'label' => 'اینستاگرام'],
                    ['value' => 'telegram', 'label' => 'تلگرام'],
                    ['value' => 'whatsapp', 'label' => 'واتساپ'],
                    ['value' => 'facebook', 'label' => 'فیسبوک'],
                    ['value' => 'twitter', 'label' => 'توییتر'],
                    ['value' => 'linkedin', 'label' => 'لینکدین'],
                    ['value' => 'website', 'label' => 'وب سایت'],
                ],
                'save_type' => 'save_in',
            ],
            'url' => [
                'type' => 'text',
                'name' => 'url',
                'label' => 'لینک',
            ],
        ];
    }

    public function getRulesAttribute()
    {
        return [
            'title' => 'required',
            'url' => 'required',
        ];
    }

    public function getMessagesAttribute()
    {
        return [
            'title.required' => __('لطفا عنوان را وارد کنید'),
            'url.required' => __('لطفا لینک را وارد کنید'),
        ];
    }

}
