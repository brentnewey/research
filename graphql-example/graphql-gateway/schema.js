export const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    authorId: ID!
    author: User!
    createdAt: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    posts: [Post!]!
    post(id: ID!): Post
    postsByAuthor(authorId: ID!): [Post!]!
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int!): User!
    createPost(title: String!, content: String!, authorId: ID!): Post!
  }
`;