<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class UserIsVerified
{
    public function handle($request, Closure $next)
    {
        if (Auth::check())
            if (Auth::user()->isVerified()) {
                return $next($request);
            } else {
                return redirect()->route('ui.profile.edit')->with('message', 'ابتدا باید حساب کاربری خود را تکمیل کنید');
            }
        $request->session()->flash('message', 'برای دسترسی به این صفحه باید اطلاعات خود را تکمیل کنید و سپس این اطلاعات به تایید مدیریت برسد.');
        return redirect()->route('SIM');
    }
}
