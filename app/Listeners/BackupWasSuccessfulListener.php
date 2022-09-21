<?php

namespace App\Listeners;

use App\Mail\BackupMail;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;
use Spatie\Backup\Events\BackupWasSuccessful;
use Spatie\Backup\Events\BackupZipWasCreated;

class BackupWasSuccessfulListener
{
    public function __construct()
    {
        //
    }

    public function handle(BackupZipWasCreated $event)
    {
        Mail::to('dashatanad@gmail.com')->send(new BackupMail($event->pathToZip));
    }
}
