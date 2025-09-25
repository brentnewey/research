# GraphQL Microservices Example

A complete example of GraphQL federation with microservices using Node.js, featuring users and posts services.

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   GraphQL       │    │   Users Service  │    │  Posts Service  │
│   Gateway       │◄──►│   (Port 3001)    │    │  (Port 3002)    │
│   (Port 4000)   │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         ▲
         │
         ▼
┌─────────────────┐
│   Test Client   │
│                 │
└─────────────────┘
```

## Services

### Users Service (Port 3001)
- Manages user data (id, name, email, age)
- REST API endpoints:
  - `GET /users` - Get all users
  - `GET /users/:id` - Get specific user
  - `POST /users` - Create new user

### Posts Service (Port 3002)
- Manages post data (id, title, content, authorId, createdAt)
- REST API endpoints:
  - `GET /posts` - Get all posts
  - `GET /posts/:id` - Get specific post
  - `GET /posts?authorId=:id` - Get posts by author
  - `POST /posts` - Create new post

### GraphQL Gateway (Port 4000)
- Unified GraphQL API
- Federates data from both microservices
- Supports queries and mutations
- Available at: http://localhost:4000/graphql

## Quick Start

1. **Install dependencies for all services:**
   ```bash
   npm run install:all
   ```

2. **Start all services in development mode:**
   ```bash
   npm run dev
   ```

3. **Test the GraphQL API:**
   ```bash
   cd client && npm run test-queries
   ```

## Manual Testing

### Start Services Individually

```bash
# Terminal 1 - Users Service
npm run start:users

# Terminal 2 - Posts Service
npm run start:posts

# Terminal 3 - GraphQL Gateway
npm run start:gateway
```

### GraphQL Playground

Visit http://localhost:4000/graphql to access the GraphQL Playground.

### Example Queries

**Get all users with their posts:**
```graphql
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
```

**Get specific post with author:**
```graphql
query GetPost($id: ID!) {
  post(id: $id) {
    id
    title
    content
    author {
      name
      email
    }
    createdAt
  }
}
```

**Create new user:**
```graphql
mutation CreateUser($name: String!, $email: String!, $age: Int!) {
  createUser(name: $name, email: $email, age: $age) {
    id
    name
    email
    age
  }
}
```

**Create new post:**
```graphql
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
```

## Schema

The GraphQL schema includes:
- **User**: id, name, email, age, posts (relationship)
- **Post**: id, title, content, authorId, author (relationship), createdAt
- **Queries**: users, user(id), posts, post(id), postsByAuthor(authorId)
- **Mutations**: createUser, createPost

## Features

- ✅ Microservices architecture
- ✅ GraphQL federation
- ✅ Cross-service relationships
- ✅ Query optimization
- ✅ Mutations support
- ✅ Error handling
- ✅ CORS enabled
- ✅ Test client included