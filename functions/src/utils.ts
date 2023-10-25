import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
admin.initializeApp();

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

  if(!user) return null;
 
  return user?.role === "admin";
};


export const createUser = async  (data: any) => {
    try {
        const user = await admin.auth().createUser({
          email: data.email,
          emailVerified: true,
          password: data.password,
          phoneNumber: '+91'+data.phoneNumber.toString(),
          disabled: false,
        });
        return {
          success: true, user
        };
    } catch (error: any) {
        if(error.errorInfo)
            return {...error.errorInfo, success: false};
        else 
            return {response: 'something went wrong', success: false};
    }
}

export const roleUpdate = (uid: string, customClaims: {role:string}) => {
    try{
        admin.auth().setCustomUserClaims(uid, customClaims)
        return true;
    } catch(e) {
        return null;
    }
}
