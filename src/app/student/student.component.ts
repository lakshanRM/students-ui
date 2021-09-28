import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { NotificationService } from '@progress/kendo-angular-notification';
import { State } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StudentService } from '../services/student.service';
import { WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit {
  public gridItems: GridDataResult;
  public formGroup: FormGroup;
  private editedRowIndex: number;
  sub$ = new Subject();
  pipe = new DatePipe('en-US'); // Use your own locale
  isConfirmActive = false;
  selectdStudent: any;

  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10,
  };

  constructor(
    private studentService: StudentService,
    private notificationService: NotificationService,
    private socketService: WebsocketService
  ) {}

  ngOnInit(): void {
    this.getStudents();

    this.socketService
      .getMessage()
      .pipe(takeUntil(this.sub$))
      .subscribe((res) => {
        this.showNotification(`Students screation completed.`, 'success');
        this.getStudents();
      });
  }

  pageChange(event: PageChangeEvent): void {
    this.gridState.skip = event.skip;
    this.getStudents();
  }

  getStudents() {
    this.studentService
      .getAllStudents()
      .pipe(takeUntil(this.sub$))
      .subscribe((result: any) => {
        this.gridItems = {
          data: result.data.students.slice(
            this.gridState.skip,
            this.gridState.skip + this.gridState.take
          ),
          total: result.data.students.length,
        };
      });
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      firstname: new FormControl(dataItem.firstname, Validators.required),
      lastname: new FormControl(dataItem.lastname, Validators.required),
      email: new FormControl(dataItem.email, [
        Validators.required,
        Validators.email,
      ]),
      dob: new FormControl(new Date(dataItem.dob), Validators.required),
    });

    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.formGroup, dataItem);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, dataItem }) {
    const student = this.formatStudent(formGroup, dataItem);

    this.studentService
      .update(student)
      .pipe(takeUntil(this.sub$))
      .subscribe((res: any) => {
        if (
          res &&
          res.data &&
          res.data.updateStudent &&
          res.data.updateStudent.id
        ) {
          this.showNotification(`Student record has been updated.`, 'info');
          this.getStudents();
          sender.closeRow(rowIndex);
        } else {
          this.showNotification(
            `Something went worng, Please try agin later.`,
            'error'
          );
          sender.closeRow(rowIndex);
        }
      });
  }

  private formatStudent(formGroup: any, dataItem: any) {
    const student = formGroup.value;
    student.id = dataItem.id;
    student.age = this.studentService.getAge(student.dob);
    student.dob = this.pipe.transform(student.dob, 'M/d/YYYY');
    return student;
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  showNotification(msg, type) {
    this.notificationService.show({
      content: msg,
      cssClass: 'button-notification',
      width: 300,
      animation: { type: 'slide', duration: 800 },
      position: { horizontal: 'right', vertical: 'top' },
      type: { style: type, icon: true },
      hideAfter: 5000,
    });
  }

  removeHandler({ dataItem }) {
    this.selectdStudent = dataItem;
    this.isConfirmActive = true;
  }

  removeStudentRow(status) {
    if (status == 'confirm') {
      this.studentService
        .deleteStudent(this.selectdStudent)
        .pipe(takeUntil(this.sub$))
        .subscribe((res: any) => {
          if (
            res &&
            res.data &&
            res.data.removeStudent &&
            res.data.removeStudent.firstname
          ) {
            this.showNotification(`Student has been removed.`, 'info');
            this.getStudents();
          } else {
            this.showNotification(
              `Something went worng, Please try agin later.`,
              'error'
            );
          }
        });
    }
    this.selectdStudent = null;
    this.isConfirmActive = false;
  }

  ngOnDestroy() {
    this.sub$.next();
    this.sub$.complete();
  }
}
