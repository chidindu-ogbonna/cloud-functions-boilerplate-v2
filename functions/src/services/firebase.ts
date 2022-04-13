import * as admin from "firebase-admin";
// import * as serviceAccount from "../../config/service-account.json";

// if (!admin.apps.length) {

// admin.initializeApp({
//   credential: admin.credential.cert({
//     clientEmail: serviceAccount.client_email,
//     privateKey: serviceAccount.private_key,
//     projectId: serviceAccount.project_id,
//   }),
// });
// }

if (!admin.apps.length) admin.initializeApp();

export const db = admin.firestore();
export const auth = admin.auth();
