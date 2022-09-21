<?php

use Illuminate\Support\Facades\Route;

Route::post('/setUserFcmToken', 'ApiController@setUserFcmToken');
Route::post('/getMyApp', 'ApiController@getMyApp');
Route::post('/updateMyApp', 'ApiController@updateMyApp');
Route::post('/appSlides', 'CollectionsController@appSlides');
Route::post('/single', 'ApiController@single');
Route::post('/exbs', 'CollectionsController@exbs');
Route::post('/idps', 'CollectionsController@idps');
Route::post('/ftzs', 'CollectionsController@ftzs');

Route::prefix('single')->group(function () {
    Route::post('/getCollection', 'SingleController@getCollection');
    Route::post('/getSubset', 'SingleController@getSubset');
    Route::post('/sendEmail', 'SingleController@sendEmail');
    Route::post('/getReceiverUser', 'SingleController@getReceiverUser');
    Route::post('/getMessages', 'SingleController@getMessages');
    Route::post('/sendMessage', 'SingleController@sendMessage');
    Route::post('/sendMediaMessage', 'SingleController@sendMediaMessage');
    Route::post('/getComments', 'SingleController@getComments');
    Route::post('/storeNewComment', 'SingleController@storeNewComment');
    Route::prefix('like')->group(function () {
        Route::post('/isLiked', 'LikeController@isLiked');
        Route::post('/store', 'LikeController@store');
        Route::post('/destroy', 'LikeController@destroy');
    });
});
Route::prefix('explore')->group(function () {
    Route::post('/', 'ExploreController@explore');
    Route::post('/slides', 'ExploreController@slides');
    Route::post('/storeNewSlide', 'ExploreController@storeNewSlide');
    Route::post('/deleteSlide', 'ExploreController@deleteSlide');
});
Route::prefix('login')->group(function () {
    Route::post('/sendPhoneNumber', 'ProfileController@sendPhoneNumber');
    Route::post('/sendPassword', 'ProfileController@sendPassword');
    Route::post('/verifyPassword', 'ProfileController@verifyPassword');
    Route::post('/register', 'ProfileController@register');
    Route::post('/getUserInfo', 'AdminController@getUserInfo');
});
Route::prefix('profile')->group(function () {
    Route::post('/getUser', 'ProfileController@getUser');
    Route::post('/getUsers', 'ProfileController@getUsers');
    Route::post('/editProfile', 'ProfileController@editProfile');
    Route::post('/logout', 'ProfileController@logout');
    Route::post('/setIdentifications', 'ProfileController@setIdentifications');
    Route::post('/collectionsOfCurrentUser', 'ProfileController@collectionsOfCurrentUser');
    Route::post('/storeCollection', 'ProfileController@storeCollection');
    Route::post('/storeCollectionImage', 'ProfileController@storeCollectionImage');
    Route::post('/deleteCollection', 'ProfileController@deleteCollection');
    Route::post('/publish', 'ProfileController@publish');
    Route::post('/updateCollection', 'ProfileController@updateCollection');
    Route::post('/updateCollectionImage', 'ProfileController@updateCollectionImage');
    Route::post('/getRelationItems', 'ProfileController@getRelationItems');
    Route::post('/getCollection', 'ProfileController@getCollection');
    Route::post('/storeRelation', 'ProfileController@storeRelation');
    Route::post('/updateRelation', 'ProfileController@updateRelation');
    Route::post('/deleteRelation', 'ProfileController@deleteRelation');
    Route::post('/editUser', 'ProfileController@editUser');
    Route::post('/getEditingUser', 'ProfileController@getEditingUser');
    Route::post('/storeNewUser', 'ProfileController@storeNewUser');
    Route::post('/deleteUser', 'ProfileController@deleteUser');
    Route::post('/modify', 'ProfileController@modify');
    Route::post('/getRooms', 'ProfileController@getRooms');
    Route::post('/sendBulkMessage', 'ProfileController@sendBulkMessage');
});
Route::prefix('news')->group(function () {
    Route::post('/', 'NewsController@news');
    Route::post('/delete', 'NewsController@delete');
    Route::post('/store', 'NewsController@store');
    Route::post('/update', 'NewsController@update');
});
Route::prefix('relations')->group(function () {
    Route::post('/', 'ApiController@getRelations');
});
Route::prefix('contactUs')->group(function () {
    Route::post('/getChatContacts', 'ApiController@getChatContacts');
});

