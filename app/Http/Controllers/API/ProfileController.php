<?php

namespace App\Http\Controllers;

use App\Collection;
use App\Jobs\SendBulkMessagesJob;
use App\Mail\NewUserRegistered;
use App\Message;
use App\Room;
use App\User;
use Carbon\Carbon;
use Exception;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ProfileController extends Controller
{
    public function colExist($model, $input_name)
    {
        return $colExist = $model->getConnection()->getSchemaBuilder()
            ->hasColumn($model->getTable(), $input_name);
    }

    public function sendPhoneNumber(Request $request)
    {
        $rules = [
            'phoneNumber' => 'required|min:11|max:11',
        ];
        $messages = [
            'phoneNumber.required' => 'لطفا شماره موبایل خود را وارد کنید',
            'phoneNumber.min' => 'شماره موبایل صحیح نسیت',
            'phoneNumber.max' => 'شماره موبایل صحیح نسیت',
            'phoneNumber.numeric' => 'شماره موبایل صحیح نسیت',
        ];
        Validator::make($request->all(), $rules, $messages)->validate();
        $user = User::query()->where('mobile', '=', $request->phoneNumber)->first();
        if (!$user) {
            $response = [
                'errors' => [
                    'phoneNumber' => [
                        0 => "این شماره موبایل در سیستم ثبت نشده است، برای ثبت نام دکمه احراز هویت سامانه امتا را بزنید"
                    ]
                ]
            ];
            return response()->json($response, 422);
        }
        $userIsComplete = $user->isComplete;
        $userHasPassword = !empty($user->password);
        $response = compact('userIsComplete', 'userHasPassword');
        return response()->json($response, 200);
    }

    public function register(Request $request)
    {
        $rules = [
            'mobile' => 'required|min:11|max:11',
            'name' => 'required',
        ];
        $messages = [
            'name.required' => 'لطفا نام را وارد کنید',
            'mobile.required' => 'لطفا شماره موبایل را وارد کنید',
            'mobile.min' => 'شماره موبایل صحیح نسیت',
            'mobile.max' => 'شماره موبایل صحیح نسیت',
            'mobile.numeric' => 'شماره موبایل صحیح نسیت',
        ];
        Validator::make($request->all(), $rules, $messages)->validate();
        $user = User::query()->where('mobile', '=', $request->mobile)->first();
        if (!$user) {
            $token = Str::random(60);
            $user = new User();
            $user->api_token = $token;
            foreach ($request->all() as $key => $value) {
                if ($this->colExist($user, $key)) {
                    $user->$key = $value;
                }
            }
            $user->save();
            $user = User::find($user->id);
        }
        $mobile = $user->mobile;
        $name = $user->name;
        $userHasPassword = !empty($user->password);
        $userIsComplete = $user->isComplete;
        $response = compact('mobile', 'userHasPassword', 'userIsComplete', 'name');
        return response()->json($response, 200);
    }

    public function sendPassword(Request $request)
    {
        $rules = [
            'phoneNumber' => 'required|min:11|max:11',
        ];
        $messages = [
            'mobile.required' => 'لطفا شماره موبایل را وارد کنید',
            'mobile.min' => 'شماره موبایل صحیح نسیت',
            'mobile.max' => 'شماره موبایل صحیح نسیت',
        ];
        Validator::make($request->all(), $rules, $messages)->validate();
        $user = User::query()->where('mobile', '=', $request->phoneNumber)->first();
        $rand = mt_rand(10000000, 99999999);
        if (!$user) {
            return response()->json('userNotfound', 422);
        }
        $user->password = Hash::make($rand);
        $user->save();
        $api = '3771445777506E337873356B32492F4E3838425152413D3D';
        $receptor = $request->phoneNumber;
//        $receptor = '09147811275';
        $message = __('رمز عبور سامانه صمت بوک برای شما') . ' : ' . $rand;
        $url = 'https://api.kavenegar.com/v1/' . $api . '/sms/send.json?receptor=' . $receptor . '&message=' . $message;
        $client = new Client(['verify' => false]);
        $client->get($url);
        return response()->json('passwordSent', 200);
    }

    public function verifyPassword(Request $request)
    {
        $rules = [
            'phoneNumber' => 'required|min:11|max:11',
            'password' => 'required',
        ];
        $messages = [
            'mobile.required' => 'لطفا شماره موبایل را وارد کنید',
            'mobile.min' => 'شماره موبایل صحیح نسیت',
            'mobile.max' => 'شماره موبایل صحیح نسیت',
        ];
        Validator::make($request->all(), $rules, $messages)->validate();
        $user = User::query()->where('mobile', '=', $request->phoneNumber)->first();
        if (!$user) {
            return response()->json('userNotfound', 422);
        }
        $passwordIsCorrect = Hash::check($request->password, $user->password);
        if (!$passwordIsCorrect) {
            return response()->json('passwordIsIncorrect', 422);
        }
        $token = $user->api_token;
        $response = compact('passwordIsCorrect', 'token', 'user');

        return response()->json($response, 200);
    }

    public function setIdentifications(Request $request)
    {
        $rules = [
            'userToken' => 'required',
            'email' => 'required|email|unique:users',
            'province_id' => 'required',
        ];
        $messages = [
            'userToken.required' => 'لطفا کد کاربر را ارسال کنید',
            'name.required' => 'لطفا نام خود را وارد کنید',
            'province_id.required' => 'لطفا استان محل زندگی خود را وارد کنید',
            'email.required' => 'لطفا ایمیل خود را وارد کنید',
            'email.email' => 'ایمیل وارد شده صحیح نیست',
            'email.unique' => 'این ایمیل قبلا ثبت شده است',
            'melli_code.required' => 'لطفا کد ملی خود را وارد کنید',
            'melli_code.min' => 'کد ملی صحیح نیست',
            'melli_code.max' => 'کد ملی صحیح نیست',
            'melli_code.unique' => 'این کد ملی قبلا ثبت شده است',
        ];
        Validator::make($request->all(), $rules, $messages)->validate();
        if (!$request->userToken || empty($request->userToken)) {
            return response()->json('tokenIsNotDefined', 422);
        }
        $user = User::query()->where('api_token', '=', $request->userToken)->first();
        if (!$user) {
            return response()->json('userNotfound', 422);
        }
        foreach ($request->except('userToken') as $key => $value) {
            if ($this->colExist($user, $key)) {
                $user->$key = $value;
            }
        }
        $user->last_login = Carbon::now();
        $user->save();
        Auth::login($user, true);
        $admins = User::query()
            ->where('role', '=', 'admin')
            ->whereNotNull('email')
            ->get();
        $editors = User::query()
            ->whereNotNull('email')
            ->where('role', '=', 'editor')
            ->where('province_id', '=', $request->province_id)
            ->get();
        $users = $admins->concat($editors);
        try {
            Mail::to($users)->send(new NewUserRegistered($user));
        } catch (Exception $e) {
            Log::info($e);
        }
        $response = compact('user');
        return response()->json($response, 200);
    }

    public function getUser(Request $request)
    {
        if (!$request->userToken || empty($request->userToken)) {
            return response()->json('tokenIsNotDefined', 422);
        }
        $user = User::query()->where('api_token', '=', $request->userToken)->first();
        if (!$user) {
            return response()->json('userNotFound', 422);
        }
        return response()->json($user, 200);
    }

    public function editProfile(Request $request)
    {
        if (!$request->userToken || empty($request->userToken)) {
            return response()->json('tokenIsNotDefined', 422);
        }
        $user = User::query()->where('api_token', '=', $request->userToken)->first();
        $data = $request->except('file', 'userToken');
        foreach ($data as $key => $value) {
            if ($this->colExist($user, $key)) {
                $user->$key = $value;
            }
        }
        if (isset($request->file)) {
            $file = $request->file('file');
            $path = 'Avatar_' . time(
                ) . '_' . $user->api_token . '.' . $file->getClientOriginalExtension();
            Storage::delete('public/images/user/' . $user->avatar_path);
            Storage::putFileAs('public/images/user', $file, $path);
            $user->avatar_path = $path;
        }
        $user->touch();
        $user->save();
        $response = compact('user');
        return response()->json($response, 200);
    }

    public function logout(Request $request)
    {
        if (!$request->userToken || empty($request->userToken)) {
            return response()->json('tokenIsNotDefined', 422);
        }
        $user = User::query()->where('api_token', '=', $request->userToken)->first();
        $user->last_logout = Carbon::now();
        $user->save();
        Auth::logout();
        return response()->json('ok', 200);
    }

    public function collectionsOfCurrentUser(Request $request)
    {
        if (!$request->userToken || empty($request->userToken)) {
            return response()->json('tokenIsNotDefined', 422);
        }
        $user = User::query()->where('api_token', '=', $request->userToken)->first();
        if (!$user) {
            return response()->json('userNotFound', 422);
        }
        $collections = Collection::query();
        switch ($user->role) {
            case 'admin':
                break;
            case 'idp_editor':
                $collections = $collections
                    ->where('province_id', '=', $user->province_id)
                    ->where('class', '=', 'idp')
                    ->orWhere('user_id', '=', $user->id);
                break;
            case 'ftz_editor':
                $collections = $collections
                    ->where('province_id', '=', $user->province_id)
                    ->where('class', '=', 'ftz')
                    ->orWhere('user_id', '=', $user->id);
                break;
            case 'editor':
                $collections = $collections
                    ->where('province_id', '=', $user->province_id)
                    ->whereIn('class', ['prd', 'prv', 'act', 'ofc', 'gld'])
                    ->orWhere('user_id', '=', $user->id);
                break;
            default:
                $collections = $collections
                    ->Where('user_id', '=', $user->id);
                break;
        }

        if (isset($request->searchText)) {
            $collections = $collections->where('title', 'like', "%$request->searchText%");
        }
        $collections = $collections
            ->whereNotIn('class', ['pdc', 'nws', 'srv', 'agt'])
            ->orderBy('sort')
            ->orderByDesc('id');
        $collections = $collections->paginate(20);
        return response()->json($collections, 200);
    }

    public function storeCollection(Request $request)
    {
        if (!$request->userToken || empty($request->userToken)) {
            return response()->json('tokenIsNotDefined', 422);
        }
        $rules = [
            'class' => 'required',
            'title' => 'required',
            'dsc' => 'required',
            'userToken' => 'required',
        ];
        $messages = [];
        Validator::make($request->all(), $rules, $messages)->validate();
        $token = Str::random(60);
        $collection = new Collection(
            [
                'class' => $request->class,
                'type' => $request->type,
                'country_id' => $request->countryId,
                'province_id' => $request->provinceId,
                'city_id' => $request->cityId,
                'category_id' => $request->categoryId,
                'is_in_idp' => $request->isInIdp,
                'idp_id' => $request->idpId,
                'is_in_ftz' => $request->isInFtz,
                'ftz_id' => $request->ftzId,
                'exb_id' => $request->exbId,
                'executor_id' => $request->executorId,
                'title' => $request->title,
                'dsc' => $request->dsc,
                'token' => $token,
                'collectionable_type' => $request->collectionableType,
                'collectionable_id' => $request->collectionableId,
            ]
        );

        $user = User::query()->where('api_token', '=', $request->userToken)->first();
        if (!$user) {
            return response()->json('userNotFound', 422);
        }

        $collection->user_id = isset($request->user_id) ? $request->user_id : $user->id;
        $collection->created_by = $user->id;

        $collection->save();

        $response = compact('token');
        return response()->json($response, 200);
    }

    public function storeCollectionImage(Request $request)
    {
        $rules = [
            'token' => 'required',
            'image' => 'required',
        ];
        $messages = [];
        Validator::make($request->all(), $rules, $messages)->validate();

        $collection = Collection::query()->where('token', '=', $request->token)->first();
        if (!empty($collection->image_path)) {
            Storage::delete('public/images/' . $collection->image_path);
        }
        $file = $request->file('image');
        $imagePath = $collection->class . '_' . time(
            ) . '_' . $request->token . '.' . $file->getClientOriginalExtension();
        Storage::putFileAs('public/images', $file, $imagePath);
        $collection->image_path = $imagePath;

        $collection->save();

        $response = compact('collection');
        return response()->json($response, 200);
    }

    public function deleteCollection(Request $request)
    {
        $collection = Collection::query()->find($request->id);
        try {
            Storage::delete('public/images/' . $collection->image_path);
            $collection->delete();
            return response()->json('collectionDeleted', 200);
        } catch (Exception $e) {
            return response()->json($e, 422);
        }
    }

    public function publish(Request $request)
    {
        $collection = Collection::query()->find($request->id);
        if ($collection->published === 1) {
            $published = 0;
        } else {
            $published = 1;
        }
        $collection->published = $published;
        $collection->save();
        return response()->json(compact('published'), 200);
    }

    public function updateCollection(Request $request)
    {
        $collection = Collection::query()->find($request->id);
        foreach ($request->all() as $key => $value) {
            if ($this->colExist($collection, $key)) {
                $collection->$key = $value;
            }
        }
        $collection->touch();
        $collection->save();
        $token = $collection->token;
        $response = compact('token', 'collection');
        return response()->json($response, 200);
    }

    public function updateCollectionImage(Request $request)
    {
        $file = $request->file('image');
        $imagePath = $request->imagePath;
        Storage::putFileAs('public/images', $file, $imagePath);
        $response = 'collectionImageUpdated';
        return response()->json($response, 200);
    }

    public function getRelationItems(Request $request)
    {
        $collection = Collection::query()->find($request->id);
        $relation = $request->relation;
        $relationItems = $collection->$relation;
        return response()->json($relationItems, 200);
    }

    public function getCollection(Request $request)
    {
        $collection = Collection::find($request->id);
        return response()->json($collection, 200);
    }

    public function storeRelation(Request $request)
    {
        $parentModelName = 'App\\' . $request->parentModelName;
        $parentModel = $parentModelName::find($request->parentId);
        $collectionRelations = [
            'products',
            'participants',
            'news',
            'wantads',
            'services',
            'agents',
        ];

        if (in_array($request->relation, $collectionRelations)) {
            $relationModelName = Collection::class;
            $relation = 'collections';
        } else {
            $relationModelName = 'App\\' . $request->relationModelName;
            $relation = $request->relation;
        }
        $relationModel = new $relationModelName();
        if ($this->colExist($relationModel, 'user_id')) {
            $user = User::query()->where('api_token', '=', $request->userToken)->first();
            $relationModel->user_id = $user->id;
        }
        $data = $request->except(
            'file',
            'image',
            'video',
            'parentModelName',
            'parentId',
            'relationModelName',
            'relation'
        );
        foreach ($data as $key => $value) {
            if ($this->colExist($relationModel, $key)) {
                $relationModel->$key = $value;
            }
        }
//        return response()->json($relationModel,422);
        $token = Str::random(60);
        if (isset($request->file)) {
            $file = $request->file('file');
            $str = $file->getMimeType();
            $mimeType = substr($str, 0, strrpos($str, '/'));
            $path = $request->relationModelName . '_' . time(
                ) . '_' . $token . '.' . $file->getClientOriginalExtension();
            if ($mimeType === 'image') {
                Storage::putFileAs('public/images', $file, $path);
                $relationModel->image_path = $path;
            }
            if ($mimeType === 'video') {
                Storage::putFileAs('public/videos', $file, $path);
                $relationModel->video_path = $path;
            }
        }
        if ($this->colExist($relationModel, 'class') && !in_array($request->relation, ['slides'])) {
            $relationModel->class = $this->summarize($request->relation);
        }
        $parentModel->$relation()->save($relationModel);
        $response = 'ok';
        return response()->json($response, 200);
    }

    public function updateRelation(Request $request)
    {
        if (in_array(
            $request->relationModelName,
            ['Product',
                'Participant',
                'News',
                'Wantad',
                'Service']
        )) {
            $relationModelName = Collection::class;
        } else {
            $relationModelName = 'App\\' . $request->relationModelName;
        }

        $relationModel = $relationModelName::find($request->relationModelId);
        $data = $request->except('file', 'image', 'video', 'relationModelId', 'relationModelName');
        foreach ($data as $key => $value) {
            if ($this->colExist($relationModel, $key)) {
                $relationModel->$key = $value;
            }
        }
        $token = Str::random(60);
        if (isset($request->file) && !empty($request->file)) {
            $file = $request->file('file');
            $str = $file->getMimeType();
            $mimeType = substr($str, 0, strrpos($str, '/'));
            $path = $request->relationModelName . '_' . time(
                ) . '_' . $token . '.' . $file->getClientOriginalExtension();
            if ($mimeType === 'image') {
                Storage::delete('public/images/' . $relationModel->image_path);
                Storage::putFileAs('public/images', $file, $path);
                $relationModel->image_path = $path;
            }
            if ($mimeType === 'video') {
                Storage::delete('public/videos/' . $relationModel->video_path);
                Storage::putFileAs('public/videos', $file, $path);
                $relationModel->video_path = $path;
            }
        }
        $relationModel->save();
        $response = 'ok';
        return response()->json($response, 200);
    }

    public function summarize($val)
    {
        $summarizes = [
            'products' => 'pdc',
            'services' => 'srv',
            'wantads' => 'wtd',
            'news' => 'nws',
            'participants' => 'prt',
            'agents' => 'agt',
        ];
        return $summarizes[$val];
    }

    public function deleteRelation(Request $request)
    {
        if (in_array(
            $request->modelName,
            ['Product',
                'Participant',
                'News',
                'Wantad',
                'Service']
        )) {
            $relationModelName = Collection::class;
        } else {
            $relationModelName = 'App\\' . $request->modelName;
        }
        $model = $relationModelName::find($request->id);
        try {
            if ($this->colExist($model, 'image_path')) {
                Storage::delete('public/images/' . $model->image_path);
            }
            if ($this->colExist($model, 'video_path')) {
                Storage::delete('public/videos/' . $model->video_path);
            }
            $model->delete();
            return response()->json('relationDeleted', 200);
        } catch (Exception $e) {
            return response()->json($e, 422);
        }

    }

    public function getUsers(Request $request)
    {
        if (!$request->userToken || empty($request->userToken)) {
            return response()->json('tokenIsNotDefined', 422);
        }
        $user = User::query()->where('api_token', '=', $request->userToken)->first();
        $users = $user->users;
        return response()->json($users, 200);
    }

    public function editUser(Request $request)
    {
        if (!$request->editorToken || empty($request->editorToken)) {
            return response()->json('editorTokenIsNotDefined', 422);
        }
        $editor = User::query()->where('api_token', '=', $request->editorToken)->first();
        $user = User::query()->find($request->userId);
        if (!$user) {
            return response()->json('userNotFound', 422);
        }
        $data = $request->except('file', 'userId', 'password', 'editorToken');
        foreach ($data as $key => $value) {
            if ($this->colExist($user, $key)) {
                $user->$key = $value;
            }
        }
        if (!empty($request->password)) {
            if (strlen($request->password) >= 8) {
                $user->password = Hash::make($request->password);
            }
        }
        if (isset($request->file)) {
//            return response()->json($request->all(),422);
            $file = $request->file('file');
            $path = 'Avatar_' . time(
                ) . '_' . $user->api_token . '.' . $file->getClientOriginalExtension();
            Storage::delete('public/images/user/' . $user->avatar_path);
            Storage::putFileAs('public/images/user', $file, $path);
            $user->avatar_path = $path;
            $user->avatar_url = null;
        }
        $user->parent_id = $editor->id;
        if ($editor->role !== 'admin') {
            $user->province_id = $editor->province_id;
        }
        $user->touch();
        $user->save();
        $response = compact('user');
        return response()->json($response, 200);
    }

    public function getEditingUser(Request $request)
    {
        $editor = User::find($request->editorId);
        if (!in_array($editor->role, ['admin', 'editor'])) {
            return response()->json('you are not allowed here !', 403);
        }
        $user = User::query()->find($request->userId)->makeVisible(['melli_code', 'mobile']);
        if (!$user) {
            return response()->json('userNotFound', 422);
        }
        return response()->json($user, 200);
    }

    public function storeNewUser(Request $request)
    {
        $rules = [
            'mobile' => 'required',
            'name' => 'required',
            'melli_code' => 'required|min:10|max:10|unique:users',
            'email' => 'required|email|unique:users',
            'province_id' => 'required',
            'lang' => 'required',
            'role' => 'required',
        ];
        $messages = [
            'userToken.required' => 'لطفا کد کاربر را ارسال کنید',
            'name.required' => 'لطفا نام خود را وارد کنید',
            'province_id.required' => 'لطفا استان محل زندگی خود را وارد کنید',
            'email.required' => 'لطفا ایمیل خود را وارد کنید',
            'email.email' => 'ایمیل وارد شده صحیح نیست',
            'email.unique' => 'این ایمیل قبلا ثبت شده است',
            'melli_code.required' => 'لطفا کد ملی خود را وارد کنید',
            'melli_code.min' => 'کد ملی صحیح نیست',
            'melli_code.max' => 'کد ملی صحیح نیست',
            'melli_code.unique' => 'این کد ملی قبلا ثبت شده است',
        ];
        Validator::make($request->all(), $rules, $messages)->validate();
        if (!$request->editorToken || empty($request->editorToken)) {
            return response()->json('editorTokenIsNotDefined', 422);
        }
        $editor = User::query()->where('api_token', '=', $request->editorToken)->first();
        $user = new User();
        $user->api_token = Str::random(120);
        $data = $request->except('file', 'userToken', 'password', 'editorToken');
        foreach ($data as $key => $value) {
            if ($this->colExist($user, $key)) {
                $user->$key = $value;
            }
        }
        if (!empty($request->password) && strlen($request->password) > 8) {
            $user->password = Hash::make($request->password);
        } else {
            $rand = mt_rand(10000000, 99999999);
            $user->password = Hash::make($rand);
        }
        if (isset($request->file)) {
//            return response()->json($request->all(),422);
            $file = $request->file('file');
            $path = 'Avatar_' . time(
                ) . '_' . $user->api_token . '.' . $file->getClientOriginalExtension();
            Storage::delete('public/images/user/' . $user->avatar_path);
            Storage::putFileAs('public/images/user', $file, $path);
            $user->avatar_path = $path;
            $user->avatar_url = null;
        }
        $user->parent_id = $editor->id;
        if ($editor->role !== 'admin') {
            $user->province_id = $editor->province_id;
        }
        $user->touch();
        $user->save();
        $response = compact('user');
        return response()->json($response, 200);
    }

    public function deleteUser(Request $request)
    {
        $user = User::find($request->userId);
        if (!$user) {
            return response()->json('userNotFound', 422);
        }
        if (!empty($user->avatar_path)) {
            Storage::delete('public/images/user/' . $user->avatar_path);
        }
        try {
            $user->delete();
        } catch (Exception $e) {
        }
        return response()->json('userDeleted', 200);
    }

    public function modify(Request $request)
    {
        $modelName = 'App\\' . $request->modelName;
        $model = $modelName::find($request->modelId);
        $itemName = $request->itemName;
        $model->$itemName = $request->itemValue;
        $model->save();
        return response()->json($model, 200);
    }

    public function getRooms(Request $request)
    {
        if (!$request->userToken || empty($request->userToken)) {
            return response()->json('tokenIsNotDefined', 422);
        }
        $user = User::query()->where('api_token', '=', $request->userToken)->first();
        $rooms = Room::query()
            ->whereHas(
                'users',
                function ($q) use ($user) {
                    $q->where('id', $user->id);
                }
            )
            ->has('messages', '>', 1)
            ->orderByDesc('updated_at')
            ->get();
        return response()->json($rooms, 200);
    }

    public function sendBulkMessage(Request $request)
    {
        $inputs = collect(json_decode($request->inputs));
        $user = User::query()->where('api_token', $request->userToken)->firstOrFail();
        $s = new SingleController();
        $room = $s->findRoomViaUsers($user->id, $user->id);
        $targetCollections = Collection::query()
            ->whereIn('class', ['idp', 'ftz', 'prd', 'gld', 'ofc', 'act', 'exb', 'prv'])
            ->whereHas('user');
        foreach ($inputs as $key => $value) {
            if ($this->colExist(new Collection(), $key) && !empty($value)) {
                $targetCollections = $targetCollections->where($key, '=', $value);
            }
        }
        $targetUsersIds = $targetCollections->pluck('user_id')->toArray();
        $message = new Message(
            [
                'user_id' => $user->id,
                'room_id' => $room->id,
                'type' => $inputs->get('message_type'),
                'seen' => 0,
            ]
        );
        if ($inputs->get('message')) {
            $message->message = $inputs->get('message');
        }
        if (isset($request->file)) {
            $token = Str::random(20);
            $file = $request->file('file');
            $mimeType = $file->getMimeType();
            $mimeType = substr($mimeType, 0, strrpos($mimeType, '/'));
            $path = 'Message' . '_' . time(
                ) . '_' . $token . '.' . $file->getClientOriginalExtension();
            if ($mimeType === 'image') {
                Storage::putFileAs('public/images/messages', $file, $path);
                $message->image_path = $path;
            }
            if ($mimeType === 'video') {
                Storage::putFileAs('public/videos/messages', $file, $path);
                $message->video_path = $path;
            }
            $message->type = $mimeType;
        }
        $message->save();
        $room->touch();

        SendBulkMessagesJob::dispatch($message, $user, $targetUsersIds);

        $response = compact('targetCollections', 'inputs');
        return response()->json($response, 200);
    }

    function from_camel_case($input)
    {
        preg_match_all('!([A-Z][A-Z0-9]*(?=$|[A-Z][a-z0-9])|[A-Za-z][a-z0-9]+)!', $input, $matches);
        $ret = $matches[0];
        foreach ($ret as &$match) {
            $match = $match == strtoupper($match) ? strtolower($match) : lcfirst($match);
        }
        return implode('_', $ret);
    }

}
