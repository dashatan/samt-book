<?php

namespace App\Http\Controllers;

use App\Collection;
use App\Comment;
use App\Events\MessageSent;
use App\Jobs\FirebaseCluadMessagingHttpRequest;
use App\Jobs\SendMessage;
use App\Mail\Contact;
use App\Message;
use App\Notifications\NewMessageNotification;
use App\Room;
use App\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class SingleController extends Controller
{
    public function getCollection(Request $request)
    {
        $collection = Collection::query()->find($request->id);
        $collection->page_view = $collection->page_view + 1;
        $collection->save();
        $slides = $collection->slides;
        $collection->phones;
        $collection->addresses;
        $collection->socialMedias;
        $collection->news;
        $collection->wantads;
        $collection->agents;
        $collection->boards;
        $collection->catalogs;
        $collection->metas;
        $collection['user'] = $collection->user;
        $collection['top20Subset'] = $collection->top20Subset;
        $collection['top20News'] = $collection->top20News;
        $collection['top20Wantads'] = $collection->top20Wantads;
        $response = compact('collection', 'slides');
        return response()->json($response, 200);
    }

    public function getSubset(Request $request)
    {
        $modelName = Collection::class;
        $collection = $modelName::query()->find($request->id);
        $relation = $request->relation;
        $subset = $collection->$relation;
        $response = compact('subset');
        return response()->json($response, 200);
    }

    public function sendEmail(Request $request)
    {
        $modelName = 'App\\' . $request->modelName;
        $model = $modelName::find($request->modelId);
        $user = User::find($model->user_id);
        $message = 'hello test brother';
        Mail::to($user)->send(new Contact($message));
    }

    public function getReceiverUser(Request $request)
    {
        $user = User::find($request->userId);
        return response()->json($user, 200);
    }

    public function getMessages(Request $request)
    {
//        return response()->json($request->all(), 200);
        if (isset($request->roomId)) {
            $room = Room::find($request->roomId);
        } else {
            $room = $this->findRoomViaUsers($request->userId, $request->opponentUserId);
        }
        $messages = Message::query()
            ->where('room_id', '=', $room->id)
            ->orderByDesc('created_at')
            ->paginate(100);
        $unseens = Message::query()
            ->where('room_id', '=', $room->id)
            ->where('seen', '=', 0)
            ->get();
        foreach ($unseens as $message) {
            if ($message->user_id !== $request->userId) {
                $message->seen = 1;
                $message->save();
            }
        }
        $response = compact('room', 'messages');
        return response()->json($response, 200);
    }

    public function sendMessage(Request $request)
    {
        $rules = [
            'message' => 'required',
            'userId' => 'required',
            'type' => 'required',
        ];
        Validator::make($request->all(), $rules)->validate();
        $user = User::find($request->userId);
        if (isset($request->roomId)) {
            $room = Room::find($request->roomId);
        } elseif (isset($request->userId) && isset($request->opponentUserId)) {
            $room = $this->findRoomViaUsers($request->userId, $request->opponentUserId);
        } else {
            return response()->json('room and user id not set', 422);
        }
        $opponentUser = User::find($request->opponentUserId);
        $url = url('profile/inbox/chat/' . $room->id);
        $message = new Message(
            [
                'type' => $request->type,
                'user_id' => $user->id,
                'room_id' => $room->id,
                'message' => $request->message,
                'seen' => 0,
            ]
        );
        $message->save();
        $room->touch();

        //chat realtime
        event(new MessageSent($room->id));

        //notification
        $opponentUser->notify(new NewMessageNotification($user, $message));

        //Mail
        SendMessage::dispatch($message, $user, $opponentUser, $url);

        $response = compact('message');
        return response()->json($response, 200);
    }

    public function findRoomViaUsers($userId, $opponentUserId)
    {
        if ($userId == $opponentUserId) {
            $room = Room::query()
                ->whereHas(
                    'users',
                    function ($q) use ($userId) {
                        $q->where('id', $userId);
                    }
                )
                ->has('users', '=', 1)
                ->first();

        } else {
            $room = Room::query()
                ->whereHas(
                    'users',
                    function ($q) use ($userId) {
                        $q->where('id', $userId);
                    }
                )
                ->whereHas(
                    'users',
                    function ($q) use ($opponentUserId) {
                        $q->where('id', $opponentUserId);
                    }
                )->first();
        }
        if (!$room) {
            $room = new Room();
            $room->save();
            $room->users()->attach([$userId, $opponentUserId]);
        }
        return $room;
    }

    public function sendMediaMessage(Request $request)
    {
        $rules = [
            'userId' => 'required',
            'roomId' => 'required',
        ];
        Validator::make($request->all(), $rules)->validate();
        $token = Str::random(20);
        $file = $request->file('file');
        $mimeType = $file->getMimeType();
        $mimeType = substr($mimeType, 0, strrpos($mimeType, '/'));
        $path = 'Message' . '_' . time() . '_' . $token . '.' . $file->getClientOriginalExtension();
        $message = new Message(
            [
                'type' => $mimeType,
                'user_id' => $request->userId,
                'room_id' => $request->roomId,
                'seen' => 0,
            ]
        );
        if ($mimeType === 'image') {
            Storage::putFileAs('public/images/messages', $file, $path);
            $message->image_path = $path;
        }
        if ($mimeType === 'video') {
            Storage::putFileAs('public/videos/messages', $file, $path);
            $message->video_path = $path;
        }
        $message->save();
        $room = Room::query()->find($request->roomId);
        $room->touch();
        $opponentUser = User::find($request->opponentUserId);
        $url = url('profile/inbox/chat/' . $room->id);
        event(new MessageSent($room->id));
        try {
            SendMessage::dispatch($message, $user, $opponentUser, $url);
        } catch (Exception $e) {
            Log::info($e);
        }
        $response = compact('message');
        return response()->json($response, 200);
    }

    public function getComments(Request $request)
    {
        $collection = Collection::query()->find($request->modelId);
        $comments = Comment::query()
            ->where('published', '=', 1)
            ->where('commentable_type', '=', Collection::class)
            ->where('commentable_id', '=', $collection->id)
            ->paginate(20);
        $response = compact('comments');
        return response()->json($response, 200);
    }

    public function storeNewComment(Request $request)
    {
        $rules = [
            'text' => 'required',
            'userToken' => 'required',
            'parentModelId' => 'required',
        ];
        Validator::make($request->all(), $rules)->validate();
        $user = User::query()->where('api_token', '=', $request->userToken)->firstOrFail();
        $comment = new Comment(
            [
                'text' => $request->text,
                'user_id' => $user->id,
                'commentable_type' => Collection::class,
                'commentable_id' => $request->parentModelId,
                'published' => 1,
            ]
        );
        $comment->save();
        $comment->user;
        $comment->replies;
        $response = compact('comment');
        return response()->json($response, 200);
    }

    public function deleteComment(Request $request)
    {

        $comment = Comment::query()->find($requestq->commentId);
        try {
            $comment->delete();
        } catch (Exception $e) {
            return response()->json($e, 422);
        }
        return response()->json('ok', 200);
    }
}
