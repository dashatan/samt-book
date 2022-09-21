<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{

    protected $fillable = ['title', 'class', 'parent_id','lang'];
    protected $appends = ['label','value'];

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function categories()
    {
        return $this->hasMany(Category::class, 'id', 'id')
            ->where('parent_id', '=', 0)->with('subset');
    }

    public function subset()
    {
        return $this->hasMany(Category::class, 'parent_id', 'id')->with('subset');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id', 'id')->with('children');
    }

    public function getInfoAttribute()
    {
        return [
            'plural' => 'دسته بندی ها',
            'singular' => 'دسته بندی',
            'route' => 'category',
            'model' => 'App\Category',
            'parentable' => 'parent',
            'type' => 'form',
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
            'parent_id' => [
                'label' => 'دسته بندی مادر',
                'type' => 'select',
                'select_type' => '',
                'name' => 'parent_id',
                'id' => 'parent_id',
                'className' => 'form-control',
                'options_type' => 'from_model',
                'model' => 'App\Category',
                'constraints' => [
                    'where' => [
                        'key' => 'where',
                        'val' => ['parent_id', '=', '0'],
                    ],
                    'sortBy' => [
                        'key' => 'orderBy',
                        'val' => ['title']
                    ],
                ],
                'visible_for' => ['admin', 'editor', 'verified', 'user'],
                'save_type' => 'save_in',
            ],
            'categoryable_type' => [
                'type' => 'text',
                'name' => 'categoryable_type',
                'label' => 'نوع مجموعه',
            ]
        ];
    }

    public function getValueAttribute()
    {
        return $this->id;
    }

    public function getLabelAttribute()
    {
        return $this->title;
    }

}
