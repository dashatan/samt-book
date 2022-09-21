<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class MyApp extends Model
{
    protected $appends = ['title','contacts'];

    public function news()
    {
        return $this->morphMany(Collection::class, 'collectionable')
                    ->where('class', '=', 'nws');

    }

    public function wantads()
    {
        return $this->morphMany(Collection::class, 'collectionable')
                    ->where('class', '=', 'wtd');

    }

    public function slides()
    {
        return $this->morphMany(Slide::class, 'slideable');
    }

    public function addresses()
    {
        return $this->morphMany(Address::class, 'addressable');
    }

    public function socialMedias()
    {
        return $this->morphMany(Socialmedia::class, 'socialmediaable');
    }

    public function phones()
    {
        return $this->morphMany(Phone::class, 'phoneable');
    }

    public function user()
    {
        return User::query()->where('role', '=', 'admin')->first();
    }

    public function getTitleAttribute()
    {
        return 'صمت بوک';
    }

    public function getContactsAttribute()
    {
        return [
//            [
//                'name' => 'support',
//                'label' => 'پشتیبانی',
//                'user' => User::query()->where('email', '=', 'dashatanad@gmail.com')->first(),
//            ],
//            [
//                'name' => 'management',
//                'label' => 'مدیریت',
//                'user' => User::query()->where('email', '=', 'samtbookonline@gmail.com')->first(),
//            ],
//            [
//                'name' => 'editor',
//                'label' => 'نماینده',
//                'user' => User::query()->where('role', '=', 'editor')
//                              ->where('province_id', '=', Auth::user()->province_id)->first(),
//            ],
        ];
    }

}
