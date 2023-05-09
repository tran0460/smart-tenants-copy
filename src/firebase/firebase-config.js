import { initializeApp } from "firebase/app";
import {
	initializeFirestore,
	enableIndexedDbPersistence,
} from "firebase/firestore";
import {
	getAuth,
	setPersistence,
	browserLocalPersistence,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
const firebaseConfig = {
	apiKey: `${process.env.REACT_APP_APP_API_KEY}`,
	authDomain: `${process.env.REACT_APP_AUTH_DOMAIN}`,
	projectId: `${process.env.REACT_APP_PROJECT_ID}`,
	storageBucket: `${process.env.REACT_APP_STORAGE_BUCKET}`,
	messagingSenderId: `${process.env.REACT_APP_MESSAGING_SENDER_ID}`,
	appId: `${process.env.REACT_APP_APP_ID}`,
	measurementId: `${process.env.REACT_APP_MEASUREMENT_ID}`,
	databaseURL: `${process.env.REACT_APP_DATABASE_URL}`,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, { chacheSizeBytes: 100 * 1000000 });
const auth = getAuth(app);
const storage = getStorage(app);
const functions = getFunctions(app);
const database = getDatabase(app);

export { app, db, auth, storage, functions, database };
(async () => {
	await setPersistence(auth, browserLocalPersistence);
})();
//Enable caching
enableIndexedDbPersistence(db).catch((err) => {
	if (err.code === "failed-precondition") {
		// Multiple tabs open, persistence can only be enabled
		// in one tab at a a time.
		// ...
	} else if (err.code === "unimplemented") {
		// The current browser does not support all of the
		// features required to enable persistence
		// ...
	}
});
