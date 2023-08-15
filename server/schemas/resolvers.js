// This file serves as the functionality for our CRUD
const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

// resolvers is just a fancy object that holds properties that run our queries / mutations
const resolvers = {
    Query: {
        // get one User | instructions specify to call this 'me'
        me: async (parent, args, context) => {
            // we define our context at the start of our server through expressMiddleware, which then goes to our auth.js (server-side)
            // in these cases, we're authenticating our Users
            if (context.user){
                const userData = await User.findOne({ _id: context.user._id });

                return userData;
            }
            // throw an Auth error if the above condtional is false
            throw AuthenticationError;
        }
    },

    Mutation: {
        // create one User
        // always need to put parent as the first argument with our resolver functions
        addUser: async (parent, args) => {
            console.log('MY ARGS', args);
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },

        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email }); // need to send as an object when using findOne()

            // check if user exists
            if(!user){ throw AuthenticationError };

            // check if correct password
            const correctPass = await user.isCorrectPasssword(password);
            if(!correctPass){ throw AuthenticationError };

            // assign a session token to the user
            const token = signToken(user);
            return { token, user };
        },

        // save book | updates User books property
        saveBook: async (parent, args, context) => {
            if(context.user){
                const updatedUser = await User.findByIdAndUpdate(
                      { // 1st parameter is for the User's _id property, to find the right user to put the book into
                        _id: context.user._id
                      }, // push the new book into the savedBooks property on the User model
                      { $push: { savedBooks: args }},
                      // the 'new' property ensures that the user is returned the new, updated, data, rather than the old data
                      { new: true }
                    );
                return updatedUser;
            }
            // if our conditional above isn't true, throw an Auth error
            throw AuthenticationError;
        },

        // delete book | delete one from User books property
        removeBook: async (parent, { bookId }, context) => {
            if(context.user){
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: {bookId }}},
                    { new: true }
                );
                return updatedUser;
            }
            throw AuthenticationError;
        }
    }
};

module.exports = resolvers;