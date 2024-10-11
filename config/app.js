
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./db.js";
import dotenv from "dotenv";

import userRoutes from "../routes/userRoutes.js";
import bookRoutes from "../routes/bookRoutes.js";
import borrowRoutes from "../routes/borrowRoutes.js";
import reportRoutes from "../routes/reportRoutes.js";

import { ApolloServer } from "apollo-server-express";
import typeDefs from "../graphql/typeDefs.js";  
import {resolvers} from "../graphql/resolvers.js";  
import { verifyToken } from "./jwtService.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);
app.use("/api/reports", reportRoutes);


const context = ({ req }) => {
  console.log("Cookies:", req.cookies); 
  const token = req.cookies?.access_token || "";
  console.log("Token:", token); 

  if (token) {
    try {
      const user=verifyToken(token)
      
      req.user = user; 
      console.log("Authenticated user:", req.user);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        console.error("Token expired:", err);
        throw new Error("Token expired");
      }
      console.error("Invalid token:", err);
      throw new Error("Unauthorized");
    }
  }

  return { req, user: req.user }; 
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

const startServer = async () => {
  try {
    await server.start(); 
    server.applyMiddleware({ app });
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`);
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

startServer();

export default app;

