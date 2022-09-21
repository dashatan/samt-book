<?php $baseUrl = url(''); ?>
<html lang="">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>{{config('app.name')}}</title>
        <link rel="stylesheet" href="{{ $baseUrl.'/css/app.css' }}"/>
        <link rel="stylesheet" href="{{ $baseUrl.'/css/fonts.css' }}"/>
        <link rel="stylesheet" href="{{ $baseUrl.'/css/ui-style.css' }}"/>
        <link rel="manifest" href="{{ $baseUrl.'/manifest.json' }}"/>
    </head>

    <body style="overflow: hidden">
        <div id="app"></div>
        <script src="{{$baseUrl.'/js/app.js?update15=1'}}"></script>
    </body>
</html>
