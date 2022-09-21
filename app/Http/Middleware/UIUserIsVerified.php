<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class UIUserIsVerified
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (Auth::check() and Auth::user()->isVerified() or Auth::check() and Auth::user()->isAdmin()) {
            return $next($request);
        }
        return redirect()->route('ui.profile.edit')->with('message','ابتدا باید حساب کاربری خود را تکمیل کنید');
    }
}
