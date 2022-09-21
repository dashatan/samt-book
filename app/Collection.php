<?php

namespace App;

use Illuminate\Database\Eloquent\Collection as eloquentCollection;
use Illuminate\Database\Eloquent\Model;

class Collection extends Model
{
    protected $fillable = [
        'class',
        'type',
        'user_id',
        'country_id',
        'province_id',
        'city_id',
        'idp_id',
        'ftz_id',
        'exb_id',
        'company_id',
        'executor_id',
        'category_id',
        'is_in_idp',
        'is_in_ftz',
        'image_url',
        'image_path',
        'title',
        'dsc',
        'sort',
        'page_view',
        'published',
        'published_by',
        'created_at',
        'created_by',
        'updated_at',
        'updated_by',
        'token',
        'collectionable_type',
        'collectionable_id',
    ];
    protected $appends = [
        'label',
        'value',
        'icon',
        'image',
        'modelName',
        'info',
        'hasRelation',
        'likesCount',
        'commentsCount',
//        'top20Subset',
//        'top20News',
//        'top20Wantads',
    ];

    public function scopePublished($query)
    {
        return $query->where('published', '=', 1);
    }

    public function getValueAttribute()
    {
        return $this->id;
    }

    public function getHasRelationAttribute()
    {
        return true;
    }

    public function getLabelAttribute()
    {
        return $this->title;
    }

    public function getDefaultImageAttribute()
    {
        switch ($this->class) {
            case 'idp':
                return asset('images/industrial-zone.jpg');
            case 'prd':
                $rand = rand(1, 19);
                return asset('images/factory/factory (' . $rand . ').jpg');
            case 'prv':
                $rand = rand(1, 18);
                return asset('images/mine/mine (' . $rand . ').jpg');
            case 'wtd':
                return asset('icons/Wantad.png');
            case 'exb':
            case 'evt':
                return asset('images/exhibition.jpg');
            case 'gld':
            case 'ofc':
            case 'act':
            case 'ftz':
            default:
                return asset('images/factory.jpg');
        }
    }

    public function getImageAttribute()
    {
        if (empty($this->image_path)) {
            return $this->getDefaultImageAttribute();
        }
        if ($this->class === 'idp') {
            return asset('storage/images/industrialPark/' . $this->image_path);
        }
        return asset('storage/images/' . $this->image_path);
    }

    public function getIconAttribute()
    {
        if (empty($this->image_path)) {
            return null;
        }
        if ($this->class === 'idp') {
            return 'storage/images/industrialPark/' . $this->image_path;
        }
        return 'storage/images/' . $this->image_path;
    }

    public function getInfoAttribute()
    {
        $info = new eloquentCollection();
        switch ($this->class) {
            case 'idp':
                $info->put('singular', 'شهرک صنعتی');
                $info->put('plural', 'شهرک های صنعتی');
                break;
            case 'prd':
                $info->put('singular', 'واحد صنعتی-تولیدی');
                $info->put('plural', 'واحدهای صنعتی-تولیدی');
                break;
            case 'prv':
                switch ($this->type) {
                    case 'clearance':
                        $info->put('singular', 'ترخیص کار');
                        $info->put('plural', 'ترخیص کارارن');
                        break;
                    case 'import-export':
                        $info->put('singular', 'صادر/وارد کننده');
                        $info->put('plural', 'صادر/وارد کنندگان');
                        break;
                    case 'mineral':
                        $info->put('singular', 'تولید کننده مواد اولیه');
                        $info->put('plural', 'تولید کنندگان مواد اولیه');
                        break;
                    case 'mine':
                        $info->put('singular', 'معدن');
                        $info->put('plural', 'معادن');
                        break;
                    case 'farming':
                        $info->put('singular', 'کشاورز');
                        $info->put('plural', 'کشاورزان');
                        break;
                }
                $info->put('singular', 'تامین کننده');
                $info->put('plural', 'تامین کنندگان');
                break;
            case 'gld':
                $info->put('singular', 'واحد صنفی');
                $info->put('plural', 'واحدهای صنفی');
                break;
            case 'ofc':
                $info->put('singular', 'واحد اداری');
                $info->put('plural', 'واحدهای اداری');
                break;
            case 'act':
                $info->put('singular', 'تشکل');
                $info->put('plural', 'اتاق بازرگانی و تشکل ها');
                break;
            case 'ftz':
                $info->put('singular', 'منطقه آزاد تجاری-صنعتی');
                $info->put('plural', 'مناطق آزاد تجاری-صنعتی');
                break;
            case 'exb':
                $info->put('singular', 'نمایشگاه');
                $info->put('plural', 'نمایشگاه ها');
                break;
            case 'prt':
                $info->put('singular', 'مشارکت کننده در نمایشگاه');
                $info->put('plural', 'مشارکت کنندگان در نمایشگاه');
                break;
            case 'wtd':
                $info->put('singular', 'نیازمندی');
                $info->put('plural', 'نیازمندی ها');
                break;
            case 'pdc':
                $info->put('singular', 'محصول');
                $info->put('plural', 'محصولات');
                break;
            case 'srv':
                $info->put('singular', 'خدمت');
                $info->put('plural', 'خدمات');
                break;
            case 'nws':
                $info->put('singular', 'خبر');
                $info->put('plural', 'اخبار');
                break;
        }
        return $info;
    }

