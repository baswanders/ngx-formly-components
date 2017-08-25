import { Component, OnInit, DoCheck, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { Field } from 'ng-formly';
import { Subject } from 'rxjs/Subject';
import { FormControl } from '@angular/forms';
import { Http } from "@angular/http";
import { Subscription } from 'rxjs/Subscription';
import { MdDialog, MdAutocomplete } from '@angular/material';

@Component({
    selector: 'formly-ngx-radio-group',
    styles: [`
    .formly-radio-group {
        display: inline-flex;
        flex-direction: column;
    }
    .formly-radio-button {
        margin: 0px;
    }
    :host /deep/ label {
        font-weight: normal;
    }
    .formly-radio-group-label {
        color: rgba(0,0,0,.38);
    }
  `],
    template: `
    <div class="formly-radio-group-label">{{to.label}}</div>
    <md-radio-group class="formly-radio-group" [(ngModel)]="value">
        <md-radio-button class="formly-radio-button" *ngFor="let item of items" [value]="item.value" (click)="changed(item)">
            {{item.name}}
        </md-radio-button>
    </md-radio-group>
  `,
})
export class FormlyRadioGroupComponent extends Field implements OnInit, OnDestroy {

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    public items: any[] = [];
    public value: any = null;

    constructor(private http: Http, public dialog: MdDialog) {
        super();
    }

    public ngOnInit() {
        this.to.disabled && this.formControl.disable();
        this.to.source && this.to.source.takeUntil(this.ngUnsubscribe).subscribe(x => {
            this.items = x;
            if (this.items && this.items.length > 0) {
                if (this.formControl.value) {
                    let val = this.items.filter(y => y.value == this.formControl.value.value);
                    if (val && val.length > 0) {
                        this.value = val[0].value;
                    }
                }
            }
        });
        this.formControl.valueChanges.takeUntil(this.ngUnsubscribe).subscribe(x => {
            if (x && this.items && this.items.length > 0) {
                let val = this.items.filter(y => y.value == x.value);
                if (val && val.length > 0) {
                    this.value = val[0].value;
                }
                else {
                    this.value = null;
                }
            }
        });
    }

    changed(e: any) {
        !!e && this.formControl.setValue(e);
        this.to.changed && this.to.changed(e);
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}