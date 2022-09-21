<?php

namespace App\Http\Controllers;

use App\Collection;
use App\MyApp;
use App\Slide;
use App\User;
use Illuminate\Database\Eloquent\Collection as ArrayCollection;
use Illuminate\Http\Request;


class ApiController extends Controller
{
    public function colExist($model, $input_name)
    {
        return $colExist = $model
            ->getConnection()
            ->getSchemaBuilder()
            ->hasColumn($model->getTable(), $input_name);
    }

    public function single(Request $request)
    {
        //        return response()->json($request->all(),422);
        $block = Collection::query()->where('id', '=', $request->id)
            ->with('videos', 'images', 'province')->first();
        if (!$block) {
            return response()->json('model not found', 422);
        }
        $block->page_view = $block->page_view + 1;
        $block->save();
        $block['relations'] = $block->relations;
        return response()->json($block, 200);
    }

    public function getMyApp(Request $request)
    {
        $app = MyApp::query()->with('phones', 'addresses', 'socialMedias')->find(1);
        return response()->json($app, 200);
    }

    public function getChatContacts(Request $request)
    {
        if (!$request->userToken || empty($request->userToken)) {
            return response()->json('tokenIsNotDefined', 422);
        }
        $user = User::query()->where('api_token', '=', $request->userToken)->first();
        if (!$user) {
            return response()->json('userNotFound', 422);
        }
        $supportUser = User::query()
            ->where('role', '=', 'admin')
            ->where('email', '=', 'dashatanad@gmail.com')
            ->first();
        $managementUser = User::query()
            ->where('role', '=', 'admin')
            ->where('email', '=', 'samtbookonline@gmail.com')
            ->first();
        $editorUser = User::query()
            ->where('role', '=', 'editor')
            ->where('province_id', '=', $user->province_id)
            ->first();
        $contacts = [];
        if ($supportUser) {
            array_push(
                $contacts,
                [
                    'name' => 'support',
                    'label' => 'پشتیبانی',
                    'user' => $supportUser,
                ]
            );
        }
        if ($managementUser) {
            array_push(
                $contacts,
                [
                    'name' => 'management',
                    'label' => 'مدیریت',
                    'user' => $managementUser,
                ]
            );
        }
        if ($editorUser) {
            array_push(
                $contacts,
                [
                    'name' => 'editor',
                    'label' => 'نماینده',
                    'user' => $editorUser,
                ]
            );
        }
        return response()->json($contacts, 200);
    }

    public function getRelations(Request $request)
    {
        $parentModelName = 'App\\' . $request->parentModelName;
        $parentModelId = $request->parentModelId;
        $relationName = $request->relationName;
        $parentModel = $parentModelName::find($parentModelId);
        $relations = $parentModel->$relationName()->orderBy('sort')->get();
        $response = $relations;
        return response()->json($response, 200);
    }

    public function updateMyApp(Request $request)
    {
        $user = User::query()->where('api_token', '=', $request->userToken)->first();
        if ($user && $user->role === 'admin') {
            $app = MyApp::find(1);
            $app->dsc = $request->dsc;
            $app->save();
            return response()->json('ok', 200);
        }
        return response()->json('noAccess', 422);
    }

    public function setUserFcmToken(Request $request)
    {
        if (!$request->userToken || empty($request->userToken)) {
            return response()->json('tokenIsNotDefined', 422);
        }
        $user = User::query()->where('api_token', '=', $request->userToken)->first();
        $user->fcm_token = $request->fcmToken;
        $user->save();
        return response()->json($user, 200);
    }

}
