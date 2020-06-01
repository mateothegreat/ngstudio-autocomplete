import { Component, ContentChild, ContentChildren, Input, OnInit, QueryList, TemplateRef, ViewChild } from '@angular/core';
import { merge, Subject }                                                                             from 'rxjs';
import { switchMap }                                                                                  from 'rxjs/operators';
import { AutocompleteConfig }                                                                         from './autocomplete-config';
import { AutocompleteContentDirective }                                                               from './autocomplete-content.directive';
import { AutocompleteService }                                                                        from './autocomplete.service';
import { OptionComponent }                                                                            from './option/option.component';

@Component({
    selector: 'ng-studio-autocomplete',
    template: `

        <ng-template #root>

            <div class="ng-studio-autocomplete" [style.background-color]="config.backgroundColor">

                <ng-content *ngFor="let item of (dataSource$ | async)"></ng-content>

            </div>

        </ng-template>

    `,
    styleUrls: [ './autocomplete.component.scss' ],
    exportAs: 'ngStudioAutocomplete'

})
export class AutocompleteComponent implements OnInit {

    @Input() public config: AutocompleteConfig;
    @Input() public dataSource$: Subject<any>;

    @ViewChild('root') rootTemplate: TemplateRef<any>;

    @ContentChild(AutocompleteContentDirective) public content: AutocompleteContentDirective;

    @ContentChildren(OptionComponent) options: QueryList<OptionComponent>;

    public constructor(private autocompleteService: AutocompleteService<any>) {

    }

    public ngOnInit() {

        this.autocompleteService.config = new AutocompleteConfig(this.config);


    }

    public optionsClick() {
        console.log(this.options);

        return this.options.changes.pipe(switchMap(options => {

            const clicks$ = options.map(option => option.click$);

            return merge(...clicks$);

        }));

    }

}
