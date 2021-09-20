import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { StudentService } from '../services/student.service';
import { Apollo, gql } from 'apollo-angular';
import { GET_STUDENTS } from './student.query';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit {
  public gridItems: GridDataResult;
  public formGroup: FormGroup;
  private editedRowIndex: number;

  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10,
  };

  constructor(private studentService: StudentService, private apollo: Apollo) {}

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
    this.apollo
      .watchQuery({
        query: GET_STUDENTS,
      })
      .valueChanges.subscribe((result: any) => {
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
      dob: new FormControl(0),
    });

    this.editedRowIndex = rowIndex;

    sender.editRow(rowIndex, this.formGroup);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }) {
    // // const product: Product = formGroup.value;
    // // this.editService.save(product, isNew);
    // sender.closeRow(rowIndex);
  }

  public removeHandler({ dataItem }) {
    // this.editService.remove(dataItem);
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }
}
