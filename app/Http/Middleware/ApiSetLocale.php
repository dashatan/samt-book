<?php

namespace App\Http\Middleware;

use Closure;

class ApiSetLocale
{
    public function handle($request, Closure $next)
    {
//        return $request->header('lang');
        return $next($request);
    }
}
