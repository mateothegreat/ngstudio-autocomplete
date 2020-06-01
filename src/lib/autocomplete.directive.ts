import { ConnectionPositionPair, Overlay, OverlayRef }            from '@angular/cdk/overlay';
import { TemplatePortal }                                         from '@angular/cdk/portal';
import { Directive, ElementRef, Input, OnInit, ViewContainerRef } from '@angular/core';
import { fromEvent }                                              from 'rxjs';
import { filter, takeUntil }                                      from 'rxjs/operators';
import { AutocompleteComponent }                                  from './autocomplete.component';
import { AutocompleteService }                                    from './autocomplete.service';

@Directive({

    selector: '[ngstudioAutocomplete]'

})
export class AutocompleteDirective implements OnInit {

    @Input() public ngstudioAutocomplete: AutocompleteComponent;

    private overlayRef: OverlayRef;

    public constructor(private autocompleteService: AutocompleteService<any>,
                       private host: ElementRef<HTMLInputElement>,
                       private vcr: ViewContainerRef,
                       private overlay: Overlay) {

    }

    public get origin() {

        return this.host.nativeElement;

    }

    public ngOnInit() {

        fromEvent(this.origin, 'focus').pipe(
            // untilDestroyed(this)
        ).subscribe(() => {

            this.openDropdown();

            this.ngstudioAutocomplete.optionsClick().pipe(takeUntil(this.overlayRef.detachments())).subscribe((value: string) => {

                this.autocompleteService.setValue(value);

                this.close();

            });

        });

        //
        // Handle manual input (not click on item list) with enter key.
        //
        this.host.nativeElement.addEventListener('change', v => {

            this.autocompleteService.setValue(this.host.nativeElement.value);

            this.host.nativeElement.value = '';

            if (this.autocompleteService.config.closeAfterInputEntered) {

                this.close();

                this.host.nativeElement.blur();

            }

        });

        //
        // Handle each key up to filter the options.
        //
        this.host.nativeElement.addEventListener('keypress', v => {

            console.log(v);


        });

    }

    public openDropdown() {

        this.overlayRef = this.overlay.create({

            width: this.origin.offsetWidth,
            maxHeight: 40 * 3,
            backdropClass: '',
            scrollStrategy: this.overlay.scrollStrategies.reposition(),
            positionStrategy: this.getOverlayPosition()

        });

        const template = new TemplatePortal(this.ngstudioAutocomplete.rootTemplate, this.vcr);

        this.overlayRef.attach(template);

        overlayClickOutside(this.overlayRef, this.origin).subscribe(() => this.close());

    }

    public ngOnDestroy() {
    }

    private close() {

        this.overlayRef.detach();
        this.overlayRef = null;

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

}

export function overlayClickOutside(overlayRef: OverlayRef, origin: HTMLElement) {
    return fromEvent<MouseEvent>(document, 'click')
        .pipe(
            filter(event => {
                const clickTarget = event.target as HTMLElement;
                const notOrigin = clickTarget !== origin; // the input
                const notOverlay = !!overlayRef && (overlayRef.overlayElement.contains(clickTarget) === false); // the autocomplete
                return notOrigin && notOverlay;
            }),
            takeUntil(overlayRef.detachments())
        );

}