    public function getInputsAttribute()
    {
        $info = new eloquentCollection(
            [
                'image' => [
                    'type' => 'file',
                    'name' => 'image',
                    'label' => __('تصویر'),
                    'required' => true,
                ],
                'title' => [
                    'type' => 'text',
                    'name' => 'title',
                    'label' => 'عنوان',
                    'required' => true,
                ],
                'dsc' => [
                    'type' => 'textarea',
                    'name' => 'dsc',
                    'label' => __('توضیحات'),
                ],
                'country_id' => [
                    'type' => 'select',
                    'name' => 'country_id',
                    'label' => __('کشور'),
                ],
            ]
        );
        if (in_array($this->class, ['prd', 'gld', 'prv', 'wtd'])) {
            $info->put(
                'type',
                [
                    'type' => 'select',
                    'name' => 'type',
                    'label' => __('طبقه بندی'),
                ]
            );
        }
        if (in_array($this->class, ['prd', 'wtd'])) {
            $info->put(
                'category_id',
                [
                    'type' => 'select',
                    'name' => 'category_id',
                    'label' => __('دسته بندی'),
                ]
            );
        }
        if (!in_array($this->class, ['evt'])) {
            $info->put(
                'province_id',
                [
                    'type' => 'select',
                    'name' => 'province_id',
                    'label' => __('استان'),
                ]
            );
            $info->put(
                'city_id',
                [
                    'type' => 'select',
                    'name' => 'city_id',
                    'label' => __('شهر'),
                ]
            );
        }
        if (!in_array($this->class, ['evt', 'wtd'])) {
            $info->put(
                'idp_id',
                [
                    'type' => 'select',
                    'name' => 'idp_id',
                    'label' => __('شهرک صنعتی'),
                ]
            );
            $info->put(
                'ftz_id',
                [
                    'type' => 'select',
                    'name' => 'ftz_id',
                    'label' => __('منطقه آزاد تجاری-صنعتی'),
                ]
            );
            $info->put(
                'in_idp',
                [
                    'type' => 'boolean',
                    'name' => 'in_idp',
                    'label' => __('مستقر در شهرک صنعتی'),
                ]
            );
            $info->put(
                'in_ftz',
                [
                    'type' => 'boolean',
                    'name' => 'in_ftz',
                    'label' => __('مستقر در منطقه آزاد تجاری-صنعتی'),
                ]
            );
        }
        if (in_array($this->class, ['evt'])) {
            $info->put(
                'exb_id',
                [
                    'type' => 'select',
                    'name' => 'exb_id',
                    'label' => __('نمایشگاه'),
                ]
            );
            $info->put(
                'executor_id',
                [
                    'type' => 'select',
                    'name' => 'executor_id',
                    'label' => __('مجری'),
                ]
            );
            $info->put(
                'open_date',
                [
                    'type' => 'date',
                    'name' => 'open_date',
                    'label' => __('تاریخ افتتاحیه'),
                ]
            );
            $info->put(
                'close_date',
                [
                    'type' => 'date',
                    'name' => 'close_date',
                    'label' => __('تاریخ اختتامیه'),
                ]
            );
            $info->put(
                'open_time',
                [
                    'type' => 'time',
                    'name' => 'open_time',
                    'label' => __('زمان شروع بازدید'),
                ]
            );
            $info->put(
                'close_time',
                [
                    'type' => 'time',
                    'name' => 'close_time',
                    'label' => __('زمان اتمام بازدید'),
                ]
            );
        }
        return $info;
    }

