import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Apollo, gql } from 'apollo-angular';
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

  update(updateStudent) {
    return this.apollo.mutate({
      mutation: gql`
        mutation {
          updateStudent(
            updateStudentInput: {
              firstname: \"${updateStudent.firstname}\"
              lastname: \"${updateStudent.lastname}\"
              email: \"${updateStudent.email}\"
              dob: \"${updateStudent.dob}\"
              id: ${updateStudent.id}
              age: ${updateStudent.age}
            }
          ) {
            id
            firstname
          }
        }
      `,
    });
  }

  deleteStudent(student) {
    return this.apollo.mutate({
      mutation: gql`
          mutation {
            removeStudent(id: ${student.id}) {
                firstname
            }
          }
        `,
      variables: { id: student.id },
    });
  }

  getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
