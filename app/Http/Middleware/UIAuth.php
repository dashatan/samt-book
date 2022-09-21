<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class UIAuth
{
    public function handle($request, Closure $next)
    {
        if (Auth::check()) {
            return $next($request);
        }
        return redirect()->route('ui.login')->with('url.intended',url()->full());
    }
}
