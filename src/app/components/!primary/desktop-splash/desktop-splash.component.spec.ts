import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopSplashComponent } from './desktop-splash.component';

describe('DesktopSplashComponent', () => {
  let component: DesktopSplashComponent;
  let fixture: ComponentFixture<DesktopSplashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DesktopSplashComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesktopSplashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
