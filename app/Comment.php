<?php

namespace App;

use Hekmatinasser\Verta\Verta;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = ['commentable_id', 'commentable_type', 'text', 'user_id', 'published'];
    protected $with = ['replies', 'user'];
    protected $appends = ['time', 'date', 'caption', 'icon'];

    public function commentable()
    {
        return $this->morphTo();
    }

    public function replies()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

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

    public function getCaptionAttribute()
    {
        return $this->text;
    }

    public function getIconAttribute()
    {
        return 'icons/special-flat/comments.svg';
    }
}
