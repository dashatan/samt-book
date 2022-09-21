<?php

namespace App\Jobs;

use App\Collection;
use App\Events\MessageSent;
use App\Http\Controllers\SingleController;
use App\Message;
use App\Notifications\NewMessageNotification;
use App\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Http\Request;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendBulkMessagesJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    protected $message;
    protected $user;
    protected $targetUsersIds;

    /**
     * Create a new job instance.
     *
     * @param Message $message
     * @param User $user
     * @param $targetUsersIds
     */
    public function __construct(Message $message,User $user,$targetUsersIds)
    {
        $this->message = $message;
        $this->user = $user;
        $this->targetUsersIds = $targetUsersIds;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {

        foreach ($this->targetUsersIds as $targetUsersId){
            $s = new SingleController();
            $room = $s->findRoomViaUsers($this->user->id,$targetUsersId);
            $message = new Message(
                [
                    'type' => 'extend',
                    'user_id' => $this->user->id,
                    'room_id' => $room->id,
                    'parent_id' => $this->message->id,
                    'seen' => 0,
                ]
            );
            $message->save();
            $room->touch();
            //chat realtime
            event(new MessageSent($room->id));

            //notification
            $opponentUser = User::find($targetUsersId);
            $opponentUser->notify(new NewMessageNotification($this->user, $message));

            //Mail
            $url = url('profile/inbox/chat/' . $room->id);
            SendMessage::dispatch($message, $this->user, $opponentUser, $url);
        }
    }
}
