<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class Editor
{
    public function handle($request, Closure $next)
    {
        if (Auth::check() and Auth::user()->isEditor()){
            return $next($request);
        }
        return redirect()->route('SIM');

    }
}
