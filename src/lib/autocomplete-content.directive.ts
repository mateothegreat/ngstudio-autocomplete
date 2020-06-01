import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[autocompleteContent]'
})
export class AutocompleteContentDirective {

    public constructor(public template: TemplateRef<any>) {

    }

}
