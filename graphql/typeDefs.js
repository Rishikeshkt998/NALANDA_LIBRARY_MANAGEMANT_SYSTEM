import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    books: [ID!] # List of borrowed book IDs
  }
  type Book {
    id: ID!
    title: String!
    author: String!
    ISBN: String!
    publicationDate: String!
    genre: String!
    copies: Int!
  }
  type Borrow {
    id: ID!
    bookId: Book!
    userId: User!
    borrowDate: String!
    returnedDate: String
  }

  type BorrowHistory {
    borrowId: ID!
    user: User!
    borrowDate: String!
    returnedDate: String
  }
  type MostBorrowedBook {
    bookId: Book!
    count: Int!
  }
  type ActiveMember {
    userId: User!
    count: Int!
  }
  type AvailableBook {
    title: String!
    copies: Int!
  }
  type AuthResponse {
    message: String!
    user: User!
    token: String!
  }
  type AddBookResponse {
  message: String!
  book: Book
  }
  type BookListResponse {
  books: [Book!]!
  currentPage: Int!
  totalPages: Int!
  totalBooks: Int!
}
  type Query {
    getUsers: [User]
    getUser(id: ID!): User
    listBooks(title: String, author: String, genre: String, page: Int, limit: Int): BookListResponse!
    mostBorrowedBooks: [MostBorrowedBook!]!
    activeMembers: [ActiveMember!]!
    availableBooks: [AvailableBook!]!
    borrowHistory: [BorrowHistory!]!
  }

  type Mutation {
    userSignup(name: String!, email: String!, password: String!, role: String!): AuthResponse!
    userLogin(email: String!, password: String!): AuthResponse!
    addBook(input: AddBookInput!): AddBookResponse!
    updateBook(id: ID!, input: UpdateBookInput!): Book!
    deleteBook(id: ID!): String!
    borrowBook(input: BorrowBookInput!): String!
    returnBook(borrowId: ID!): String!
  }

  input AddBookInput {
    title: String!
    author: String!
    ISBN: String!
    publicationDate: String!
    genre: String!
    copies: Int!
  }


  input UpdateBookInput {
    title: String
    author: String
    ISBN: String
    publicationDate: String
    genre: String
    copies: Int
  }

  input BorrowBookInput {
    bookId: ID!
  }


  schema {
    query: Query
    mutation: Mutation
  }
`;

export default typeDefs;