import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { DataResult } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { GET_STUDENTS } from '../student/student.query';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private http: HttpClient, private apollo: Apollo) {}

  getAllStudents() {
    return this.apollo.watchQuery({
      query: GET_STUDENTS,
    }).valueChanges;
  }

  deleteStudent(student) {}
}
