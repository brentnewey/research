import axios from 'axios';

const USERS_SERVICE_URL = 'http://localhost:3001';
const POSTS_SERVICE_URL = 'http://localhost:3002';

export const resolvers = {
  Query: {
    users: async () => {
      try {
        const response = await axios.get(`${USERS_SERVICE_URL}/users`);
        return response.data;
      } catch (error) {
        throw new Error('Failed to fetch users');
      }
    },

    user: async (_, { id }) => {
      try {
        const response = await axios.get(`${USERS_SERVICE_URL}/users/${id}`);
        return response.data;
      } catch (error) {
        throw new Error('User not found');
      }
    },

    posts: async () => {
      try {
        const response = await axios.get(`${POSTS_SERVICE_URL}/posts`);
        return response.data;
      } catch (error) {
        throw new Error('Failed to fetch posts');
      }
    },

    post: async (_, { id }) => {
      try {
        const response = await axios.get(`${POSTS_SERVICE_URL}/posts/${id}`);
        return response.data;
      } catch (error) {
        throw new Error('Post not found');
      }
    },

    postsByAuthor: async (_, { authorId }) => {
      try {
        const response = await axios.get(`${POSTS_SERVICE_URL}/posts?authorId=${authorId}`);
        return response.data;
      } catch (error) {
        throw new Error('Failed to fetch posts by author');
      }
    }
  },

  Mutation: {
    createUser: async (_, { name, email, age }) => {
      try {
        const response = await axios.post(`${USERS_SERVICE_URL}/users`, {
          name,
          email,
          age
        });
        return response.data;
      } catch (error) {
        throw new Error('Failed to create user');
      }
    },

    createPost: async (_, { title, content, authorId }) => {
      try {
        const response = await axios.post(`${POSTS_SERVICE_URL}/posts`, {
          title,
          content,
          authorId
        });
        return response.data;
      } catch (error) {
        throw new Error('Failed to create post');
      }
    }
  },

  User: {
    posts: async (parent) => {
      try {
        const response = await axios.get(`${POSTS_SERVICE_URL}/posts?authorId=${parent.id}`);
        return response.data;
      } catch (error) {
        return [];
      }
    }
  },

  Post: {
    author: async (parent) => {
      try {
        const response = await axios.get(`${USERS_SERVICE_URL}/users/${parent.authorId}`);
        return response.data;
      } catch (error) {
        throw new Error('Author not found');
      }
    }
  }
};