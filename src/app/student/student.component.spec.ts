import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { NotificationService } from '@progress/kendo-angular-notification';
import { StudentService } from '../services/student.service';
import { WebsocketService } from '../services/websocket.service';
import { StudentComponent } from './student.component';
import { FormControl, FormGroup } from '@angular/forms';

describe('StudentComponent', () => {
  let component: StudentComponent;
  let fixture: ComponentFixture<StudentComponent>;

  beforeEach(() => {
    const notificationServiceStub = () => ({ show: (object) => ({}) });
    const studentServiceStub = () => ({
      getAllStudents: () => ({ pipe: () => ({ subscribe: (f) => f({}) }) }),
      update: (student) => ({ pipe: () => ({ subscribe: (f) => f({}) }) }),
      getAge: (dob) => ({}),
      deleteStudent: (selectdStudent) => ({
        pipe: () => ({ subscribe: (f) => f({}) }),
      }),
    });
    const websocketServiceStub = () => ({
      getMessage: () => ({ pipe: () => ({ subscribe: (f) => f({}) }) }),
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [StudentComponent],
      providers: [
        { provide: NotificationService, useFactory: notificationServiceStub },
        { provide: StudentService, useFactory: studentServiceStub },
        { provide: WebsocketService, useFactory: websocketServiceStub },
      ],
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
      const websocketServiceStub: WebsocketService =
        fixture.debugElement.injector.get(WebsocketService);
      spyOn(component, 'getStudents').and.callThrough();
      spyOn(component, 'showNotification').and.callThrough();
      spyOn(websocketServiceStub, 'getMessage').and.callThrough();
      component.ngOnInit();
      expect(component.getStudents).toHaveBeenCalled();
      expect(component.showNotification).toHaveBeenCalled();
      expect(websocketServiceStub.getMessage).toHaveBeenCalled();
    });
  });

  describe('getStudents', () => {
    it('makes expected calls', () => {
      const studentServiceStub: StudentService =
        fixture.debugElement.injector.get(StudentService);
      spyOn(studentServiceStub, 'getAllStudents').and.callThrough();
      component.getStudents();
      expect(studentServiceStub.getAllStudents).toHaveBeenCalled();
    });
  });

  describe('removeHandler', () => {
    it(`should have assigned the correct values`, () => {
      component.selectdStudent = undefined;
      component.isConfirmActive = false;
      const dataItem = { dataItem: { id: 1 } };
      component.removeHandler(dataItem);
      expect(component.isConfirmActive).toBe(true);
      expect(component.selectdStudent.id).toBe(1);
    });
  });

  describe('closeEditor', () => {
    it(`should have assigned the correct values`, () => {
      component.editedRowIndex = 1;
      component.formGroup = new FormGroup({
        firstname: new FormControl(''),
      });
      let grid = { closeRow: (rowIndex) => {} };
      component.closeEditor(grid, 1);
      expect(component.editedRowIndex).toBe(undefined);
      expect(component.formGroup).toBe(undefined);
    });
  });

  describe('removeStudentRow', () => {
    it(`if status is not confirmed`, () => {
      component.selectdStudent = {};
      component.isConfirmActive = true;
      component.removeStudentRow('denided');
      expect(component.selectdStudent).toBe(null);
      expect(component.isConfirmActive).toBe(false);
    });

    it(`if status is not confirmed`, () => {
      component.selectdStudent = {};
      component.isConfirmActive = true;
      component.removeStudentRow('confirm');
      expect(component.selectdStudent).toBe(null);
      expect(component.isConfirmActive).toBe(false);
    });
  });

  describe('cancelHandler', () => {
    it(`shuld have changed the variable status`, () => {
      component.editedRowIndex = 1;
      component.formGroup = new FormGroup({
        firstname: new FormControl(''),
      });
      let grid = { closeRow: (rowIndex) => {} };
      component.cancelHandler({ sender: grid, rowIndex: 1 });
      expect(component.editedRowIndex).toBe(undefined);
      expect(component.formGroup).toBe(undefined);
    });
  });

  describe('showNotification', () => {
    it(`notificationService.show should have been called.`, () => {
      const notificationServiceStub: NotificationService =
        fixture.debugElement.injector.get(NotificationService);
      const notificationServiceSpy = spyOn(
        notificationServiceStub,
        'show'
      ).and.callThrough();
      component.showNotification('Alert', 'success');
      expect(notificationServiceSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('editHandler', () => {
    it(`to have been assigned corrct values`, () => {
      component.editedRowIndex = 0;
      const grid = { closeRow: (rowIndex) => {}, editRow: (rowIndex) => {} };
      const dataItemMock = {
        firstname: 'john',
        lastname: 'doe',
        email: 'johnd@gmail.com',
        dob: '12/12/2000',
      };
      const params = {
        sender: grid,
        rowIndex: 1,
        dataItem: dataItemMock,
      };

      component.editHandler(params);
      expect(component.editedRowIndex).toBe(1);
    });
  });

  describe('saveHandler', () => {
    it(`should have cerated the correct student object`, () => {
      const dummy = {
        firstname: 'john',
        lastname: 'doe',
        email: 'johnd@gmail.com',
        dob: '12/12/2000',
      };
      const formGroupMock = { value: dummy };
      const dataItemMock = dummy;

      const grid = { closeRow: (rowIndex) => {}, editRow: (rowIndex) => {} };
      const params = {
        sender: grid,
        rowIndex: 1,
        formGroup: formGroupMock,
        dataItem: dataItemMock,
      };
      component.saveHandler(params);
      expect(component.formatStudent).toHaveBeenCalledTimes(1);
    });
  });
});
