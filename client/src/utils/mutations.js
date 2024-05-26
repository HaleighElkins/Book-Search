import { gql } from '@apollo/client';

// Mutation for logging in a user
export const LOGIN_USER = gql `
    mutation LoginUser($email: String!, $password: String!) {
        loginUser (email: $email, password: $passowrd) {
            token
            user {
                _id
                email
            }
        }
`;

// New user
export const ADD_USER = gql`
    mutation AddUser($username: String!, $email: String!, $password: STring! ){
        addUser(username: $username, email:$email, password: $password){
            taken
            user {
                _id
                username
                email
            }
        }
    }
`;


