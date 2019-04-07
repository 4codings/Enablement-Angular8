import {
    AfterViewInit,
    Component,
    DoCheck,
    Input,
    OnChanges,
    OnDestroy,
    OnInit
} from '@angular/core';
import {AbstractControl, FormGroupDirective} from "@angular/forms";
import * as _ from 'lodash';
import {combineLatest, Subject, Subscription} from "rxjs";
import {distinctUntilChanged} from 'rxjs/operators';


@Component({
    selector:    'form-error-msg',
    templateUrl: './form-error-msg.component.html',
    styleUrls:   ['./form-error-msg.component.scss']
})
export class FormErrorMsgComponent implements OnInit, OnChanges, DoCheck, OnDestroy, AfterViewInit {
    @Input() controlName: string;
    @Input('message') msg: any;
    @Input('when') rules: string[] = ['touched'];
    content: string;

    private state: Subject<boolean>;
    private error: Subject<string | null>;
    private subscription: Subscription;
    private defaultMsg: any;
    private control: AbstractControl;

    constructor(private form: FormGroupDirective) {
    }

    ngOnInit() {
        this.control = this.form.control.get(this.controlName);
        this.state = new Subject<boolean>();
        this.error = new Subject<string | null>();
        this.initMessages();
        _.merge(this.defaultMsg, this.msg);


        this.subscription = combineLatest(
            this.state.pipe(distinctUntilChanged()),
            this.error
        ).subscribe(([state, error]) => {
            if (state && error !== null) {
                this.content = this.defaultMsg[error];
            } else {
                this.content = '';
            }
        });

        // When form is submitted without touching the element, we want to show errors.
        this.form.ngSubmit.subscribe(() => {
            this.control.markAsTouched({onlySelf: true});
        });
    }

    ngOnChanges() {
        this.control = this.form.control.get(this.controlName);
    }

    ngDoCheck(): void {
        this.state.next(
            this.rules.map(prop => this.control[prop]).every(val => val == true)
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            if (!this.control) return;

            this.checkErrors();
            this.control.statusChanges.subscribe(this.checkErrors.bind(this));
        });
    }

    private checkErrors() {
        const control = this.control;
        const errors = control.errors;
        let errProp = null;

        for (let e in errors) {
            if (!this.defaultMsg.hasOwnProperty(e))
                continue;

            errProp = e;
            break;
        }

        this.error.next(errProp);
    }

    private initMessages() {
        this.defaultMsg = {
            required:        `${_.startCase(this.controlName)} is required`,
            email:           'Enter a valid email',
            invalidPassword: `Use at least 8 characters. 
            Mix with digits, uppercase and special character`,
        }
    }

}
