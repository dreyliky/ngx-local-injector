import { Injectable, InjectionToken, Inject, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { injectPrivate } from './inject-private.function';

const GLOBAL_TOKEN = new InjectionToken('GLOBAL_TOKEN');
const GLOBAL_TOKEN_VALUE = 'myValue';
const LOCAL_TOKEN = new InjectionToken('LOCAL_TOKEN');
const LOCAL_TOKEN_VALUE = 'myValue_local';

@Injectable()
class FirstDependService {
    public tst = 123;
}

@Injectable()
class ThirdDependService {
    public tst = 456;

    constructor(
        @Inject(GLOBAL_TOKEN) public readonly globalValue: string,
        @Inject(LOCAL_TOKEN) public readonly localValue: string
    ) {}
}

@Injectable()
class SecondDependService {
    public readonly thirdService = injectPrivate(ThirdDependService);

    public tst = 789;
}

@Injectable()
class MyService {
    public readonly firstService = injectPrivate(FirstDependService);
    public readonly secondService = injectPrivate(SecondDependService);
}

@Component({
    providers: [
        {
            provide: LOCAL_TOKEN,
            useValue: LOCAL_TOKEN_VALUE
        },
        MyService
    ]
})
class MyComponent {
    constructor(
        public readonly myService: MyService
    ) {}
}

describe('injectPrivate', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                MyComponent
            ],
            providers: [
                {
                    provide: GLOBAL_TOKEN,
                    useValue: GLOBAL_TOKEN_VALUE
                }
            ]
        })
        .compileComponents();
    });

    it('should create the services via injectPrivate function', () => {
        const myComponent = TestBed.createComponent(MyComponent);
        const myComponentInstance = myComponent.componentRef.instance;

        expect(myComponentInstance).toBeTruthy();
        expect(myComponentInstance.myService).toBeTruthy();
    });
});
