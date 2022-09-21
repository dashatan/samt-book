<!doctype html>
<?php $baseUrl = url(''); ?>
<html lang="{{session('samtbookLanguage')}}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="base-url" content="{{$baseUrl}}">
    <meta name="user-id" content="{{auth()->check() ? auth()->id() : 0}}">
    <meta property="og:site_name" content="samtbook"/>
    <meta itemprop="name" content="samtbook"/>
    <meta itemprop="headline" content="samtbook"/>
    <meta itemprop="description" content="{{$model->dsc}}"/>
    <meta property="og:title" content="{{$model->title}}"/>
    <meta property="og:type" content="website"/>
    <meta property="og:url" content="{{$shareUrl}}"/>
    <meta property="og:image" content="{{$thumbnail}}"/>
    <meta itemprop="image" content="{{$thumbnail}}"/>
    <meta property="og:image:width" content="600"/>
    <meta property="og:image:height" content="400"/>
    <meta property="og:image:type" content="image/jpeg"/>
    <meta name="twitter:card" content="summary_large_image"/>
    <meta property="og:description" content="{{$model->dsc}}"/>
    <meta name="keywords" content="{{$model->title}}">
    <meta name="description" content="{{$model->dsc}}">
    <title>{{config('app.name')}}</title>
    <link rel="stylesheet" href="{{ $baseUrl.'/css/app.css' }}"/>
    <link rel="stylesheet" href="{{ $baseUrl.'/css/fonts.css' }}"/>
    <link rel="stylesheet" href="{{ $baseUrl.'/css/ui-style.css' }}"/>
    <link rel="manifest" href="{{ $baseUrl.'/manifest.json' }}"/>
    @if(in_array(session('samtbookLanguage'),['fa','ar']))
    <style>
        body {
            direction: rtl;
            text-align: right;
            font-family: iran, serif;
        }
    </style>
    @endif
</head>

<body style="overflow: hidden">
    <div id="app"></div>
    <script src="{{$baseUrl.'/js/app.js?update15=1'}}"></script>
</body>

</html>
