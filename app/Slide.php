<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Slide extends Model
{
    protected $fillable = [
        'type',
        'image_path',
        'video_path',
        'link',
        'slideable_id',
        'slideable_type',
    ];

    protected $appends = ['image','icon','title','video'];

    public function slideable()
    {
        return $this->morphTo();
    }

    public function getDefaultImageAttribute()
    {
        return asset('images/factory.jpg');
    }

    public function getImageAttribute()
    {
        return asset('storage/images/' . $this->image_path);
    }

    public function getVideoAttribute()
    {
        return asset('storage/videos/' . $this->video_path);
    }

    public function getIconAttribute()
    {
        if (!empty($this->image_path)) {
            return 'storage/images/' . $this->image_path;
        }
        if (!empty($this->video_path)) {
            return 'storage/videos/' . $this->video_path;
        }
        return null;
    }

    public function getTitleAttribute()
    {
        return $this->id;
    }
}
