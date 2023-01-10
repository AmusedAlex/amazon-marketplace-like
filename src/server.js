import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import productsRouter from "./api/products/index.js";
import {
  badRequestHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./errorHandlers.js";
import { join } from "path";

const server = express();

const port = process.env.PORT;

const publicFolderPath = join(process.cwd(), "./public");

// ************************************** CORS *******************

/* CROSS-ORIGIN RESOURCE SHARING
Cross-Origin Requests:
1. FE=http://localhost:3000 and BE=http://localhost:3001 <-- 2 different port numbers they are 2 different origins
2. FE=https://myfe.com and BE=https://mybe.com <-- 2 different domains they are 2 different origins
3. FE=https://domain.com and BE=http://domain.com <-- 2 different protocols they are 2 different origins
*/

// ***************************************************************

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

const corsOpts = {
  origin: (origin, corsNext) => {
    console.log("CURRENT ORIGIN: ", origin);
    if (!origin || whitelist.indexOf(origin) !== -1) {
      // If current origin is in the whitelist you can move on
      corsNext(null, true);
    } else {
      // If it is not --> error
      corsNext(
        createHttpError(400, `Origin ${origin} is not in the whitelist!`)
      );
    }
  },
};

server.use(express.static(publicFolderPath));
server.use(cors(corsOpts));

server.use(cors());
server.use(express.json());

server.use("/products", productsRouter);

server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is running on port ${port}`);
});