    public function getRelationsAttribute()
    {
        $relations = new eloquentCollection();
        //products
        if (in_array($this->class, ['prd'])) {
            $relations->push(
                [
                    'name' => 'products',
                    'label' => __('محصولات'),
                    'icon' => 'images/icons/classes/linear-color/manufacturing.svg',
                ]
            );
        }
        //news
        if (in_array($this->class, ['prd', 'idp', 'ofc', 'ftz', 'gld', 'prv'])) {
            $relations->push(
                [
                    'name' => 'news',
                    'label' => __('اخبار'),
                    'icon' => 'images/icons/classes/linear-color/newspaper.svg',
                ]
            );
        }
        //boards
        if (in_array($this->class, ['prd', 'idp', 'ofc', 'ftz', 'gld', 'prv'])) {
            $relations->push(
                [
                    'name' => 'boards',
                    'label' => __('هیئت مدیره'),
                    'icon' => 'images/icons/classes/linear-color/team.svg',
                ]
            );
        }
        //agents
        if (in_array($this->class, ['prd', 'gld', 'prv',])) {
            $relations->push(
                [
                    'name' => 'agents',
                    'label' => __('نمایندگی ها'),
                    'icon' => 'images/icons/classes/linear-color/delegate.svg',
                ]
            );
        }
        //wantads
        if (in_array($this->class, ['prd', 'idp', 'ofc', 'ftz', 'gld', 'prv'])) {
            $relations->push(
                [
                    'name' => 'wantads',
                    'label' => __('نیازمندی ها'),
                    'icon' => 'images/icons/classes/linear-color/wantad.svg',
                ]
            );
        }
        //catalog
        if (in_array($this->class, ['prd', 'gld', 'prv'])) {
            $relations->push(
                [
                    'name' => 'catalog',
                    'label' => __('کاتالوگ'),
                    'icon' => 'images/icons/classes/linear-color/Catalog.svg',
                ]
            );
        }

        $relations->push(
            [
                'name' => 'contact',
                'label' => __('اطلاعات تماس'),
                'icon' => 'images/icons/classes/linear-color/customer-service-agent.svg',
            ]
        );

        return $relations;
    }

    public function getModelNameAttribute()
    {
        return Collection::class;
    }

    public function getCommentsCountAttribute()
    {
        return $this->comments()->count();
    }

    public function getLikesCountAttribute()
    {
        return $this->likes()->count();
    }

    public function getTop20SubsetAttribute()
    {
        $relation = null;
        switch ($this->class) {
            case'prd':
            case'prt':
            case'gld':
            case'prv':
                $relation = 'products';
                $label = "جدید ترین محصولات";
                $class = 'pdc';
                break;
            case'exp':
                $relation = 'participants';
                $label = 'برترین مشارکت کنندگان';
                $class = 'prt';
                break;
            case'idp':
                $relation = 'idpSubsets';
                $label = 'واحدها و مجموعه های مستقر';
                $class = '';
                break;
            case'ftz':
                $relation = 'ftzSubsets';
                $label = 'واحدها و مجموعه های مستقر';
                $class = '';
                break;
            case'ofc':
            case'act':
                $relation = 'services';
                $label = 'خدمات ارائه شده';
                $class = 'srv';
                break;
        }
        if ($relation != null) {
            $data = $this->$relation()
//                ->where('published','=',1)
                ->orderBy('sort')
                ->limit(20)
                ->get();
            return compact('data', 'label', 'class');
        }
        return null;
    }

