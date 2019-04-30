import { Injectable, EventEmitter } from "@angular/core"
import * as CryptoJS from 'crypto-js'
import * as SecureStorage from 'secure-web-storage'
import { ToastrService } from "ngx-toastr"

interface LoginUser {
    SRC_CD: string;
    SRC_ID: number;
    TOKEN: string;
    USR_ID: number;
    USR_NM: string;
}

@Injectable({
    providedIn: 'root'
})
export class Globals2 {
    public currentUser: LoginUser = null

    constructor() {
        this.currentUser = this.secureStorage.getItem('current:user')
    }

    secureStorage = new SecureStorage(localStorage, {
        hash: function hash(key) {
            key = CryptoJS.SHA256(key, 'ubtXFG468b');

            return key.toString();
        },
        encrypt: function encrypt(data) {
            data = CryptoJS.AES.encrypt(data, 'ubtXFG468b');

            data = data.toString();

            return data;
        },
        decrypt: function decrypt(data) {
            data = CryptoJS.AES.decrypt(data, 'ubtXFG468b');

            data = data.toString(CryptoJS.enc.Utf8);

            return data;
        }
    })
}

export module Events {
    export let events$ = {}
    export function subscribe(eventName: string, onSuccess: Function, onError: Function): void {
        if (!events$[eventName])
            events$[eventName] = new EventEmitter<any>();
        (<EventEmitter<any>>events$[eventName]).subscribe(onSuccess, onError)
    }
    export function publish(eventName: string, data: any): void {
        if (!events$[eventName])
            events$[eventName] = new EventEmitter<any>();
        (<EventEmitter<any>>events$[eventName]).emit(data)
    }
}

