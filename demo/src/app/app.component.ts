import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from 'ng-formly';
import { Observable, BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  JSON: any;
  model: any;
  form: FormGroup = new FormGroup({});
  chipsCollection: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(['Argentina', 'Brazil', 'Italy', 'France', 'Germany', 'China', 'USA', 'England', 'Japan', 'Portugal', 'Canada', 'Mexico', 'Spain']);
  typesCollection: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([
    { name: 'Type 1', value: 1 },
    { name: 'Type 2', value: 2 },
    { name: 'Type 3', value: 3 },
  ]);
  subtypesCollection: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([
    { name: 'Fever', value: 1, type: 1, priority: 1 },
    { name: 'Cough', value: 2, type: 1, priority: 1 },
    { name: 'Hypotension', value: 3, type: 1, priority: 2 },
    { name: 'Dizziness', value: 4, type: 2, priority: 2 },
    { name: 'Hypertension', value: 5, type: 2, priority: 3 },
    { name: 'Chest pain', value: 6, type: 3, priority: 3 }
  ]);
  prioritiesCollection: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([
    { name: 'Low', value: 1 },
    { name: 'Normal', value: 2 },
    { name: 'High', value: 3 },
  ]);
  animalsCollection: BehaviorSubject<{ name: string, value: string | number }[]> = new BehaviorSubject<{ name: string, value: string | number }[]>([
    { name: 'Horse', value: 1 },
    { name: 'Cow', value: 2 },
    { name: 'Dog', value: 3 },
    { name: 'Bird', value: 4 },
    { name: 'Fish', value: 5 },
    { name: 'Reptile', value: 6 },
    { name: 'Cat', value: 7 },
  ]);
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor() {
  }

  ngOnInit() {
    this.JSON = (<any>window).JSON;
    this.model = {
      datetime: moment().format('DD-MM-YYYY HH:mm'),
      typeId: 7,
      subtypeId: 2,
      priority: { name: 'Normal', value: 2 },
      chips: ['Argentina', 'Brazil', 'France'],
      input1: "ARG",
      autocomplete: { name: 'Cat', value: 7 },
      multiselect: [{ name: 'Cat', value: 7 }, { name: 'Bird', value: 4 }],
      input2: null,
      checklist1: false,
      checklist2: true,
      textarea: "This is a comment",
      address: {
        formatted_address: 'Cerrito 800, C1010AAP CABA, Argentina',
        lat: -34.5992993,
        lng: -58.3827919
      },
      radioGroup: { name: 'Fish', value: 5 },
      selectAutocomplete: { name: 'Fish', value: 5 }
    }

    //setTimeout(() => { this.form.reset() }, 2000);
    setTimeout(() => { this.form.get('priority').setValue({ name: 'Low', value: 1 })}, 2000);
  }

  formlyFields: FormlyFieldConfig[] = [
    {
      className: 'row',
      wrappers: ['card'],
      templateOptions: {
        title: 'Components',
        subtitle: 'Card #1',
      },
      fieldGroup: [
        {
          key: 'datetime',
          type: 'datetime',
          className: 'col-sm-3',
          templateOptions: {
            placeholder: 'Datetime',
            tooltip: 'Today',
            format: 'DD-MM-YYYY HH:mm',
            mask: [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ':', /\d/, /\d/]
          },
          validators: {
            validation: Validators.compose([(e) => {
              if (!e.value) {
                return { datetime: 'invalid' };
              }
              let valid = moment(e.value, 'DD-MM-YYYY HH:mm').isSameOrBefore(moment());
              valid = valid && e.value.indexOf('_') == -1;
              return valid ? null : { datetime: 'invalid' }
            }])
          }
        },
        {
          className: 'col-sm-3',
          key: 'typeId',
          type: 'select',
          wrapper: [],
          templateOptions: {
            placeholder: 'Type',
            nonull: false,
            source: this.typesCollection
          }
        },
        {
          className: 'col-sm-3',
          key: 'subtypeId',
          type: 'select-autocomplete',
          wrapper: [],
          templateOptions: {
            placeholder: 'Subtype',
            nonull: true,
            source: this.subtypesCollection
          }
        },
        {
          className: 'col-sm-3',
          key: 'priority',
          type: 'select',
          wrapper: [],
          templateOptions: {
            placeholder: 'Priority',
            nonull: true,
            source: Observable.create(o => {
              this.prioritiesCollection.takeUntil(this.ngUnsubscribe).subscribe(y => {
                o.next(y);
              });
            })
          }
        },
        {
          type: 'blank',
          className: 'col-xs-12',
        },
        {
          className: 'col-sm-3',
          key: 'chips',
          type: 'chips',
          templateOptions: {
            placeholder: "Chips",
            source: this.chipsCollection,
            onlyAutocomplete: true,
            maxItems: 7
          },
          validators: {
            validation: Validators.compose([Validators.required])
          }
        },
        {
          className: 'col-sm-3',
          key: 'input1',
          type: 'input',
          wrapper: [],
          templateOptions: {
            placeholder: 'Input',
            disabled: false,
            source: this.chipsCollection,
            sourceFilter: (x) => x.filter(x => x == 'Argentina'),
            format: (e: string) => e.trim().toUpperCase().replace(/(_|\W)+/g, '') // only uppercase alphanumeric allowed
          },
          validators: {
            validation: Validators.compose([Validators.required])
          }
        },
        {
          className: 'col-sm-3',
          key: 'autocomplete',
          type: 'autocomplete',
          wrapper: [],
          templateOptions: {
            placeholder: 'Autocomplete',
            tooltip: 'right',
            source: (e) => {
              return new Observable(o => {
                let list = this.animalsCollection.value.filter(x => e ? x.name.toLowerCase().indexOf(e.toLowerCase()) >= 0 : true);
                console.log(list);
                o.next(list);
              });
            },
          }
        },

        {
          className: 'col-sm-3',
          key: 'multiselect',
          type: 'select',
          wrapper: [],
          templateOptions: {
            placeholder: 'Multiselect',
            source: this.animalsCollection,
            multiple: true
          }
        }
      ],
    },
    {
      className: '',
      wrappers: ['card'],
      templateOptions: {
        title: 'More Components',
        subtitle: 'Card #2'
      },
      fieldGroup: [
        {
          className: 'col-sm-4',
          key: 'input2',
          type: 'input',
          wrapper: [],
          templateOptions: {
            label: 'Input',
            placeholder: 'E-mail',
            //password: true,
            keydown: (e) => {
              console.log(e);
            },
          },
          validators: {
            validation: Validators.compose([Validators.email])
          }
        },
        {
          className: 'col-sm-4',
          key: 'textarea',
          type: 'textarea',
          wrapper: [],
          templateOptions: {
            label: 'Input',
            placeholder: 'Comments',
            maxLength: 30,
            maxRows: 4,
            minRows: 4
          }
        },
        {
          className: 'col-sm-2',
          key: 'checklist1',
          type: 'checklist',
          wrapper: [],
          templateOptions: {
            text: 'Short text',
          }
        },
        {
          className: 'col-sm-2',
          key: 'checklist2',
          type: 'checklist',
          wrapper: [],
          templateOptions: {
            text: 'Some checklist with lots of text',
          }
        },
        {
          type: 'blank',
          className: 'col-sm-12'
        },
        {
          className: 'col-sm-4',
          key: 'address',
          type: 'address-picker',
          wrapper: [],
          templateOptions: {
            placeholder: 'Address',
            tooltip: 'Open map',
            api_key: '',
            country: 'AR', //https://en.wikipedia.org/wiki/ISO_3166-1
            mapCenterCoords: [-34.561253, -58.400155],
            tileLayerSource: '',
            yes: 'Accept',
            no: 'Cancel'
          }
        },
        {
          className: 'col-sm-2',
          key: 'radioGroup',
          type: 'radio-group',
          wrapper: [],
          templateOptions: {
            label: 'Animals',
            source: this.animalsCollection
          }
        },
        {
          className: 'col-sm-3',
          key: 'selectAutocomplete',
          type: 'select-autocomplete',
          wrapper: [],
          templateOptions: {
            placeholder: 'Select-Autocomplete',
            tooltip: 'right',
            source: this.animalsCollection
          }
        },
      ]
    },
    {
      className: '',
      type: 'repeated-section',
      key: 'repeated',
      wrappers: ['card'],
      templateOptions: {
        title: 'Repeated Section',
        addText: 'Add Section',
        addIcon: 'fa fa-plus-square-o',
        removeText: 'Remove',
        removeIcon: 'fa fa-minus',
        class: null,
        canAdd: true,
        canRemove: true,
        // maxSections: 3, Cantidad maxima que se puede agregar, en este caso de adjuntos
      },
      fieldArray: {
        className: 'row',
        fieldGroup: [
          {
            className: 'col-sm-3',
            key: 'chips',
            type: 'chips',
            templateOptions: {
              source: this.chipsCollection,
              onlyAutocomplete: true,
              placeholder: "Press enter to add value"
            }
          },
          {
            className: 'col-sm-3',
            key: 'checklist',
            type: 'checklist',
            wrapper: [],
            templateOptions: {
              text: "I'm inside a repeated section!",
            }
          },
        ]
      }
    }
  ];

  submit() {
    console.log(this.model);
  }

  cancel() {

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
