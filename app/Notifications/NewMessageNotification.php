<?php

namespace App\Notifications;

use App\Message;
use App\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use NotificationChannels\Fcm\FcmChannel;
use NotificationChannels\Fcm\FcmMessage;
use NotificationChannels\Fcm\Resources\AndroidConfig;
use NotificationChannels\Fcm\Resources\AndroidFcmOptions;
use NotificationChannels\Fcm\Resources\AndroidNotification;
use NotificationChannels\Fcm\Resources\ApnsConfig;
use NotificationChannels\Fcm\Resources\ApnsFcmOptions;
use NotificationChannels\Fcm\Resources\Notification as FcmNotification;
use NotificationChannels\Fcm\Resources\WebpushConfig;
use NotificationChannels\Fcm\Resources\WebpushFcmOptions;

class NewMessageNotification extends Notification implements ShouldQueue
{
    use Queueable;
    protected $messageModel;
    protected $senderUser;

    /**
     * Create a new notification instance.
     *
     * @param User $senderUser
     * @param Message $message
     */
    public function __construct(User $senderUser, Message $message)
    {
        Log::info('notification constructed');
        $this->messageModel = $message;
        $this->senderUser = $senderUser;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        Log::info('notification via');
        return [FcmChannel::class];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param mixed $notifiable
     * @return FcmMessage
     */
    public function toFcm($notifiable)
    {
        Log::info('notification to');
        $url = url('profile/inbox');
        return FcmMessage::create()
            ->setData(['message' => 'message'])
            ->setNotification(
                FcmNotification::create()
                    ->setTitle(__('پیام جدید از طرف ') . $this->senderUser->name)
                    ->setBody($this->messageModel->message)
                    ->setImage($this->senderUser->avatar)
            )->setWebpush(
                WebpushConfig::create()->setFcmOptions(
                    WebpushFcmOptions::create()->setLink($url)
                )
            )
            ->setAndroid(
                AndroidConfig::create()
                    ->setFcmOptions(
                        AndroidFcmOptions::create()
                            ->setAnalyticsLabel('analytics')
                    )
                    ->setNotification(
                        AndroidNotification::create()
                            ->setColor('#0A0A0A')
                    )
            )->setApns(
                ApnsConfig::create()
                    ->setFcmOptions(
                        ApnsFcmOptions::create()->setAnalyticsLabel('analytics_ios')
                    )
            );
    }
}
