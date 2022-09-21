<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Phone extends Model
{

    protected $fillable = [
        'title',
        'number',
        'phoneable_id',
        'phoneable_type',
    ];

    protected $appends = ['icon','label','caption'];

    public function phoneable()
    {
        return $this->morphTo();
    }

    public function getIconAttribute()
    {
        return 'icons/special-flat/telephone.svg';
    }

    public function getLabelAttribute()
    {
        return $this->title;
    }

    public function getCaptionAttribute()
    {
        return $this->phone_number;
    }

}
