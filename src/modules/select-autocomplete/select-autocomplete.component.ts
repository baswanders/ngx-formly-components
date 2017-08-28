import { Component, OnInit, DoCheck, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { Field } from 'ng-formly';
import { Subject } from 'rxjs/Subject';
import { FormControl } from '@angular/forms';
import { Http } from "@angular/http";
import { Subscription } from 'rxjs/Subscription';
import { MdDialog, MdAutocomplete } from '@angular/material';

@Component({
    selector: 'formly-ngx-select-autocomplete',
    styles: [`
  `],
    template: `
    <div [ngStyle]="{color:formControl.errors?'#f44336':'inherit'}">
        <md-input-container style="width: 100%">
            <input mdInput [placeholder]="to.placeholder" type="text" [(ngModel)]="value" (ngModelChange)="changed($event)" [disabled]="formControl.disabled" [mdAutocomplete]="autocomplete"/>
        </md-input-container>
        <md-autocomplete #autocomplete="mdAutocomplete" [displayWith]="displayFn">
            <md-option *ngFor="let item of filteredItems" [value]="item" (click)="clicked(item)" [mdTooltip]="to.tooltip && item.name" [mdTooltipPosition]="to.tooltip">{{item.name}}</md-option>
        </md-autocomplete>
    </div>
  `,
})
export class FormlySelectAutocompleteComponent extends Field implements OnInit, OnDestroy {

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    public items: any[] = [];
    public filteredItems: any[];
    public value: string;
    private sub: Subscription;
    private timeout: any;

    constructor(private http: Http, public dialog: MdDialog) {
        super();
    }

    public ngOnInit() {
        this.to.disabled && this.formControl.disable();
        if (this.formControl.value) {
            this.value = this.formControl.value;
        }
        this.to.source && this.to.source.takeUntil(this.ngUnsubscribe).subscribe(x => {
            this.filteredItems = [];
            this.items = [];
            if (x && x.length > 0) {
                this.items = x;
                if (this.to.nonull && !this.formControl.value && this.items && this.items.length > 0) {
                    this.formControl.setValue(this.items[0]);
                    this.value = this.items[0];
                }
            }
            else {
                this.value = null;
                this.formControl.setValue(null);
            }
        });
        this.formControl.valueChanges.takeUntil(this.ngUnsubscribe).subscribe(x => {
            if (x) {
                let val = this.items.filter(y => y.value == x.value);
                if (val && val.length > 0) {
                    this.value = val[0];
                }
                else {
                    if (this.to.nonull && this.items && this.items.length > 0) {
                        this.value = this.items[0];
                    }
                }
            }
            this.to.changed && this.to.changed(x);
        });
    }

    changed(e: any) {
        this.filteredItems = this.filter(e);
        e && e.value ? this.formControl.setValue(e) : this.formControl.setValue(null);
    }

    filter(val: any): string[] {
        if (!val) {
            return this.items;
        }
        if (!this.items || val.name) {
            return null;
        }
        return this.items.filter(option => {
            if (!option) {
                return false;
            }
            return option.name.toLowerCase().indexOf(val.toLowerCase()) >= 0;
        });
    }

    clicked(e: any) {
        if (e) {
            this.formControl.setValue(e);
            this.value = e;
        }
    }

    displayFn(e: any): string {
        return e ? e.name : null;
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}