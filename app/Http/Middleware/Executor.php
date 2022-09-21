<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class Executor
{

    public function handle($request, Closure $next)
    {

        if (Auth::check() and Auth::user()->isExecutor()){
            return $next($request);
        }
        return redirect()->route('SIM');
    }
}
