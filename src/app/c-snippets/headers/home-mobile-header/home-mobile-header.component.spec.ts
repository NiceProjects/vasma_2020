import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeMobileHeaderComponent } from './home-mobile-header.component';

describe('HomeMobileHeaderComponent', () => {
  let component: HomeMobileHeaderComponent;
  let fixture: ComponentFixture<HomeMobileHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeMobileHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeMobileHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
