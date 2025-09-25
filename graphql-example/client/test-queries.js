import axios from 'axios';

const GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql';

async function executeQuery(query, variables = {}) {
  try {
    const response = await axios.post(GRAPHQL_ENDPOINT, {
      query,
      variables
    });
    return response.data;
  } catch (error) {
    console.error('GraphQL Error:', error.response?.data || error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Testing GraphQL API...\n');

  // Test 1: Fetch all users
  console.log('1. Fetching all users:');
  const usersQuery = `
    query GetUsers {
      users {
        id
        name
        email
        age
      }
    }
  `;
  const usersResult = await executeQuery(usersQuery);
  console.log(JSON.stringify(usersResult, null, 2));
  console.log('\n---\n');

  // Test 2: Fetch users with their posts
  console.log('2. Fetching users with their posts:');
  const usersWithPostsQuery = `
    query GetUsersWithPosts {
      users {
        id
        name
        email
        posts {
          id
          title
          content
          createdAt
        }
      }
    }
  `;
  const usersWithPostsResult = await executeQuery(usersWithPostsQuery);
  console.log(JSON.stringify(usersWithPostsResult, null, 2));
  console.log('\n---\n');

  // Test 3: Fetch specific post with author
  console.log('3. Fetching specific post with author:');
  const postQuery = `
    query GetPost($id: ID!) {
      post(id: $id) {
        id
        title
        content
        createdAt
        author {
          id
          name
          email
        }
      }
    }
  `;
  const postResult = await executeQuery(postQuery, { id: '1' });
  console.log(JSON.stringify(postResult, null, 2));
  console.log('\n---\n');

  // Test 4: Create new user
  console.log('4. Creating new user:');
  const createUserMutation = `
    mutation CreateUser($name: String!, $email: String!, $age: Int!) {
      createUser(name: $name, email: $email, age: $age) {
        id
        name
        email
        age
      }
    }
  `;
  const newUserResult = await executeQuery(createUserMutation, {
    name: 'Alice Wilson',
    email: 'alice@example.com',
    age: 28
  });
  console.log(JSON.stringify(newUserResult, null, 2));
  console.log('\n---\n');

  // Test 5: Create new post
  console.log('5. Creating new post:');
  const createPostMutation = `
    mutation CreatePost($title: String!, $content: String!, $authorId: ID!) {
      createPost(title: $title, content: $content, authorId: $authorId) {
        id
        title
        content
        author {
          name
        }
        createdAt
      }
    }
  `;
  const newPostResult = await executeQuery(createPostMutation, {
    title: 'My New Post',
    content: 'This is a test post created via GraphQL',
    authorId: '1'
  });
  console.log(JSON.stringify(newPostResult, null, 2));
  console.log('\n---\n');

  // Test 6: Fetch posts by specific author
  console.log('6. Fetching posts by specific author:');
  const postsByAuthorQuery = `
    query GetPostsByAuthor($authorId: ID!) {
      postsByAuthor(authorId: $authorId) {
        id
        title
        content
        createdAt
      }
    }
  `;
  const postsByAuthorResult = await executeQuery(postsByAuthorQuery, { authorId: '1' });
  console.log(JSON.stringify(postsByAuthorResult, null, 2));

  console.log('\n✅ All tests completed!');
}

runTests().catch(console.error);