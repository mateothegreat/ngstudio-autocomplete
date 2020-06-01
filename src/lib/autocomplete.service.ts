import { Injectable }         from '@angular/core';
import { Subject }            from 'rxjs';
import { AutocompleteConfig } from './autocomplete-config';

@Injectable({
    providedIn: 'root'
})
export class AutocompleteService<T> {

    public value$: Subject<T> = new Subject();
    public config: AutocompleteConfig;
    public optionsFiltered: Subject<any> = new Subject();

    public valueChanged(value: T): void {

        this.value$.next(value);

    }

}
