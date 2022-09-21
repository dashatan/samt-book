<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Province extends Model
{
    protected $fillable = [
        'title',
    ];
    protected $appends = ['label', 'value'];

    public function getValueAttribute()
    {
        return $this->id;
    }

    public function getLabelAttribute()
    {
        return $this->title;
    }

    public function industrial_parks()
    {
        return $this->hasMany('App\IndustrialPark', 'province_id');
    }

    public function IPFactories()
    {
        return $this->hasMany('App\IPFactory', 'province_id');
    }

    public function IDFactories()
    {
        return $this->hasMany('App\IDFactory', 'province_id');
    }

    public function IPWorkshops()
    {
        return $this->hasMany('App\IPWorkshop', 'province_id');
    }

    public function IDWorkshops()
    {
        return $this->hasMany('App\IDWorkshop', 'province_id');
    }

    public function Exhibitions()
    {
        return $this->hasMany('App\Exhibition', 'province_id');
    }

    public function posts()
    {
        return $this->morphToMany('App\Post', 'postable');
    }

    public function slides()
    {
        return $this->morphToMany('App\Post', 'postable');
    }

    public function cities()
    {
        return $this->hasMany(City::class, 'province_id');
    }

    public function users()
    {
        return $this->morphToMany(User::class, 'userable');
    }

}
