import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewerLayout } from './interviewer-layout';

describe('InterviewerLayout', () => {
  let component: InterviewerLayout;
  let fixture: ComponentFixture<InterviewerLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewerLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewerLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
