<?php

namespace App\Http\Controllers;

use App\Collection;
use App\MyApp;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class NewsController extends Controller
{
    public function colExist($model, $input_name)
    {
        return $colExist = $model->getConnection()->getSchemaBuilder()->hasColumn($model->getTable(), $input_name);
    }

    public function news(Request $request)
    {
        $user = User::query()->where('api_token', '=', $request->userToken)->first();
        $news = Collection::query()->where('class', '=', 'nws');
        if (!$user || $user && $user->role !== 'admin') {
            $news = $news->where('published', '=', 1);
        }
        $news = $news->where('collectionable_type', '=', MyApp::class)
            ->where('collectionable_id', '=', 1)
            ->orderBy('sort')
            ->orderByDesc('id')
            ->paginate(20);
        return response()->json(compact('news'), 200);
    }

    public function store(Request $request)
    {
        $rules = [
            'title' => 'required',
            'dsc' => 'required',
            'file' => 'required',
        ];
        $messages = [];
        Validator::make($request->all(), $rules, $messages)->validate();
        $creator = User::query()->where('api_token', '=', $request->userToken)->first();
        $news = new Collection(['class' => 'nws']);
        $news->token = Str::random(60);
        $data = $request->except('file', 'userToken');
        foreach ($data as $key => $value) {
            if ($this->colExist($news, $key)) {
                $news->$key = $value;
            }
        }

        if (isset($request->file)) {
            $file = $request->file('file');
            $path = 'News_' . time() . '_' . $news->token . '.' . $file->getClientOriginalExtension();
            Storage::putFileAs('public/images', $file, $path);
            $news->image_path = $path;
        }
        $news->created_by = $creator->id;
        $news->collectionable_type = MyApp::class;
        $news->collectionable_id = 1;
        $news->save();
        $response = compact('news');
        return response()->json($response, 200);
    }
}
