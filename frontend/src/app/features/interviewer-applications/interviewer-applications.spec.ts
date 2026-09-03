import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewerApplications } from './interviewer-applications';

describe('InterviewerApplications', () => {
  let component: InterviewerApplications;
  let fixture: ComponentFixture<InterviewerApplications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewerApplications]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewerApplications);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
