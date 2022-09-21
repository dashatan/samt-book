<?php

namespace App;

use Hekmatinasser\Verta\Verta;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use phpDocumentor\Reflection\Types\Self_;

class Message extends Model
{
    protected $fillable = [
        'user_id',
        'room_id',
        'parent_id',
        'message',
        'image_path',
        'video_path',
        'image_url',
        'video_url',
        'type',
        'seen',
    ];
    protected $appends = ['time', 'date', 'image', 'video','displayType'];


    public function getTimeAttribute()
    {
        $v = new Verta($this->created_at);
        return $v->hour . ':' . $v->minute;
    }

    public function getDateAttribute()
    {
        $v = new Verta($this->created_at);
        return $v->year . '/' . $v->month . '/' . $v->day;
    }

    public function getImageAttribute()
    {
        if ($this->type == 'extend'){
            return $this->parent->getImageAttribute();
        }
        if (!empty($this->image_path)) {
            return asset('storage/images/messages/' . $this->image_path);
        }
        return null;
    }

    public function getVideoAttribute()
    {
        if ($this->type == 'extend'){
            return $this->parent->getVideoAttribute();
        }
        if (!empty($this->video_path)) {
            return asset('storage/videos/messages/' . $this->video_path);
        }
        return null;
    }

    public function getMessageAttribute($message)
    {
        if ($this->type == 'extend'){
            return $this->parent->message;
        }
        return $message;
    }

    public function getDisplayTypeAttribute()
    {
        if ($this->type == 'extend'){
            return $this->parent->type;
        }
        return $this->type;
    }

    public function parent()
    {
        return $this->belongsTo(Message::class,'parent_id');
    }

    public static function boot()
    {
        parent::boot();
        self::deleting(
            function ($message) { // before delete() method call this
                if (!empty($message->image_path)) {
                    Storage::delete('public/images/messages/' . $message->image_path);
                }
                if (!empty($message->video_path)) {
                    Storage::delete('public/videos/messages/' . $message->video_path);
                }
            }
        );
    }
}
