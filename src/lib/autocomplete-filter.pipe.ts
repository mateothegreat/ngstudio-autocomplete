import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'autocompleteFilter'
})
export class AutocompleteFilterPipe implements PipeTransform {

    public transform(items: any[], searchTerm: string, labelKey?: string): any {

        console.log(searchTerm);

        if (!items || !searchTerm) {

            return items;

        }

        return items.filter(item => item[ labelKey || 'label' ].toLowerCase().includes(searchTerm.toLowerCase()) === true);

    }

}
