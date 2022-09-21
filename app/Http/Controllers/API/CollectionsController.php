<?php

namespace App\Http\Controllers;

use App\Category;
use App\City;
use App\Collection;
use App\Country;
use App\Executor;
use App\MyApp;
use App\Province;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;

class CollectionsController extends Controller
{
    public function exbs(Request $request)
    {
        $exbs = Collection::published()->where('class', '=', 'exb')->get();
        return response()->json($exbs, 200);
    }

    public function countries()
    {
        $countries = Country::query()->get();
        return response()->json($countries, 200);
    }

    public function provinces(Request $request)
    {
        $user = User::find($request->user_id);
        if ($user and $user->isJustEditor()) {
            $provinces = $user->provinces;
        } else {
            $provinces = Province::query()->orderBy('title')->get();
        }
        return response()->json($provinces, 200);
    }

    public function cities(Request $request)
    {
        $cities = City::query();
        if (isset($request->province_id)) {
            $cities = $cities->where('province_id', '=', $request->province_id);
        }
        $cities = $cities->orderBy('title')->get();
        return response()->json($cities, 200);
    }

    public function idps(Request $request)
    {
        $idps = Collection::query()->where('class', '=', 'idp');
        if (isset($request->province_id) and !in_array($request->province_id, ['all', 0, '0'])) {
            $idps = $idps->where('province_id', '=', $request->province_id);
        }
        $idps = $idps->orderBy('title')->get();
        return response()->json($idps, 200);
    }

    public function ftzs(Request $request)
    {
        $ftzs = Collection::query()->where('class', '=', 'ftz')->orderBy('title')->get();
        return response()->json($ftzs, 200);
    }

    public function homeBlocks()
    {
        $blocks = [
            'industry' => [
                'label' => 'شهرک های صنعتی',
                'collection' => 'idp',
                'icon' => asset('images/icons/classes/yellow-shadow/Industry.svg'),
            ],
            'workshops' => [
                'label' => 'کارگاه ها',
                'collection' => 'prd',
                'collectionLabel' => 'واحدهای صنعتی-تولیدی',
                'type' => 'workshop',
                'typeLabel' => 'کارگاه ها',
                'icon' => asset('images/icons/classes/yellow-shadow/Workshop.svg'),
            ],
            'exhibitions' => [
                'label' => 'نمایشگاه ها',
                'collection' => 'exb',
                'icon' => asset('images/icons/classes/yellow-shadow/Exhibition.svg'),
            ],
            'wantads' => [
                'label' => 'نیازمندی ها',
                'collection' => 'wtd',
                'icon' => asset('images/icons/classes/yellow-shadow/Want-ad.svg'),
            ],
            'providers' => [
                'label' => 'تامین کنندگان',
                'collection' => 'prv',
                'icon' => asset('images/icons/classes/yellow-shadow/Provider.svg'),
            ],
            'ftz' => [
                'label' => 'مناطق آزاد تجاری - صنعتی',
                'collection' => 'ftz',
                'icon' => asset('images/icons/classes/yellow-shadow/FreeTradeZone.svg'),
            ],
            'associations' => [
                'label' => 'اتاق بازرگانی و تشکلها',
                'collection' => 'act',
                'icon' => asset('images/icons/classes/yellow-shadow/Association.svg'),
            ],
            'offices' => [
                'label' => 'واحدهای اداری',
                'collection' => 'ofc',
                'icon' => asset('images/icons/classes/yellow-shadow/Office.svg'),
            ],
        ];
        return Response::json($blocks, 200);
    }

    public function appSlides()
    {
        $appSlides = MyApp::query()->find(1)->slides()->orderBy('sort')->get();
        return Response::json($appSlides, 200);
    }

    public function categories()
    {
        $categories = Category::query()->where('parent_id', '=', 0)->with('children')->get();
        return Response::json($categories, 200);
    }

    public function types()
    {
        $types = DB::table('types')->get();
        return Response::json($types, 200);
    }

    public function classes()
    {
        $classes = DB::table('classes')->get();
        return Response::json($classes, 200);
    }
}
