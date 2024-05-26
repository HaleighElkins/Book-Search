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

// Saving book to users book list
export const SAVE_BOOK = gql `
    mutation SaveBook ($bookId: ID){
        saveBook(bookId: $bookId) {
            _id
            savedBooks {
                bookId
                authors
                description
                title
                image
                link
            }
        }
    }
`;

// Removing a book from users book list
export const REMOVE_BOOK = gql `
    mutation RemoveBook($bookId: ID!){
        removeBook(bookId; $bookId) {
            _id
            savedBooks {
                bookId
            }
        }
    }
`;