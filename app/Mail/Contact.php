<?php

namespace App\Mail;

use App\Message;
use App\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class Contact extends Mailable
{
    use Queueable, SerializesModels;
    public $messageModel;
    public $userModel;
    public $url;

    /**
     * Create a new message instance.
     *
     * @param Message $message
     * @param User $user
     * @param $url
     */

    public function __construct(Message $message, User $user,$url)
    {
        $this->messageModel = $message;
        $this->userModel = $user;
        $this->url = $url;

    }

    /**
     * Build the message.
     *
     * @return Contact
     */
    public function build()
    {
        Log::info($this->messageModel->id . ' message is emailed');
        Log::info($this->userModel);
        return $this->view('vendor.mail.contact')
                    ->with([
                        'messageModel' => $this->messageModel,
                        'userModel' => $this->userModel,
                        'url' => $this->url
                    ])
                    ->subject(__('پیام جدید دریافت شد - صمت بوک'));
    }
}
