import { gql } from 'apollo-angular';

export const GET_STUDENTS = gql`
  {
    students {
      id
      firstName
      lastName
      email
      dob
      age
    }
  }
`;
