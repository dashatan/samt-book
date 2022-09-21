<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    protected $fillable = ['title', 'province_id'];
    protected $appends = ['label', 'value'];

    public function getValueAttribute()
    {
        return $this->id;
    }

    public function getLabelAttribute()
    {
        return $this->title;
    }

    public function province()
    {
        return $this->belongsTo(Province::class, 'province_id');
    }

    public function producers()
    {
        return $this->hasMany(Producer::class, 'city_id');
    }

    public function mines()
    {
        return $this->hasMany(Mine::class, 'city_id');
    }

    public function offices()
    {
        return $this->hasMany(Office::class, 'city_id');
    }

    public function guilds()
    {
        return $this->hasMany(Guild::class, 'city_id');
    }

    public function exhibitions()
    {
        return $this->hasMany(Exhibition::class, 'city_id');
    }

    public function industrial_parks()
    {
        return $this->hasMany(IndustrialPark::class, 'city_id');
    }
}
