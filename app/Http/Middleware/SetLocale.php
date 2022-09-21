<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Session;

class SetLocale
{
    public function handle($request, Closure $next)
    {
        if (Auth::check()) {
            App::setLocale(Auth::user()->lang);
        } elseif (Session::has('lang')) {
            App::setLocale(Session::get('lang'));
        } else {
            App::setLocale('fa');
        }
        return $next($request);
    }
}
