import dotenv from 'dotenv';
import express from "express";
import cors from "cors";
import routes from "./routes.js";
import connection from "./database/index.js";

class App {
  constructor() {
    this.server = express();
    this.dotenv = dotenv.config();

    this.middlewares()
    this.routes();

    this.status500()

  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(cors());

    this.server.use((request, _response, next) => {
      const { method, url } = request;
    
      const logLabel = `[${method.toUpperCase()}] ${url}`;
    
      global.logger.info(logLabel);
      console.time(logLabel);
    
      next();
    
      console.timeEnd(logLabel);
    });
  }

  routes() {
    this.server.use(routes);
  }

  status500(){
    this.server.use((err, request, response, _next) => {
      if (err instanceof AppErrors) {
        global.logger.error(
          `${request.method} ${request.originalUrl} - ${err.message}`,
        );
        return response.status(err.statusCode).json({
          status: 'error',
          message: err.message,
        });
      }
    
      console.log(err);
    
      return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    });
  }
}

export default new App().server;
