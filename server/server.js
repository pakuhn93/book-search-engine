const express = require('express');
const path = require('path');
// const db = require('./config/connection');
// ^ moving above code to keep file structure neater
// const routes = require('./routes');
// ^ above code is for RESTful

// const app = express();
// const PORT = process.env.PORT || 3001;
// ^ moving two lines of code above here for neater file structure (server start after all imports)

// importing the necessary modules for our Apollo server
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { authMiddleware } = require('utils.auth'); // used for our User Auth

// importing the necessary files for use with GraphQL
const { typeDefs, resolvers } = require('./schemas'); // necessary files for GraphQL functionality
const db = require('./config/connection'); // our connection to Mongo

const PORT = process.env.PORT || 3001;

// start up the Apollo server, which uses our defined typeDefs and resolvers files that we imported earlier
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// start up the express server
const app = express();

// initialize our Apollo server with GraphQL
const startApolloServer = async () => {
  await server.start();

  // boiler-plate server stuff | remember, anything with "app" is utilizing express
  app.use(express.urlencoded({ extended: false })); // true value will constantly refresh our database with new values
  app.use(express.json());

  app.use('graphql', expressMiddleware(server, {
    context: authMiddleware // User Auth stuff
  }));

  // checking to see if we're in production vs development
  if (process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, '../client/dist'))); // using 'dist' instead of 'build'
    // I believe that the code below tells express to route each endpoint to our index. index.html is then altered via React
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  // wait for the database to load before running the server (the app.listen calls the server to open up and 'listen' to the user)
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}`);
      console.log(`Use GraphQL @ http://localhost:${PORT}/graphql`);
    });
  });
}

// ^ need to call the function above or the server won't run
startApolloServer();

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// ^ above code moved into startApolloServer()


// if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }
// ^ above code now nested in our startApolloServer() function


// app.use(routes);
// ^ above code is RESTful

// db.once('open', () => {
//   app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
// });
// ^ above code rewritten in startApolloServer()