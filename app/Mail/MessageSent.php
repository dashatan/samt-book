<?php

namespace App\Mail;

use App\Message;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class MessageSent extends Mailable
{
    use Queueable, SerializesModels;

    public $message;

    public function __construct(Message $message)
    {
        $this->message = $message;
    }

    public function build()
    {
        return $this->view('vendor.mail.message-sent')
            ->with([
                'messageModel'=>$this->message,
                'messageable'=>$this->message->messageable,
                'messageSender'=>$this->message->user ? $this->message->user : '',
            ]);
    }
}
