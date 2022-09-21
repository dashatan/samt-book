<?php

namespace App\Jobs;

use App\Message;
use App\User;
use GuzzleHttp\Client;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class FirebaseCloudMessagingHttpRequest implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $messageModel;
    protected $userModel;
    protected $opponentUserModel;

    /**
     * Create a new job instance.
     *
     * @param Message $message
     * @param User $user
     * @param User $opponentUser
     */
    public function __construct(Message $message,User $user,User $opponentUser)
    {
        Log::info('FCMSend constructed');
        $this->messageModel = $message;
        $this->userModel= $user;
        $this->opponentUserModel = $opponentUser;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        Log::info('FCMSend handled');
        $serverKey = env('FCM_SERVER_KEY');
        $url = 'https://fcm.googleapis.com/v1/projects/myproject-b5ae1/messages:send';
        $client = new Client(['verify' => false]);
        $client->post($url,[
            'headers'=>[
                'Content-Type'=>'application/json',
                'Authorization'=> $serverKey
            ],
            'form_params'=>[
                'token'=>$this->opponentUserModel->fcm_token,
                'notification'=>[
                    'title'=>'new message',
                    'body'=>'new message test'
                ],
                'webpush'=>[
                    'headers'=>[
                        'urgency'=>'high'
                    ],
                    'notification'=>[
                        'requireInteraction'=>'true',
                        'body'=>'new message test'
                    ],
                ],
            ]
        ]);
        Log::info('FCMSend finished');
    }
}
