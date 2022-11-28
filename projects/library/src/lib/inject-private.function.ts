import { inject, Injector, Type, AbstractType, InjectionToken } from '@angular/core';

type ProviderToken<T> = Type<T> | AbstractType<T> | InjectionToken<T>;

export function injectPrivate<T>(token: ProviderToken<T>): T {
    const parentInjector = inject(Injector);
    const localInjector = Injector.create({
        providers: [token as any],
        parent: parentInjector
    });

    return localInjector.get<T>(token);
}
