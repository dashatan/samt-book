<?php

namespace App;

use App\Scopes\PublishScope;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class IndustrialPark extends Model
{
    use Searchable;

    protected $appends = ['info', 'label', 'value', 'image', 'modelName', 'class','icon'];
    protected $with = ['province'];

    public function getValueAttribute()
    {
        return $this->id;
    }

    public function getLabelAttribute()
    {
        return $this->title;
    }

    public function getDefaultImageAttribute()
    {
        return asset('images/industrial-zone.jpg');
    }

    public function getImageAttribute()
    {
        if (empty($this->logo_name)) {
            return $this->getDefaultImageAttribute();
        }
        return asset('storage/images/industrialPark/' . $this->logo_name);
    }

    public function getIconAttribute()
    {
        if (empty($this->logo_name)) {
            return $this->getDefaultImageAttribute();
        }
        return 'storage/images/industrialPark/' . $this->logo_name;
    }

    public function getModelNameAttribute()
    {
        return IndustrialPark::class;
    }

    public function getClassAttribute()
    {
        return 'idp';
    }

    public function province()
    {
        return $this->belongsTo(Province::class, 'province_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function getEditorAttribute()
    {
        return $this->province->users;
    }

    public function producers()
    {
        return $this->hasMany(Producer::class, 'idp_id')->withoutGlobalScope(PublishScope::class);
    }

    public function guilds()
    {
        return $this->hasMany(Guild::class, 'idp_id')->withoutGlobalScope(PublishScope::class);
    }

    public function offices()
    {
        return $this->hasMany(Office::class, 'idp_id')->withoutGlobalScope(PublishScope::class);
    }

    public function mines()
    {
        return $this->hasMany(Mine::class, 'idp_id')->withoutGlobalScope(PublishScope::class);
    }

    public function collections()
    {
        return $this->hasMany(Collection::class, 'idp_id');
    }

    public function associations()
    {
        return $this->hasMany(Association::class, 'idp_id')->withoutGlobalScope(PublishScope::class);
    }

    public function slides()
    {
        return $this->morphMany(Slide::class, 'slideable');
    }

    public function news()
    {
        return $this->morphMany(Collection::class, 'collectionable')
            ->where('class', '=', 'nws');
    }

    public function boards()
    {
        return $this->morphMany('App\Board', 'boardable');
    }

    public function images()
    {
        return $this->morphMany('App\Multimedia', 'multimediaable');
    }

    public function videos()
    {
        return $this->morphMany(Video::class, 'videoable');
    }

    public function socialMedias()
    {
        return $this->morphMany(Socialmedia::class, 'socialmediaable');
    }

    public function phones()
    {
        return $this->morphMany('App\Phone', 'phoneable');
    }

    public function wantads()
    {
        return $this->morphMany(Collection::class, 'collectionable')
            ->where('class', '=', 'wtd');
    }

    public function goals()
    {
        return $this->morphMany('App\Goal', 'goalable');
    }

    public function addresses()
    {
        return $this->morphMany(Address::class, 'addressable');
    }

    public function receivedMessages()
    {
        return $this->morphMany(Message::class, 'receiver');
    }

    public function getInfoAttribute()
    {
        return [
            'plural' => 'شهرک های صنعتی',
            'singular' => 'شهرک صنعتی',
            'route' => 'IDP',
            'image_path' => 'industrialPark',
            'parent-route' => 'industry',
            'model' => 'App\IndustrialPark',
            'type' => 'company',
            'default_image' => asset('images/industrial-zone.jpg'),
            'icon' => asset('icons/Industry.png'),
        ];
    }

    public function getRelationshipsAttribute()
    {
        return [
            'slides' => [
                'model' => 'App\Post',
                'type' => 'input',
                'save_type' => 'attach',
            ],
            'addresses' => [
                'model' => 'App\Address',
                'type' => 'input',
                'save_type' => 'save',
            ],
            'phones' => [
                'model' => 'App\Phone',
                'type' => 'input',
                'save_type' => 'save',
            ],
            'social_medias' => [
                'model' => 'App\Socialmedia',
                'type' => 'input',
                'save_type' => 'save',
            ],
            'news' => [
                'model' => 'App\News',
                'type' => 'input',
                'save_type' => 'save',
            ],
            'boards' => [
                'model' => 'App\Board',
                'type' => 'input',
                'save_type' => 'save',
            ],
            'images' => [
                'model' => 'App\Multimedia',
                'type' => 'input',
                'save_type' => 'save',
            ],
            'goals' => [
                'model' => 'App\Goal',
                'type' => 'input',
                'save_type' => 'save',
            ],
        ];
    }

    public function getInputsAttribute()
    {
        $provinces = Province::query()->orderBy('title')->with('cities')->get();
        return [
            'logo' => [
                'type' => 'file',
                'name' => 'logo',
                'label' => 'تصویر',
            ],
            'title' => [
                'type' => 'text',
                'name' => 'title',
                'label' => 'عنوان',
            ],
            'unique_id' => [
                'type' => 'hidden',
                'name' => 'unique_id',
                'label' => 'شناسه یکتا',
            ],
            'province' => [
                'label' => 'استان',
                'type' => 'select',
                'select_type' => '',
                'name' => 'province_id',
                'options_type' => 'from_model',
                'options' => $provinces,
                'save_type' => 'save_in',
            ],
            'city' => [
                'type' => 'just_for_store',
                'name' => 'city_id',
                'save_type' => 'save_in',
            ],
            'lang' => [
                'label' => 'زبان',
                'type' => 'select',
                'select_type' => '',
                'name' => 'lang',
                'options_type' => 'inner',
                'options' => [
                    ['value' => 'fa', 'label' => 'فارسی'],
                    ['value' => 'en', 'label' => 'English'],
                ],
                'save_type' => 'save_in',
            ],
            'email' => [
                'type' => 'text',
                'name' => 'email',
                'label' => 'ایمیل',
            ],
            'dsc' => [
                'type' => 'textarea',
                'cols' => '30',
                'rows' => '6',
                'name' => 'dsc',
                'label' => 'توضیحات',
            ],
        ];
    }

    public function getRulesAttribute()
    {
        return [
            'title' => 'required',
            'province_id' => 'required',
        ];
    }

    public function getRulesInEditPageAttribute()
    {
        return [
            'title' => 'required',
            'province_id' => 'required',
        ];
    }

    public function getMessagesAttribute()
    {
        return [
            'title.required' => 'لطفا عنوان را وارد کنید',
            'address.required' => 'لطفا آدرس را وارد کنید',
            'province_id.required' => 'لطفا استان را وارد کنید',
            'categories.required' => 'لطفا دسته بندی را وارد کنید',
        ];
    }

}
