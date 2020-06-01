export class AutocompleteConfig {

    public allowCustomValue?: boolean;
    public allowMultiple?: boolean;
    public closeAfterInputEntered?: boolean = true;

    public backgroundColor?: string = '#fff';

    public searchPropertyName?: string = 'label';

    public constructor(config: AutocompleteConfig) {

        Object.assign(this, config);

    }

}
