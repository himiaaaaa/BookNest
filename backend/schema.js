const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  type Token {
    value: String!
  }
  type Auth {
    user: User
    token: Token
  }
  type Author {
    name: String!
    id: ID!
    born: String
    bookCount: Int
  }
  type Book {
    title: String!
    published: String!
    author: Author!
    id: ID!
    genres: [String!]!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genres: String): [Book!]!
    allAuthors: [Author!]!
    allUsers: [User!]!
    me: User
  }
  type Mutation {
    addBook(
      title: String!
      author: String!
      published:String!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      born: String!
    ): Author
    createUser(
      username: String!
      password: String!
      favoriteGenre: String!
    ): Auth
    login(
      username: String!
      password: String!
    ): Token
  }
  type Subscription {
    bookAdded: Book!
  }

`

module.exports = typeDefs