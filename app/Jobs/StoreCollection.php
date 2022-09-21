<?php

namespace App\Jobs;

use App\Collection;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Response;

class StoreCollection implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    protected $collection;

    public function __construct(Collection $collection)
    {
        $this->collection = $collection;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $existing = Collection::query()->where('title','=',$this->collection->title)->first();
        if (!$existing) {
            $newCollection = new Collection([
                'type'=>$this->collection->type,
                'user_id'=>$this->collection->user_id,
                'country_id'=>$this->collection->country_id,
                'province_id'=>$this->collection->province_id,
                'city_id'=>$this->collection->city_id,
                'category_id'=>$this->collection->category_id,
                'title'=>$this->collection->title,
                'dsc'=>$this->collection->dsc,
            ]);
            $newCollection->save();
        }
    }
}
