import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 GraphQL Gateway ready at: ${url}`);
console.log(`📊 GraphQL Playground available at: ${url}`);
console.log('\nExample queries:');
console.log('- Query all users: { users { id name email posts { title } } }');
console.log('- Query specific post: { post(id: "1") { title content author { name } } }');