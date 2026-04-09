import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteComponent } from './quote';

describe('QuoteComponent', () => {
  let component: QuoteComponent;
  let fixture: ComponentFixture<QuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Quote],
    }).compileComponents();

    fixture = TestBed.createComponent(Quote);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
