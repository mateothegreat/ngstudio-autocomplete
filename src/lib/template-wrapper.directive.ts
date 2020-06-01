import { Directive, EmbeddedViewRef, Input, OnChanges, SimpleChange, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({

    selector: '[templateWrapper]'

})
export class TemplateWrapper implements OnChanges {

    @Input() private item: any;
    @Input() private templateWrapper: TemplateRef<any>;

    private embeddedViewRef: EmbeddedViewRef<any>;

    public constructor(private viewContainer: ViewContainerRef) {

    }

    public ngOnChanges(changes: { [ key: string ]: SimpleChange }) {

        if (changes[ 'templateWrapper' ]) {

            if (this.embeddedViewRef) {

                this.embeddedViewRef.destroy();

            }

            this.embeddedViewRef = this.viewContainer.createEmbeddedView(this.templateWrapper, { item: this.item });

        }

        if (this.embeddedViewRef) {

            this.embeddedViewRef.context.item = this.item;

        }

    }

}
