<?php

namespace App\Jobs;

use App\Mail\Contact;
use App\Message;
use App\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendMessage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    protected $myMessage;
    protected $opponentUser;
    protected $user;
    protected $url;

    /**
     * Create a new job instance.
     *
     * @param Message $message
     * @param User $user
     * @param User $opponentUser
     * @param $url
     */
    public function __construct(Message $message, User $user, User $opponentUser, $url)
    {
        $this->myMessage = $message;
        $this->user = $user;
        $this->opponentUser = $opponentUser;
        $this->url = $url;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
            Mail::to($this->opponentUser)
                ->send(new Contact($this->myMessage, $this->user, $this->url));
        } catch (\Exception $e) {
            Log::info($e);
        }
    }
}
