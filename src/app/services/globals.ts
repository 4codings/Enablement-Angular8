import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class Globals {
    domain_name = environment.domainName;
    domain = environment.apiURL;
    suffix = '/Enablement';
    TIMEOUT_IN_SECONDS = 3;
    Report: any = {};
    version = '/v1';
    Version = 1;
    Path = '/rest';
}