    public function getTop20NewsAttribute()
    {
        $label = 'تازه ترین اخبار و رویداد ها';
        $class = 'nws';
        $data = $this->news()
//            ->where('published','=',1)
            ->orderBy('sort')
            ->limit(20)
            ->get();
        return compact('data', 'label', 'class');
    }

    public function getTop20WantadsAttribute()
    {
        $label = 'اطلاعیه ها و نیازمندی ها';
        $class = 'wtd';
        $data = $this->wantads()
//            ->where('published','=',1)
            ->orderBy('sort')
            ->limit(20)
            ->get();
        return compact('data', 'label', 'class');
    }

    public function getUserAttribute()
    {
        $user = null;
        if (!empty($this->user_id)) {
            $user = User::find($this->user_id);
        } else {
            if ($this->collectionable) {
                if (!empty($this->collectionable->user_id)) {
                    $user = User::find($this->collectionable->user_id);
                }
            }
        }
        return $user;
    }

    public function collectionable()
    {
        return $this->morphTo();
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id');
    }

    public function province()
    {
        return $this->belongsTo(Province::class, 'province_id');
    }

    public function city()
    {
        return $this->belongsTo(City::class, 'city_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function idp()
    {
        return $this->belongsTo(Collection::class, 'idp_id');
    }

    public function idpSubsets()
    {
        return $this->hasMany(Collection::class, 'idp_id');
    }

    public function ftzSubsets()
    {
        return $this->hasMany(Collection::class, 'ftz_id');
    }

    public function ftz()
    {
        return $this->belongsTo(FreeTradeZone::class, 'ftz_id');
    }

    public function collections()
    {
        return $this->morphMany(Collection::class, 'collectionable');
    }

    public function products()
    {
        return $this->morphMany(Collection::class, 'collectionable')
            ->where('class', '=', 'pdc');
    }

    public function services()
    {
        return $this->morphMany(Collection::class, 'collectionable')
            ->where('class', '=', 'srv');
    }

    public function wantads()
    {
        return $this->morphMany(Collection::class, 'collectionable')
            ->where('class', '=', 'wtd');
    }

    public function participants()
    {
        return $this->morphMany(Collection::class, 'collectionable')
            ->where('class', '=', 'prt');
    }

    public function news()
    {
        return $this->morphMany(Collection::class, 'collectionable')
            ->where('class', '=', 'nws');
    }

    public function boards()
    {
        return $this->morphMany(Board::class, 'boardable');
    }

    public function agents()
    {
        return $this->morphMany(Collection::class, 'collectionable')
            ->where('class', '=', 'agt');
    }

    public function slides()
    {
        return $this->morphMany(Slide::class, 'slideable');
    }

    public function catalogs()
    {
        return $this->morphMany(Catalog::class, 'catalogable');
    }

    public function socialMedias()
    {
        return $this->morphMany(Socialmedia::class, 'Socialmediaable');
    }

    public function phones()
    {
        return $this->morphMany(Phone::class, 'phoneable');
    }

    public function addresses()
    {
        return $this->morphMany(Address::class, 'addressable');
    }

    public function metas()
    {
        return $this->morphMany(Meta::class, 'metable');
    }

    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    public function likes()
    {
        return $this->morphMany(Like::class, 'likeable');
    }

    public static function boot()
    {
        parent::boot();
        self::deleting(
            function ($collection) {
                $collection->addresses()->each(function ($address) {
                    $address->delete();
                });
                $collection->phones()->each(function ($phone) {
                    $phone->delete();
                });
                $collection->socialMedias()->each(function ($socialMedia) {
                    $socialMedia->delete();
                });
                $collection->catalogs()->each(function ($catalog) {
                    $catalog->delete();
                });
                $collection->slides()->each(function ($slide) {
                    $slide->delete();
                });
                $collection->agents()->each(function ($agent) {
                    $agent->delete();
                });
                $collection->boards()->each(function ($board) {
                    $board->delete();
                });
                $collection->metas()->each(function ($meta) {
                    $meta->delete();
                });
                $collection->collections()->each(function ($collection) {
                    $collection->delete();
                });
            }
        );
    }

}
