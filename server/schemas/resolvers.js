// This file serves as the functionality for our CRUD
const { User } = require('../models');
const { signToken } = require('../utils/auth');

// resolvers is just a fancy object that holds properties that run our queries / mutations
const resolvers = {
    // Query: {
    //     // get one User
    // },

    // Mutation: {
    //     // create one User
    //     // save book | updates User books property
    //     // delete book | delete one from User books property
    // }
};
// somewhere in resolvers, we will need to do User Authentication

module.exports = resolvers;