import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { DataResult } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
import { of } from 'zen-observable';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private http: HttpClient, private apollo: Apollo) {}

  getAll(skip, pageSize, sortDescriptor): Observable<DataResult> {
    const url = environment.STUDENTS_URL;
    let res = {
      data: [],
      status: 'success',
    };
    return this.http.get(url).pipe(
      map((res: any) => {
        return {
          data: res.data,
          total: res.data.length,
        };
      })
    );
  }
}
