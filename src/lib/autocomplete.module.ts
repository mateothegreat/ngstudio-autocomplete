import { CommonModule }                 from '@angular/common';
import { NgModule }                     from '@angular/core';
import { AutocompleteContentDirective } from './autocomplete-content.directive';
import { AutocompleteFilterPipe }       from './autocomplete-filter.pipe';
import { AutocompleteComponent }        from './autocomplete.component';
import { AutocompleteDirective }        from './autocomplete.directive';
import { OptionComponent }              from './option/option.component';

@NgModule({

    declarations: [

        AutocompleteComponent,
        AutocompleteDirective,
        AutocompleteContentDirective,
        AutocompleteFilterPipe,
        OptionComponent

    ],

    imports: [

        CommonModule

    ],

    exports: [

        AutocompleteComponent,
        AutocompleteDirective,
        AutocompleteContentDirective,
        AutocompleteFilterPipe,
        OptionComponent

    ]

})
export class AutocompleteModule {
}
