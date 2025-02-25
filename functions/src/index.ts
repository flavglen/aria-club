/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from "firebase-functions";
import {checkIsAdmin, createBulkUsers, createUser, extractBearer} from "./utils";
import * as cors from "cors";
import * as _express from "express";
import {Request, Response} from "express";

const app = _express();
// Enable CORS using the `cors` middleware
app.use(cors({origin: true}));


app.post("/addUser", async (req: Request, res:Response) => {
  const token = extractBearer(req);
  const isAdmin = await checkIsAdmin(token);
  if (isAdmin === null) {
    res.status(403)
      .json({success: false, message: "Session Expired , please login again"});
    return;
  }

  if (isAdmin === true) {
    const result = await createUser(req.body) as any;
    if (!result.success) {
      res.status(400).json(result);
      return;
    }
    res.status(200).json(result);
  } else {
    res.status(403)
      .json({success: false, message: "Only admins can add users"});
  }
});

app.get("/changeRole", async (req: Request, res:Response) => {
  res.status(200).json({success: true});
});

app.post("/bulkUsers", async (req: Request, res:Response) => {
  const token = extractBearer(req);
  const isAdmin = await checkIsAdmin(token);

  if (!isAdmin) {
    res.status(403).json({success: false, message: "Only admins can add users"});
    return;
  }

  const result = await createBulkUsers(req.body) as any;
  if (!result.success) {
    res.status(400).json(result);
    return;
  }

  res.status(200).json(result);
});

// export const changeRole = functions.region("europe-west1")
//   .https.onRequest(async (_request, response) => {
//     await checkIsAdmin("ffff");
//     response.status(200).send("dd");
//   });

// export const saveUser = functions.region("europe-west1")
//   .https.onRequest(async(_request, response) => {
//     const token = extractBearer(_request)
//     const isAdmin = await checkIsAdmin(token);
//     if(isAdmin) {
//          response.status(200).send('dd');
//     } else {
//          response.status(403).send('ssssss');
//     }
//   });

// export const user = functions.https.onRequest(app);
export const user = functions.region("europe-west1").https.onRequest(app);

