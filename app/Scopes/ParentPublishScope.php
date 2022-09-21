<?php
namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class ParentPublishScope implements Scope{
    public function apply(Builder $builder, Model $model)
    {
        $builder->whereHasMorph('parent','*',function ($q){
            $q->where('published','=',1);
        });
    }
}
