import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarIconComponent } from './navbar-icon.component';

describe('NavbarIconComponent', () => {
  let component: NavbarIconComponent;
  let fixture: ComponentFixture<NavbarIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
