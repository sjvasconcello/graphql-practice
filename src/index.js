const {
  ApolloServer,
  gql,
} = require('apollo-server');

const typeDefs = gql`
  type Query {
    hello(name: String): String!
    user: User
  }

  type User {
    id: ID!
    username: String!
    firstLetterOrUsername: String!
  }

  type Error {
    field: String!
    message: String!
  }

  type RegisterResponse {
    user: User
    errors: [Error]
  }

  input UserInfo {
    username: String!, 
    password: String!, 
    age: Int
  }

  type Mutation {
    register(userInfo: UserInfo!): RegisterResponse!
    login(userInfo: UserInfo!): String!
}
`;

const resolvers = {
  User: {
    // username: parent => parent.username,
    firstLetterOrUsername: parent => parent.username[0],
  },
  Query: {
    hello: (parent, {
      name,
    }) => `Hello! ${name}`,
    user: () => ({
      id: 3,
      username: 'Michael',
    }),
  },
  Mutation: {
    login: async (parent, { userInfo: { username } }, context, info) => {
      // Check the password
      // await checkPassword(password)
      return username;
    },
    register: () => ({
      errors: [{
        field: 'username1',
        message: 'bad',
      },
      {
        field: 'username2',
        message: 'bad2',
      },
      ],
      user: {
        id: 1,
        username: 'Michael',
      },
    }),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res }),
});

server.listen().then(({
  url,
// eslint-disable-next-line no-console
}) => console.log(`server started at ${url}`));
