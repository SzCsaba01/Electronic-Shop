import { Component, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Component({
    template: ''
})

export abstract class SelfUnsubscriberBase implements OnDestroy {
    protected ngUnsubscribe: Subject<any> = new Subject();
    protected subscriptions = new Array<Subscription>();
    protected onDestroy: (() => unknown) | undefined;

    ngOnDestroy(): void {
        if (this.onDestroy) {
            this.onDestroy();
        }

        if (!!this.subscriptions && this.subscriptions.length > 0) {
            for (let sub of this.subscriptions) {
                sub.unsubscribe();
        }

        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
        }
    }
}