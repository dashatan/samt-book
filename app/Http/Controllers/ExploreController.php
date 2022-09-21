<?php

namespace App\Http\Controllers;

use App\Collection;
use App\MyApp;
use App\Slide;
use Illuminate\Database\Eloquent\Collection as ArrayCollection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ExploreController extends Controller
{
    public function explore(Request $request)
    {
        $filterItems = $request->except('page', 'search_text');
        $collection = Collection::query()->orderBy('sort')->orderByDesc('id');
        $slides = Slide::query();
        if (isset($request->search_text) && !empty($request->search_text)) {
            $collection = $collection->where('title', 'like', "%$request->search_text%");
        }
        foreach ($filterItems as $key => $value) {
            if ($value !== null) {
                $collection = $collection->where($key, '=', $value);
                if ($this->colExist(new Slide(), $key)) {
                    $slides = $slides->where($key, '=', $value);
                }
            }
        }
        if (empty($request->class)) {
            $collection = $collection->whereNotIn('class', ['idp', 'ftz']);
        }
        $collection = $collection->whereNotIn('class', ['pdc', 'nws', 'wtd']);
        $blocks = $collection
            ->where('published', '=', 1)
            ->with('slides')
            ->paginate(20);
        $slides = $slides->orderBy('sort')->get();
        $slides = $slides->count() > 0 ? $slides : MyApp::query()->find(1)->slides()->orderBy('sort')->get();
        $withoutFilter = new ArrayCollection();
        foreach ($filterItems as $key => $value) {
            if (!empty($value)) {
                $withoutFilter->put($key, $value);
            }
        }
        if ($withoutFilter->count() === 0) {
            $slides = MyApp::query()->find(1)->slides;
        }
        $response = compact('blocks', 'slides');
        return response()->json($response, 200);
    }

    public function slides(Request $request)
    {
        $filterItems = $request->all();
        $slides = Slide::query()
            ->whereNull('slideable_id')
            ->whereNull('slideable_type');
        $withoutFilter = true;
        foreach ($filterItems as $key => $value) {
            if ($this->colExist(new Slide(), $key)) {
                $slides = $slides->where($key, '=', $value);
            }
            if (!empty($value)) {
                $withoutFilter = false;
            }
        }
        $slides = $slides->orderBy('sort')->get();
        if ($withoutFilter) {
            $slides = MyApp::query()->find(1)->slides()->orderBy('sort')->get();
        }
        $response = compact('slides');
        return response()->json($response, 200);
    }

    public function storeNewSlide(Request $request)
    {
//        return response()->json($request->all(),422);
        $rules = [
            'file' => 'required'
        ];
        Validator::make($request->all(), $rules)->validate();
        $filterItems = $request->except('file', 'video_file', 'link', 'mime_type');
        $slide = new Slide();
        $token = Str::random(60);
        if (isset($request->file)) {
            $file = $request->file('file');
            $mimeType = $file->getMimeType();
            $mimeType = substr($mimeType, 0, strrpos($mimeType, '/'));
            $path = 'Slide_' . time() . '_' . $token . '.' . $file->getClientOriginalExtension();
            if ($mimeType === 'image') {
                Storage::putFileAs('public/images', $file, $path);
                $slide->image_path = $path;
            }
            if ($mimeType === 'video') {
                Storage::putFileAs('public/videos', $file, $path);
                $slide->video_path = $path;
            }
        }
        $slide->link = $request->link;
        $slide->mime_type = $request->mime_type;
        $withoutFilter = true;
        foreach ($filterItems as $key => $value) {
            if ($this->colExist($slide, $key)) {
                if (!empty($value) && !in_array($value, [null, 'null', ''])) {
                    $withoutFilter = false;
                    $slide->$key = $value;
                }
            }
        }
        if ($withoutFilter) {
            $slide->slideable_type = MyApp::class;
            $slide->slideable_id = 1;
        }
//        return response()->json($withoutFilter, 422);
        $slide->save();
        $response = compact('slide');
        return response()->json($response, 200);
    }

    public function deleteSlide(Request $request)
    {
        $slide = Slide::find($request->id);
        try {
            if ($this->colExist($slide, 'image_path')) {
                Storage::delete('public/images/' . $slide->image_path);
            }
            if ($this->colExist($slide, 'video_path')) {
                Storage::delete('public/videos/' . $slide->video_path);
            }
            $slide->delete();
            return response()->json('relationDeleted', 200);
        } catch (\Exception $e) {
            return response()->json($e, 422);
        }
    }

    public function colExist($model, $input_name)
    {
        return $colExist = $model->getConnection()->getSchemaBuilder()->hasColumn($model->getTable(), $input_name);
    }
}
