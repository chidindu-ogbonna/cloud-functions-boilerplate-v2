import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import business from "./api/business";
import experiences from "./api/experiences";


if (!admin.apps.length) admin.initializeApp();

exports.business = functions.https.onRequest(business);
exports.experiences = functions.https.onRequest(experiences);
