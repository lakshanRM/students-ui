import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { NotificationService } from '@progress/kendo-angular-notification';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StudentService } from '../services/student.service';

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

  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10,
  };

  constructor(
    private studentService: StudentService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.getStudents();
  }

  pageChange(event: PageChangeEvent): void {
    this.gridState.skip = event.skip;
    this.getStudents();
  }

  public handleSortChange(descriptor: SortDescriptor[]): void {
    this.gridState.sort = descriptor;
    this.getStudents();
  }

  getStudents() {
    this.studentService
      .getAllStudents()
      .pipe(takeUntil(this.sub$))
      .subscribe((result: any) => {
        console.log('FROM API : ', result.data.students);

        this.gridItems = {
          data: result.data.students,
          total: result.data.students.length,
        };
      });
  }

  public onStateChange(state: State) {
    // this.gridState = state;
    // this.editService.read();
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      firstName: new FormControl(dataItem.firstName, Validators.required),
      lastName: new FormControl(dataItem.lastName, Validators.required),
      email: new FormControl(dataItem.email, Validators.required),
      dob: new FormControl(new Date(dataItem.dob), Validators.required),
    });

    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.formGroup, dataItem);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, dataItem }) {
    const student = formGroup.value;
    student.id = dataItem.id;
    student.age = this.studentService.getAge(dataItem.dob);
    student.dob = this.pipe.transform(dataItem.dob, 'M/d/YYYY');

    console.log('REQ :', student);

    this.studentService
      .update(student)
      .pipe(takeUntil(this.sub$))
      .subscribe((res) => {
        if (res) {
          this.showNotification();
          this.getStudents();
          sender.closeRow(rowIndex);
        }
      });
  }

  public removeHandler({ dataItem }) {
    this.studentService
      .deleteStudent(dataItem)
      .pipe(takeUntil(this.sub$))
      .subscribe((res) => {
        if (res) {
          this.getStudents();
        }
      });
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  showNotification() {
    this.notificationService.show({
      content: `Student record has been updated.`,
      cssClass: 'button-notification',
      width: 300,
      animation: { type: 'slide', duration: 800 },
      position: { horizontal: 'right', vertical: 'top' },
      type: { style: 'info', icon: true },
      hideAfter: 5000,
    });
  }

  ngOnDestroy() {
    this.sub$.next();
    this.sub$.complete();
  }
}
