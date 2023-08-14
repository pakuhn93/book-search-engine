// This file is to write out the Queries that will be executed by GraphQL
// The code that goes here is basically the same as what goes into the Apollo Client when running queries through the GraphQL endpoint.
// the coding convention in this file should be ALL_CAPS and their names should resemble their function.


import { gql } from '@apollo/client';

export const GET_ME = gql`
    query Query {
        me {
        _id
        username
        email
        password
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