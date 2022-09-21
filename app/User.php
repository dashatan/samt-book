<?php

namespace App;

use Hekmatinasser\Verta\Verta;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    public function routeNotificationForFcm()
    {
        return $this->fcm_token;
    }

    protected $fillable = [
        'lang',
        'name',
        'email',
        'password',
        'role',
        'mobile',
        'username',
        'avatar_url',
        'avatar_path',
        'api_token',
        'melli_code',
        'parent_id',
        'last_login',
        'last_logout',
        'province_id',
    ];
    protected $appends = [
        'isComplete',
        'avatar',
        'isAdmin',
        'isExecutor',
        'isEditor',
        'isIDPEditor',
        'isJustExecutor',
        'isJustIDPEditor',
        'isVerified',
        'unseenMessagesCount',
    ];
    protected $hidden = [
        'password',
        'remember_token',
        'api_token',
        'melli_code',
        'mobile',
    ];

    public function getRolesAttribute()
    {

    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function getIsAdminAttribute()
    {
        return $this->role === 'admin';
    }

    public function isExecutor()
    {
        if (in_array($this->role, ['admin', 'executor', 'editor'])) {
            return true;
        } else {
            return false;
        }
    }

    public function getIsExecutorAttribute()
    {
        if (in_array($this->role, ['admin', 'executor', 'editor'])) {
            return true;
        } else {
            return false;
        }
    }

    public function isEditor()
    {
        if (in_array($this->role, ['admin', 'editor'])) {
            return true;
        } else {
            return false;
        }
    }

    public function getIsEditorAttribute()
    {
        if (in_array($this->role, ['admin', 'editor'])) {
            return true;
        } else {
            return false;
        }
    }

    public function isIDPEditor()
    {
        if (in_array($this->role, ['admin', 'idp_editor'])) {
            return true;
        } else {
            return false;
        }
    }

    public function getIsIDPEditorAttribute()
    {
        if (in_array($this->role, ['admin', 'idp_editor'])) {
            return true;
        } else {
            return false;
        }
    }

    public function isJustExecutor()
    {
        if ($this->role == 'executor') {
            return true;
        } else {
            return false;
        }
    }

    public function getIsJustExecutorAttribute()
    {
        if ($this->role == 'executor') {
            return true;
        } else {
            return false;
        }
    }

    public function isJustEditor()
    {
        if ($this->role == 'editor') {
            return true;
        } else {
            return false;
        }
    }

    public function getIsJustEditorAttribute()
    {
        if ($this->role == 'editor') {
            return true;
        } else {
            return false;
        }
    }

    public function isJustIDPEditor()
    {
        if ($this->role == 'idp_editor') {
            return true;
        } else {
            return false;
        }
    }

    public function getIsJustIDPEditorAttribute()
    {
        if ($this->role == 'idp_editor') {
            return true;
        } else {
            return false;
        }
    }

    public function isVerified()
    {
        if (in_array($this->role, ['admin', 'editor', 'idp_editor', 'executor', 'verified'])) {
            return true;
        } else {
            return false;
        }
    }

    public function getIsVerifiedAttribute()
    {
        if (in_array($this->role, ['admin', 'editor', 'idp_editor', 'executor', 'verified'])) {
            return true;
        } else {
            return false;
        }
    }

    public function getUsersAttribute()
    {
        $users = User::query()
            ->where('id', '!=', $this->id);
        switch ($this->role) {
            case 'admin':
                break;
            case 'editor':
                $users = $users
                    ->whereIn('role', ['verified', 'user'])
                    ->where('province_id', '=', $this->province_id);
                break;
            default:
                $users = $users
                    ->where('parent_id', '=', $this->id);
                break;
        }
        return $users->get();
    }

    public function parent()
    {
        return $this->belongsTo(User::class, 'parent_id', 'id');
    }

    public function provinces()
    {
        return $this->morphedByMany(Province::class, 'userable');
    }

    public function province()
    {
        return $this->belongsTo(Province::class, 'province_id');
    }

    public function rooms()
    {
        return $this->belongsToMany(Room::class, 'room_user')
            ->orderByDesc('updated_at');
    }

    public function getLastLoginAttribute($value)
    {
        $v = new Verta($value);
        return $v->format('Y/n/d H:i:s');
    }

    public function getLastLogoutAttribute($value)
    {
        $v = new Verta($value);
        return $v->format('Y/n/d H:i:s');
    }

    public function getAvatarAttribute()
    {
        if (!empty($this->avatar_url)) {
            return $this->avatar_url;
        }
        if (!empty($this->avatar_path)) {
            return asset('storage/images/user/' . $this->avatar_path);
        }
        return asset('images/icons/user/avatar/man-1.svg');
    }

    public function getIsCompleteAttribute()
    {
        if (
            !empty($this->name) &&
            !empty($this->melli_code) &&
            !empty($this->province_id)
        ) {
            return true;
        } else {
            return false;
        }
    }

    public function getUnseenMessagesCountAttribute()
    {
        $count = 0;
        $rooms = Room::query()
            ->whereHas(
                'users',
                function ($q) {
                    return $q->where('id', $this->id);
                }
            )->get();
        foreach ($rooms as $room) {
            $unseenMessagesCount = Message::query()
                ->where('room_id', '=', $room->id)
                ->where('user_id', '!=', $this->id)
                ->where('seen', '=', 0)
                ->count();
            $count = $count + $unseenMessagesCount;
        }
        return $count;
    }

    public static function boot()
    {
        parent::boot();
        self::deleting(
            function ($user) {
                $user->rooms()->each(
                    function ($room) {
                        $room->delete();
                    }
                );
            }
        );
    }

}
