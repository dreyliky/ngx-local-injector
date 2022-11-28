# Local Injector 🪄 [Angular 14+]

The function `injectPrivate` allows you to inject a dependency without adding it to the providers.

Use for local dependencies you need only in the specific class as low-level dependencies.

## Install

```
npm i ngx-local-injector
```

## Why?

Allows you better encapsulate your `low-level Injectable` dependencies.

## Description

Works in context of `Component, Directive, Injectable, Pipe, Module`.

## Examples

Organize your Service following the Single Responsibility principle and with encapsulation of low-level services:

**window.service.ts**
``` typescript
import { injectPrivate } from 'ngx-local-injector';
import {
    WindowOrderingService,
    WindowCoordinatesService,
    WindowActivityService,
    WindowConfigService
} from './my-private-services';

/** @public */
@Injectable()
export class WindowService {
    // Each of these services will be injected
    // in the context of our WindowService.
    // You can not add these services to the providers.
    private readonly orderingService = injectPrivate(WindowOrderingService);
    private readonly coordinatesService = injectPrivate(WindowCoordinatesService);
    private readonly activityService = injectPrivate(WindowActivityService);
    private readonly configService = injectPrivate(WindowConfigService);

    constructor() {
        // All your private services available here
        console.log(this.orderingService);
    }

    public create(): void {
        this.orderingService.doSomething();
        this.coordinatesService.doSomething();
        this.activityService.doSomething();
        this.configService.doSomething();
    }
}
```

**window-ordering.service**
``` typescript
import { OPENED_WINDOW } from '../tokens';
import { DynamicWindow } from '../interaces';

/** @private */
@Injectable()
export class WindowService {
    constructor(
        // You can use default DI features as well
        @Inject(OPENED_WINDOW) private readonly openedWindow: DynamicWindow
    ) {}
}
```

Provide single `public` `WindowService` on some level, instead of all those services.

So, in this case all other services will be `private`.

**window.module.ts**
``` typescript
@NgModule({
    providers: [WindowService]
})
export class WindowModule {}
```
