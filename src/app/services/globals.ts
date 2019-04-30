import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class Globals {
    domain_name = 'enablement.us/Enablement';
    domain = 'enablement.us';
    suffix = '/Enablement';
    TIMEOUT_IN_SECONDS = 3;
    Report: any = {};
    version = '/v1';
    Version = 1;
    Path = '/rest';
}