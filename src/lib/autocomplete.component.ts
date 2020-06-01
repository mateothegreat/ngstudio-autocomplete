import { ConnectionPositionPair, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal }                              from '@angular/cdk/portal';
import {
    ChangeDetectorRef,
    Component,
    ContentChild,
    ElementRef,
    Input,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewContainerRef
}                                                      from '@angular/core';
import { fromEvent, Subject }                          from 'rxjs';
import {
    filter,
    takeUntil
}                                                      from 'rxjs/operators';
import { AutocompleteConfig }                          from './autocomplete-config';
import { AutocompleteService }                         from './autocomplete.service';

@Component({
    selector: 'ng-studio-autocomplete',
    template: `

        <div class="wrapper">

            <input #input
                   (focus)="open()"
                   (keydown)="onInputChange($event)"
                   placeholder="Search...">

            <ng-template #options style="flex-direction: column">

                <div *ngFor="let item of filteredDatasource || (dataSource$ | async)"
                     (click)="onOptionClick(item)">

                    <template [templateWrapper]="template" [item]="item"></template>

                </div>

            </ng-template>

        </div>

    `,
    styleUrls: [ './autocomplete.component.scss' ],
    exportAs: 'ngStudioAutocomplete'

})
export class AutocompleteComponent implements OnInit {

    @Input() public config: AutocompleteConfig;
    @Input() public dataSource$: Subject<any>;

    @ContentChild(TemplateRef) public template;
    @ViewChild('options') public optionsContentChild;
    @ViewChild('input') public inputViewChild;

    public filteredDatasource: Array<any> = [];
    private overlayRef: OverlayRef;

    public constructor(private autocompleteService: AutocompleteService<any>,
                       private host: ElementRef<HTMLInputElement>,
                       private viewContainerRef: ViewContainerRef,
                       private overlay: Overlay,
                       private cdr: ChangeDetectorRef) {

    }


    private get origin() {

        return this.host.nativeElement;

    }

    private getOverlayPosition() {

        const positions = [

            new ConnectionPositionPair(
                { originX: 'start', originY: 'bottom' },
                { overlayX: 'start', overlayY: 'top' }
            ),

            new ConnectionPositionPair(
                { originX: 'start', originY: 'top' },
                { overlayX: 'start', overlayY: 'bottom' }
            )

        ];

        return this.overlay
                   .position()
                   .flexibleConnectedTo(this.origin)
                   .withPositions(positions)
                   .withFlexibleDimensions(false)
                   .withPush(false);

    }

    public ngOnInit() {

        this.autocompleteService.config = new AutocompleteConfig(this.config);

    }

    public open(): void {

        this.dataSource$.subscribe(options => this.filteredDatasource = options);

        this.overlayRef = this.overlay.create({

            width: this.origin.width,
            maxHeight: 40 * 3,
            backdropClass: '',

            scrollStrategy: this.overlay.scrollStrategies.reposition(),
            positionStrategy: this.getOverlayPosition()

        });

        this.overlayRef.attach(new TemplatePortal(this.optionsContentChild, this.viewContainerRef));

        overlayClickOutside(this.overlayRef, this.inputViewChild).subscribe(() => this.close());

    }

    public close(): void {

        this.overlayRef.detach();
        this.overlayRef = null;

        this.inputViewChild.nativeElement.value = '';

        this.inputViewChild.nativeElement.blur();

    }

    public onOptionClick(item: any): void {

        this.autocompleteService.valueChanged(item);

        if (!this.autocompleteService.config.allowMultiple) {

            this.close();

        }

    }

    public onInputChange(e: KeyboardEvent): void {

        if (e.key === 'Enter') {

            this.autocompleteService.valueChanged(this.inputViewChild.nativeElement.value);

            this.close();

        } else if (e.key === 'Escape') {

            this.close();

        } else {

            const results = this.dataSource$.subscribe(options => {

                this.filteredDatasource = options.filter(option => option[ this.autocompleteService.config.searchPropertyName ].toLowerCase().indexOf(this.inputViewChild.nativeElement.value.toLowerCase()) > -1);

            });

        }

    }

}

export function overlayClickOutside(overlayRef: OverlayRef, origin: any) {

    return fromEvent<MouseEvent>(document, 'click').pipe(filter(event => {

        const clickTarget = event.target as HTMLElement;
        const notOrigin = clickTarget !== origin.nativeElement; // the input
        const notOverlay = !!overlayRef && (overlayRef.overlayElement.contains(clickTarget) === false); // the autocomplete

        return notOrigin && notOverlay;

    }), takeUntil(overlayRef.detachments()));

}
