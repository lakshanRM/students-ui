import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { NotificationService } from '@progress/kendo-angular-notification';
import { StudentService } from '../services/student.service';
import { StudentComponent } from './student.component';

describe('StudentComponent', () => {
  let component: StudentComponent;
  let fixture: ComponentFixture<StudentComponent>;

  beforeEach(() => {
    const notificationServiceStub = () => ({ show: object => ({}) });
    const studentServiceStub = () => ({
      getAllStudents: () => ({ pipe: () => ({ subscribe: f => f({}) }) }),
      update: student => ({ pipe: () => ({ subscribe: f => f({}) }) }),
      getAge: dob => ({}),
      deleteStudent: selectdStudent => ({
        pipe: () => ({ subscribe: f => f({}) })
      })
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [StudentComponent],
      providers: [
        { provide: NotificationService, useFactory: notificationServiceStub },
        { provide: StudentService, useFactory: studentServiceStub }
      ]
    });
    fixture = TestBed.createComponent(StudentComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`isConfirmActive has default value`, () => {
    expect(component.isConfirmActive).toEqual(false);
  });

  describe('pageChange', () => {
    it('makes expected calls', () => {
      const pageChangeEventStub: PageChangeEvent = <any>{};
      spyOn(component, 'getStudents').and.callThrough();
      component.pageChange(pageChangeEventStub);
      expect(component.getStudents).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getStudents').and.callThrough();
      component.ngOnInit();
      expect(component.getStudents).toHaveBeenCalled();
    });
  });

  describe('getStudents', () => {
    it('makes expected calls', () => {
      const studentServiceStub: StudentService = fixture.debugElement.injector.get(
        StudentService
      );
      spyOn(studentServiceStub, 'getAllStudents').and.callThrough();
      component.getStudents();
      expect(studentServiceStub.getAllStudents).toHaveBeenCalled();
    });
  });
});
