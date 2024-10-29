import * as admin from "firebase-admin";
import { UserImportRecord } from "firebase-admin/auth";
import * as functions from "firebase-functions";
const { v4: uuidv4 } = require('uuid');  
const bcrypt = require('bcrypt');
// init
admin.initializeApp();

const hashPassword = async (password: string) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

export const extractBearer = (req: any) => {
  if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")) {
    functions.logger.log("Found \"Authorization\" header");
    // Read the ID Token from the Authorization header.
    return req.headers.authorization.split("Bearer ")[1];
  }
  return null;
};

export const getCurrentUser = async (token: string) => {
  return await admin.auth().verifyIdToken(token);
};

export const checkIsAdmin = async (token: string) => {
  let user = null;
  try {
    user = await getCurrentUser(token);
  } catch (e) {
    user = null;
  }

  if (!user) return null;

  return user?.role === "admin";
};


export const createUser = async (data: any) => {
  try {
    const user = await admin.auth().createUser({
      email: data.email,
      emailVerified: true,
      password: data.password,
      phoneNumber: "+91"+data.phoneNumber.toString(),
      disabled: false,
    });
    return {
      success: true, user,
    };
  } catch (error: any) {
    if (error.errorInfo) {
      return {...error.errorInfo, success: false};
    } else {
      return {response: "something went wrong", success: false};
    }
  }
};

export const roleUpdate = (uid: string, customClaims: {role:string}) => {
  try {
    admin.auth().setCustomUserClaims(uid, customClaims);
    return true;
  } catch (e) {
    return null;
  }
};

const userExistsByEmail = async (email: string) => {
  try {
    await admin.auth().getUserByEmail(email);
    return true;
  } catch (error) {
    return false
  }
};

// Function to check if users exist and separate new users
const checkExistingUsers = async (users: any[]) => {
  const existingUsers = [];
  const newUsers = [];

  for (const user of users) {
    const exists = await userExistsByEmail(user.email);
    if (exists) {
      existingUsers.push(user);
    } else {
      newUsers.push(user);
    }
  }

  return { existingUsers, newUsers };
};

export const createBulkUsers = async (users: any[]) => {
      const usersFormatted: UserImportRecord[] = await Promise.all(users.map(async(user) => {
      const hash = await hashPassword(user['LOGIN PW'].toString());
        return {
          uid: uuidv4(),
          email: `${user['CARD NO'].toString()}@gmail.com`,
          emailVerified: true,
          phoneNumber: user['MOB NO'] ? `+91${user['MOB NO'].toString()}` : "",
          disabled: false,
          displayName: user['NAME'],
          passwordHash: Buffer.from(hash, 'utf-8'),
        }
  }))


  const { existingUsers, newUsers } = await checkExistingUsers(usersFormatted);

  try{
    const successfulImports:any[] = [];
    const failedImports:any[] = [];

    const results = await admin.auth().importUsers(newUsers, {
      hash: {
        algorithm: 'BCRYPT',
      },
    });

     results.errors.forEach(err => {
       failedImports.push({
         index: err.index,
         reason: err.error.message
       });
     });

     newUsers.forEach((user, index) => {
       if (!results.errors.find(e => e.index === index)) {
         successfulImports.push({uid: user.uid, email: user.email, name: user.displayName, phone: user.phoneNumber });
       }
     });

     const dataToReturn = {
      successfulImports,
      failedImports,
      existingUsers: existingUsers.map(user => user.email),
     }

     return {response:dataToReturn, success: true};
  } catch(e) {
    return {response: "failed", success: false};
  }
 
}
