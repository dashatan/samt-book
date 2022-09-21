<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Room extends Model
{
    protected $with = ['users'];
    protected $appends = ['lastMessage', 'unseenMessagesCount'];

    public function users()
    {
        return $this->belongsToMany(User::class, 'room_user');
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'room_id');
    }

    public function getLastMessageAttribute()
    {
        return Message::query()->where('room_id', '=', $this->id)
            ->orderByDesc('created_at')
            ->first();
    }

    public function getUnseenMessagesCountAttribute()
    {
        return $unseenMessagesCount = Message::query()
            ->where('room_id', '=', $this->id)
            ->where('user_id', '!=', Auth::id())
            ->where('seen', '=', 0)
            ->count();
    }

    public static function boot()
    {
        parent::boot();
        self::deleting(
            function ($room) {
                $room->messages()->each(
                    function ($message) {
                        $message->delete();
                    }
                );
            }
        );
    }
}
