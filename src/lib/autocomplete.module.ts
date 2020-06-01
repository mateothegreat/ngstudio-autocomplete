import { PortalModule }          from '@angular/cdk/portal';
import { CommonModule }          from '@angular/common';
import { NgModule }              from '@angular/core';
import { AutocompleteComponent } from './autocomplete.component';
import { OptionComponent }       from './option/option.component';
import { TemplateWrapper }       from './template-wrapper.directive';

@NgModule({

    declarations: [

        AutocompleteComponent,
        OptionComponent,

        TemplateWrapper

    ],

    imports: [

        CommonModule,
        PortalModule

    ],

    exports: [

        AutocompleteComponent,
        OptionComponent

    ]

})
export class AutocompleteModule {
}
