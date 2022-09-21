<h1 style="text-align: center;">{{__('پیام جدید دریافت شد')}}</h1>
<hr>
<p style="text-align: center">{{__('پیامی از طرف')}} {{$messageSender ? $messageSender->name : $messageModel->name}}</p>
<p style="text-align: center">{{__('برای')}} {{$messageable->title}}</p>
<hr>
<h2 style="text-align: center">{{$messageModel->message}}</h2>
<hr>
<div style="width: 100%;text-align: center">
    <a href="" style="padding: 10px 40px;background-color: #0a6aa1;color: white;border-radius: 1000px">
        {{__('نمایش پیام در صمت بوک')}}
    </a>
</div>
