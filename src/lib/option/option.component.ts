import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit } from '@angular/core';
import { fromEvent, Observable }                                         from 'rxjs';
import { mapTo }                                                         from 'rxjs/operators';

@Component({
    selector: 'ng-studio-autocomplete-option',
    template: `

        <div class="option">

            asdfasdfasdf

        </div>

    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: [ './option.component.css' ]

})
export class OptionComponent implements OnInit {

    @Input() public value: string;

    public click$: Observable<string>;

    public constructor(private host: ElementRef) {

    }

    public ngOnInit() {

        this.click$ = fromEvent(this.element, 'click').pipe(mapTo(this.value));

    }

    public get element() {

        return this.host.nativeElement;

    }

}
