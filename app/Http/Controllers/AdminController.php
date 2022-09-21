<?php

namespace App\Http\Controllers;

use App\Collection;
use App\Message;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Jenssegers\Agent\Agent;

class AdminController extends Controller
{
    public function Home(Request $request)
    {
        return view('app');
    }

    public function oauth(Request $request)
    {
        return view('oauth');
    }

    public function getUserInfo(Request $request)
    {
        $code = $request->code;
        if (!$code || empty($code)) {
            return response()->json('code is invalid', 422);
        }
        $client = new Client(['verify' => false]);
        //get token
        $tokenUrl = 'https://api.ecsw.ir/service/v1/oauth/token';
        $tokenOptions = [
            'form_params' => [
                'grant_type' => 'authorization_code',
                'client_id' => '8a6d176e-0ac0-42c0-afc3-8f583b029f60',
                'client_secret' => 'h7taVo59WtSckVwkdhXD0Cc2soPdo8GS',
                'code' => $code,
                'redirect_uri' => 'https://samtbook.ir/login',
            ]
        ];
        $tokenResponse = $client->post($tokenUrl, $tokenOptions);
        $tokenContent = $tokenResponse->getBody()->getContents();
        $tokenData = collect(json_decode($tokenContent));
        $access_token = $tokenData->get('access_token');
        $optionsNeededAccessToken = [
            'headers' => [
                'Authorization' => 'Bearer ' . $access_token,
            ]
        ];
        //get name
        $identityUrl = 'https://api.ecsw.ir/service/v1/user/identity/general';
        $identityResponse = $client->get($identityUrl, $optionsNeededAccessToken);
        $identityData = json_decode($identityResponse->getBody()->getContents());
        //get mobile
        $mobileUrl = 'https://api.ecsw.ir/service/v1/user/primaryMobileNumber';
        $mobileResponse = $client->get($mobileUrl, $optionsNeededAccessToken);
        $mobileData = json_decode($mobileResponse->getBody()->getContents());
        //get email
//        $emailUrl = 'https://api.ecsw.ir/service/v1/user/primaryEmail';
//        $emailResponse = $client->get($emailUrl, $optionsNeededAccessToken);
//        $emailData = $emailResponse->getBody();
        $response = compact('identityData', 'mobileData');
        return response()->json($response, 200);
    }

    public function single(Request $request)
    {
        $model = Collection::query()->find($request->b);
        $shareUrl = url('/s/' . $request->a . '/' . $request->b);
        $thumbnail = $model->image;
        $response = compact('model', 'shareUrl', 'thumbnail');
        return view('single', $response);
    }

    public function import(Request $request)
    {
        return Message::all();
    }

    public static function arabicToPersian($string)
    {
        $characters = [
            'ك' => 'ک',
            'دِ' => 'د',
            'بِ' => 'ب',
            'زِ' => 'ز',
            'ذِ' => 'ذ',
            'شِ' => 'ش',
            'سِ' => 'س',
            'ى' => 'ی',
            'ي' => 'ی',
            '١' => '۱',
            '٢' => '۲',
            '٣' => '۳',
            '٤' => '۴',
            '٥' => '۵',
            '٦' => '۶',
            '٧' => '۷',
            '٨' => '۸',
            '٩' => '۹',
            '٠' => '۰',
        ];
        return str_replace(array_keys($characters), array_values($characters), $string);
    }

    public function colExist($model, $input_name)
    {
        return $colExist = $model->getConnection()->getSchemaBuilder()->hasColumn(
            $model->getTable(),
            $input_name
        );
    }

}

