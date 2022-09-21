<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Meta extends Model
{
    protected $fillable = ['key','value','metable_id','metable_type'];
    protected $appends = ['label','icon','caption'];

    public function metable()
    {
        return $this->morphTo();
    }

    public function getIconAttribute()
    {
        return 'icons/special-flat/analysis.svg';
    }

    public function getLabelAttribute()
    {
        return $this->key;
    }
    public function getCaptionAttribute()
    {
        return $this->value;
    }
}
