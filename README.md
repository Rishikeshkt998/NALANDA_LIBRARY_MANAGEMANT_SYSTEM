# Nalanda Library Management System

**Nalanda** is an advanced library management platform designed to simplify the process of borrowing and returning books, maintaining borrowing records, and managing library resources. This system offers both REST and GraphQL APIs, providing flexibility in interacting with the system. The application also includes JWT-based authentication and authorization for secure user access.

## Key Features

- **User Registration and Login**: Secure user authentication with JWT for account creation and access control.
- **Book Management**: Full CRUD capabilities to manage library books.
- **Borrowing and Returning Books**: Users can borrow or return books, with complete tracking of borrowing history.
- **Top Borrowed Books**: Fetch a list of the most borrowed books using MongoDB aggregation operations.
- **GraphQL Support**: Comprehensive GraphQL API for querying and mutating data related to users, books, and borrowing activities.

## Technologies Stack

- **Backend**: Built with Node.js and Express.js, featuring Apollo Server for GraphQL implementation.
- **Database**: MongoDB with Mongoose for schema design and database management.
- **Authentication**: JSON Web Tokens (JWT) for secure user authentication and authorization.
- **API Testing**: Postman utilized for testing both RESTful and GraphQL APIs.

## API Overview

### REST API Endpoints

| Method | Endpoint                       | Functionality                                  |
|--------|---------------------------------|------------------------------------------------|
| `POST` | `/api/users/signup`             | Register a new user                            |
| `POST` | `/api/users/login`              | Log in an existing user                        |
| `GET`  | `/api/books`                    | Retrieve a list of all available books         |
| `POST` | `/api/books/addbook`            | Add a new book to the library                  |
| `PUT`  | `/api/books/updatebook/:id`     | Update details of a book by its ID             |
| `DELETE` | `/api/books/deletebook/:id`   | Remove a book from the library by its ID       |
| `POST` | `/api/borrow/borrowbook`        | Borrow a book                                  |
| `PUT`  | `/api/borrow/returnbook`        | Return a previously borrowed book              |
| `GET`  | `/api/borrow/borrowhistory`     | Retrieve borrow history                        |
| `GET`  | `/api/report/mostborrowed`      | Retrieve most borrowed books details           |
| `GET`  | `/api/report/activemembers`     | Return active members of the book              |
| `GET`  | `/api/report/bookavailability`  | Retrieve availability of books                 |

