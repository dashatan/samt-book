<?php

namespace App;

use App\Scopes\PublishScope;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class FreeTradeZone extends Model
{
    use Searchable;

    protected $fillable = ['province_id', 'title', 'unique_id', 'dsc', 'logo_url', 'logo_name', 'published', 'page_view', 'created_by', 'updated_by', 'published_by', 'created_at', 'updated_at', 'sort'];
    protected $appends = ['info', 'label', 'value', 'image', 'modelName', 'class'];
    protected $hidden = ['published'];
    protected $with = ['province'];


    protected static function boot()
    {
        parent::boot();
        static::addGlobalScope(new PublishScope());
    }

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
        return $this->logo_url;
    }

    public function getModelNameAttribute()
    {
        return FreeTradeZone::class;
    }

    public function getClassAttribute()
    {
        return 'ftz';
    }

    public function province()
    {
        return $this->belongsTo('App\Province', 'province_id');
    }

    public function producers()
    {
        return $this->hasMany(Producer::class, 'ftz_id');
    }

    public function mines()
    {
        return $this->hasMany(Mine::class, 'ftz_id');
    }

    public function guilds()
    {
        return $this->hasMany(Guild::class, 'ftz_id');
    }

    public function idps()
    {
        return $this->hasMany(IndustrialPark::class, 'ftz_id');
    }

    public function exhibitions()
    {
        return $this->hasMany(Exhibition::class, 'ftz_id');
    }

    public function posts()
    {
        return $this->morphToMany('App\Post', 'postable');
    }

    public function slides()
    {
        return $this->morphToMany('App\Post', 'postable');
    }

    public function news()
    {
        return $this->morphMany('App\News', 'newsable');
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

    public function social_medias()
    {
        return $this->morphMany('App\Socialmedia', 'socialmediaable');
    }

    public function phones()
    {
        return $this->morphMany('App\Phone', 'phoneable');
    }

    public function wantads()
    {
        return $this->morphMany('App\Wantad', 'Wantadable');
    }

    public function goals()
    {
        return $this->morphMany('App\Goal', 'goalable');
    }

    public function addresses()
    {
        return $this->morphMany(Address::class, 'addressable');
    }

    public function getInfoAttribute()
    {
        return [
            'plural' => 'مناطق آزاد تجاری و صنعتی',
            'singular' => 'منطقه آزاد تجاری و صنعتی',
            'route' => 'ftz',
            'parent-route' => 'industry',
            'open-li' => 'ftz',
            'active-li' => 'ftz',
            'model' => 'App\FreeTradeZone',
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
            'videos' => [
                'model' => Video::class,
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
                'model' => 'App\Province',
                'options' => Province::all()->sortBy('id'),
                'constraints' =>
                    [
                        'sortBy' => [
                            'key' => 'orderBy',
                            'val' => ['id']
                        ],
                    ],
                'visible_for' => ['admin', 'editor', 'verified', 'user'],
            ],
            'city' => [
                'label' => 'شهر',
                'type' => 'just_for_save',
                'name' => 'city_id',
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
            'title.required' => __('لطفا عنوان را وارد کنید'),
            'province_id.required' => __('لطفا استان را وارد کنید'),
        ];
    }
}
