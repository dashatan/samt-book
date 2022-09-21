<?php

use Illuminate\Support\Facades\Broadcast;
use App\Room;
use \Illuminate\Support\Facades\Log;

Broadcast::channel('chat.{roomId}', function ($user, $roomId) {
    $room = Room::query()->find($roomId);
    $roomUsers = collect($room->users)->pluck('id')->toArray();
    return in_array($user->id, $roomUsers);
});

Broadcast::channel('newMessageForUser.{userId}', function ($user, $userId) {
    return intval($user->id) === intval($userId);
});
