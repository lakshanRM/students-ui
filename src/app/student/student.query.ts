import { gql } from 'apollo-angular';

export const GET_STUDENTS = gql`
  {
    students {
      id
      firstname
      lastname
      email
      dob
      age
    }
  }
`;
