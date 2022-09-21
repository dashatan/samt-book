<?php

use \Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Redis;

Route::get('/oauth','AdminController@oauth');
Route::get('/','AdminController@Home');
Route::get('/profile','AdminController@Home');
Route::get('/login','AdminController@Home');
Route::get('/lang','AdminController@Home');
Route::get('/profile/{a}','AdminController@Home');
Route::get('/profile/{a}/{b}','AdminController@Home');
Route::get('/profile/{a}/{b}/{c}','AdminController@Home');
Route::get('/profile/{a}/{b}/{c}/{d}','AdminController@Home');
Route::get('/profile/{a}/{b}/{c}/{d}/{e}','AdminController@Home');
Route::get('/profile/{a}/{b}/{c}/{d}/{e}/{f}','AdminController@Home');
Route::get('/profile/{a}/{b}/{c}/{d}/{e}/{f}/{g}','AdminController@Home');
Route::get('/profile/{a}/{b}/{c}/{d}/{e}/{f}/{g}/{h}','AdminController@Home');
Route::get('/profile/{a}/{b}/{c}/{d}/{e}/{f}/{g}/{h}/{i}','AdminController@Home');
Route::get('/profile/{a}/{b}/{c}/{d}/{e}/{f}/{g}/{h}/{i}/{j}','AdminController@Home');
Route::get('/profile/{a}/{b}/{c}/{d}/{e}/{f}/{g}/{h}/{i}/{j}/{k}/','AdminController@Home');
Route::get('/explore','AdminController@Home');
Route::get('/explore/{a}','AdminController@Home');
Route::get('/explore/{a}/{b}','AdminController@Home');
Route::get('/s/{a}/{b}','AdminController@single');
Route::get('/s/{a}/{b}/{c}','AdminController@single');
Route::get('/s/{a}/{b}/{c}/{d}','AdminController@single');
Route::get('/s/{a}/{b}/{c}/{d}/{e}','AdminController@single');
Route::get('/news','AdminController@Home');
Route::get('/news/{a}','AdminController@Home');
Route::get('/news/{a}/{b}','AdminController@Home');
Route::get('/contacts','AdminController@Home');
Route::get('/contacts/{a}','AdminController@Home');
Route::get('/contacts/{a}/{b}','AdminController@Home');
Route::get('/contacts/{a}/{b}/{c}','AdminController@Home');
Route::get('/contacts/{a}/{b}/{c}/{d}','AdminController@Home');
Route::get('/contacts/{a}/{b}/{c}/{d}/{e}','AdminController@Home');
Route::get('/import','AdminController@import');
