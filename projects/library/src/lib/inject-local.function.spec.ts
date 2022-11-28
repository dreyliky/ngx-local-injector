import { Injectable, InjectionToken, Inject, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { injectLocal } from './inject-local.function';

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
    public readonly thirdService = injectLocal(ThirdDependService);

    public tst = 789;
}

@Injectable()
class MyService {
    public readonly firstService = injectLocal(FirstDependService);
    public readonly secondService = injectLocal(SecondDependService);
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

describe('injectLocal', () => {
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

    it('should create the services via injectLocal function', () => {
        const myComponent = TestBed.createComponent(MyComponent);
        const myComponentInstance = myComponent.componentRef.instance;

        expect(myComponentInstance).toBeTruthy();
        expect(myComponentInstance.myService).toBeTruthy();
    });
});
