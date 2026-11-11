import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardCardContent } from './dashboard-card-content';

describe('DashboardCardContent', () => {
  let component: DashboardCardContent;
  let fixture: ComponentFixture<DashboardCardContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCardContent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardCardContent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
