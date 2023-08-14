// This file is to write out the Mutations that will be executed through GraphQL
// The code that goes here is basically the same as what goes into the Apollo Client when running queries through the GraphQL endpoint.
// the coding convention in this file should be ALL_CAPS and their names should resemble their function.

import { gql } from '@apollo/client';

// use our login resolver from the back-end
export const LOGIN_USER = gql`
    mutation Mutation($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;

// create a user
export const ADD_USER = gql`
    mutation Mutation($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;

// save a book to a User
export const SAVE_BOOK = gql`
    mutation Mutation($description: String!, $title: String!, $bookId: String!) {
        saveBook(description: $description, title: $title, bookId: $bookId) {
            _id
            username
            email
            savedBooks {
                bookId
                authors
                description
                image
                link
                title
            }
        }
    }
`;

// delete a book that a User has in their savedBooks array
export const REMOVE_BOOK = gql`
    mutation Mutation($bookId: String!) {
        removeBook(bookId: $bookId) {
            _id
            username
            email
            savedBooks {
                bookId
                authors
                description
                image
                link
                title
            }
        }
    }
`;