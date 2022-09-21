<?php

namespace App\Http\Controllers;

use App\Like;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class LikeController extends Controller
{
    public function store(Request $request)
    {
        $user = User::query()->where('api_token','=',$request->userToken)->first();
        $like = new Like();
        $like->user_id = $user->id;
        $like->likeable_id = $request->id;
        $like->likeable_type = $request->type;
        $like->save();
        $isLiked = true;
        $response = compact('isLiked', 'like');
        return Response::json($response, 200);
    }

    public function destroy(Request $request)
    {
        $like = Like::query()->find($request->id);
        try {
            $like->delete();
        } catch (\Exception $e) {
        }
        $isLiked = false;
        $response = compact('isLiked');
        return Response::json($response, 200);
    }

    public function isLiked(Request $request)
    {
        $user = User::query()->where('api_token','=',$request->userToken)->first();
        if (!$user){
            return Response::json('userNotFound',422);
        }
        $like = Like::query()
            ->where('user_id', '=', $user->id)
            ->where('likeable_id', '=', $request->id)
            ->where('likeable_type', '=', $request->type)
            ->first();
        if ($like) {
            $isLiked = true;
        } else {
            $isLiked = false;
        }
        $response = compact('isLiked', 'like');
        return Response::json($response, 200);
    }
}
