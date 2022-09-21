<div style="direction: rtl;text-align: right">
    <div style="display: flex;align-items: center">
        <img src="{{$userModel->avatar}}" alt="{{$userModel->name}}" style="height: 60px;width: 60px;border-radius: 100px">
        <div style="margin-right: 10px">
            <div>{{$userModel->name}}</div>
            <div style="font-size: 12px">{{$userModel->email}}</div>
        </div>
    </div>
    <hr>
    <div style="
            background-image: url('{{asset('images/backgrounds/chat.jpg')}}');
            background-size: contain;
            overflow: auto
            "
    >
        @if($messageModel->type == 'text')
            <p style="padding: 10px;text-align: right">
                {{$messageModel->message}}
            </p>
        @endif
        @if($messageModel->type == 'image')
            <img style="height: 200px;width: auto" src="{{asset('storage/images/messages/'.$messageModel->image_path)}}" alt="{{$messageModel->id}}"/>
        @endif
        @if($messageModel->type == 'video')
            <video style="height: 200px;width: auto" src="{{asset('storage/videos/messages/'.$messageModel->video_path)}}"></video>
        @endif
    </div>
    <div style="display: flex;justify-content: center;align-items: center">
        <a href="{{$url}}" style="padding: 10px 20px;background-color: dodgerblue;color: #000000;border-radius: 10px">
            نمایش پیام
        </a>
    </div>
</div>

