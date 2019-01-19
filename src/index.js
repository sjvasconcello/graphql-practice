const {
  ApolloServer,
  gql,
  PubSub
} = require('apollo-server');

const typeDefs = gql`
  type Query {
    hello(name: String): String!
    user: User
  }

  type User {
    id: ID!
    username: String
    firstLetterOrUsername: String
  }

  type Error {
    field: String!
    message: String!
  }

  type RegisterResponse {
    user: User
    errors: [Error!]!
  }

  input UserInfo {
    username: String!
    password: String! 
    age: Int
  }

  type Mutation {
    register(userInfo: UserInfo!): RegisterResponse!
    login(userInfo: UserInfo!): String!
}

  type Subcription {
    newUser: User!
  }

`;

const NEW_USER = "NEW_USER";

const resolvers = {
  Subcription: {
    newUser: {
     subcribe: (_, __, { pubsub }) => pubsub.asyncIterator(NEW_USER)
    }
  },
  User: {
    firstLetterOrUsername: parent => {
      return parent.username ? parent.username[0] : null;
    }
  },
  Query: {
    hello: (parent, { name }) => `Hello! ${name}`,
    user: () => ({
      id: 3,
      username: 'Michael',
    }),
  },
  Mutation: {
    login: async (parent, { userInfo: { username } }, context) => {
      // Check the password
      // await checkPassword(password)
      return username;
    },
    register: (_, { userInfo: { username } }, {pubsub}) => {

      const user = {
        id: 1,
        username
      }


      pubsub.publish(NEW_USER,{
        newUser: user
      });

      return {
        errors: [
          {
            field: 'username1',
            message: 'bad',
          },
          {
            field: 'username2',
            message: 'bad2',
          },
        ],
        user
      };
    }
  }
};

const pubsub = new PubSub()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res, pubsub }),
});

server.listen().then(({
  url,
// eslint-disable-next-line no-console
}) => console.log(`server started at ${url}`));
