const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");
const { Expo } = require("expo-server-sdk");
const { v4: uuidv4 } = require("uuid");
const firestore = require("@google-cloud/firestore");
const client = new firestore.v1.FirestoreAdminClient();
const { Storage } = require("@google-cloud/storage");
admin.initializeApp();

const storage = new Storage();
/*
	This is where firebase cloud functions are stored locally
	For more details about how to write cloud functions, see https://firebase.google.com/docs/functions
*/

// Takes an email and remove the authentication account associated with it.
exports.deleteUserByEmail = functions.https.onCall((data) => {
	let email = data.email;
	// Get the auth account
	return admin
		.auth()
		.getUserByEmail(email)
		.then((user) => {
			// Delete the auth account
			getAuth()
				.deleteUser(user.uid)
				.then(() => {
					return {
						message: `User deleted successfully!`,
					};
				})
				.catch((error) => {
					return {
						message: `An error occured while deleting user: ${error.message}`,
					};
				});
		})
		.catch((error) => {
			return {
				error: error.message,
				data: data.data.email,
			};
		});
});

// Takes 2 props, email and newEmail
// email is for finding the authentication account associated with that email, and newEmail is the new email for that account.
exports.changeEmail = functions.https.onCall((data) => {
	// Get the auth account
	return admin
		.auth()
		.getUserByEmail(data.email)
		.then((user) => {
			// Update the account email
			getAuth()
				.updateUser(user.uid, {
					email: data.newEmail,
				})
				.catch((error) => {
					return {
						message: `something went wrong, ${error.message}`,
					};
				});
		})
		.then(() => {
			return {
				message: `successfully updated user`,
			};
		});
});

//delete inactive users after 30 days
exports.tagInactiveUsers = functions.firestore
	.document("/Tenants/{id}")
	.onUpdate((change, context) => {
		let id = context.params.id;
		let time = Date.now();
		// If user is deactivated
		if (
			change.before.data().isActive === true &&
			change.after.data().isActive === false
		) {
			// Record the time when the user was deactivated
			admin
				.firestore()
				.collection("Tenants")
				.doc(`${id}`)
				.update({ inactiveTimestamp: time });
		}
		// If user is reactivated
		else if (
			change.before.data().isActive === false &&
			change.after.data().isActive === true
		) {
			// Remove the timestamp
			admin
				.firestore()
				.collection("Tenants")
				.doc(`${id}`)
				.update({ inactiveTimestamp: null });
		}
		return null;
	});

// Check the inactive timestamp of all deactivated users
exports.scheduledInactiveCheck = functions.pubsub
	.schedule("every 24 hours")
	.onRun(async (context) => {
		let currentDate = Date.now();
		let timeLimit = currentDate - 30 * 24 * 60 * 60 * 1000;
		await admin
			.firestore()
			.collection("Tenants")
			.where("isActive", "==", false)
			.get()
			.then((result) => {
				result.forEach(async (doc) => {
					let data = doc.data();
					// If timestamp is not valid, do nothing
					if (
						data.inactiveTimestamp > timeLimit ||
						data.inactiveTimestamp === undefined ||
						data.inactiveTimestamp === null
					)
						return;
					// Delete the user document
					await admin
						.firestore()
						.collection("Tenants")
						.doc(`${data.userID}`)
						.delete()
						.then((result) => {
							console.log("user data deleted " + data.firstName);
							// Delete the user authentication account
							getAuth()
								.deleteUser(data.userID)
								.then((result) => {
									console.log(result);
									return {
										message: `User deleted successfully!`,
									};
								})
								.catch((error) => {
									console.log(error);
									return {
										message: `An error occured while deleting user: ${error.message}`,
									};
								});
						})
						.catch((error) => {
							console.log(error);
						});
				});
			});
	});

// Send a notification to the mobile app
exports.sendPostDeclineNotification = functions.https.onCall(async (data) => {
	let userID = data.userID;
	let content = data.content;
	let postID = data.postID;
	console.log(userID);
	// Get the notification token belonging to the user
	await admin
		.firestore()
		.collection("ExpoPushTokens")
		.doc(`${userID}`)
		.get()
		.then(async (doc) => {
			let pushToken = doc.data().expoPushToken;
			let randomID = uuidv4();
			// Create notification document
			createNotificationItemInFirestore(
				userID,
				userID,
				postID,
				randomID,
				content
			);
			// Send notification to the user
			sendPushNotification(pushToken, "Post declined", content);
		});
});
// Send a notification to the mobile app
exports.sendPostDeleteNotification = functions.https.onCall(async (data) => {
	let userID = data.userID;
	let content = data.content;
	let postID = data.postID;
	console.log(userID);
	// Get the notification token belonging to the user
	await admin
		.firestore()
		.collection("ExpoPushTokens")
		.doc(`${userID}`)
		.get()
		.then(async (doc) => {
			let pushToken = doc.data().expoPushToken;
			let randomID = uuidv4();
			// Create notification document
			createNotificationItemInFirestore(
				userID,
				userID,
				postID,
				randomID,
				content
			);
			// Send notification to the user
			sendPushNotification(pushToken, "Post deleted", content);
		});
});
// Send a notification to the mobile app
exports.sendPostApproveNotification = functions.https.onCall(async (data) => {
	let userID = data.userID;
	let content = data.content;
	let postID = data.postID;
	// Get the notification token belonging to the user
	await admin
		.firestore()
		.collection("ExpoPushTokens")
		.doc(`${userID}`)
		.get()
		.then(async (doc) => {
			let pushToken = doc.data().expoPushToken;
			let randomID = uuidv4();
			// Create notification document
			createNotificationItemInFirestore(
				userID,
				userID,
				postID,
				randomID,
				content
			);
			// Send notification to the user
			sendPushNotification(pushToken, "Post approved", content);
		});
});

// Quarterly DB backup
const bucket = "gs://firestore-backup-slp";
exports.scheduledFirestoreExport = functions.pubsub
	.schedule("1 of jan,april,july,oct 00:00")
	.onRun((context) => {
		const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
		const databaseName = client.databasePath(projectId, "(default)");
		return client
			.exportDocuments({
				name: databaseName,
				outputUriPrefix: bucket,
				// Leave collectionIds empty to export all collections
				// or set to a list of collection IDs to export,
				// collectionIds: ['users', 'posts']
				collectionIds: [],
			})
			.then((responses) => {
				const response = responses[0];
				console.log(`Operation Name: ${response["name"]}`);
			})
			.catch((err) => {
				console.error(err);
				throw new Error("Export operation failed");
			});
	});

// Set cache headers for every object uploaded to cloud storage
exports.setCacheHeaders = functions.storage.object().onFinalize((object) => {
	storage
		.bucket(object.bucket)
		.file(object.name)
		.setMetadata({
			cacheControl: "public, max-age=777600",
			metadata: {
				"cache-control": "public, max-age=777600",
			},
		})
		.then((res) => {
			console.log(res.headers);
		});
});
//Support functions
const createNotificationItemInFirestore = async (
	authorID,
	userID,
	postID,
	id,
	content
) => {
	const notificationItem = {
		id: id,
		content: content,
		postID: postID,
		authorID: authorID,
		userID: userID,
		wasSeen: false,
		timestamp: admin.firestore.FieldValue.serverTimestamp(),
	};
	console.log("notificationItem", notificationItem);
	await admin
		.firestore()
		.doc(`Tenants/${authorID}/Notifications/${id}`)
		.set(notificationItem)
		.then((result) => {
			console.log("Notification item added: ", result);
		})
		.catch((error) => {
			console.log("Error adding notification item: ", error);
		});
};

const sendPushNotification = async (
	pushToken,
	senderName,
	content,
	data = {}
) => {
	const expo = new Expo();
	let messages = [];
	// for (let pushToken of pushTokenList) {
	// Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

	// Check that all your push tokens appear to be valid Expo push tokens
	if (!Expo.isExpoPushToken(pushToken)) {
		console.error(`Push token ${pushToken} is not a valid Expo push token`);
	}

	// Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
	messages.push({
		to: pushToken,
		sound: "default",
		title: senderName, // Announcement, Notice, someone's name
		body: content, // content of the message, "liked your post", "commented on your post", etc.
		data: data,
	});
	// }
	console.log("messages: ", messages);

	// The Expo push notification service accepts batches of notifications so
	// that you don't need to send 1000 requests to send 1000 notifications. We
	// recommend you batch your notifications to reduce the number of requests
	// and to compress them (notifications with similar content will get
	// compressed).
	let chunks = expo.chunkPushNotifications(messages);
	let tickets = [];
	(async () => {
		// Send the chunks to the Expo push notification service. There are
		// different strategies you could use. A simple one is to send one chunk at a
		// time, which nicely spreads the load out over time:
		for (let chunk of chunks) {
			try {
				let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
				console.log(ticketChunk);
				tickets.push(...ticketChunk);
				// NOTE: If a ticket contains an error code in ticket.details.error, you
				// must handle it appropriately. The error codes are listed in the Expo
				// documentation:
				// https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
			} catch (error) {
				console.error(error);
			}
		}
	})();

	// Later, after the Expo push notification service has delivered the
	// notifications to Apple or Google (usually quickly, but allow the the service
	// up to 30 minutes when under load), a "receipt" for each notification is
	// created. The receipts will be available for at least a day; stale receipts
	// are deleted.
	//
	// The ID of each receipt is sent back in the response "ticket" for each
	// notification. In summary, sending a notification produces a ticket, which
	// contains a receipt ID you later use to get the receipt.
	//
	// The receipts may contain error codes to which you must respond. In
	// particular, Apple or Google may block apps that continue to send
	// notifications to devices that have blocked notifications or have uninstalled
	// your app. Expo does not control this policy and sends back the feedback from
	// Apple and Google so you can handle it appropriately.
	let receiptIds = [];
	for (let ticket of tickets) {
		// NOTE: Not all tickets have IDs; for example, tickets for notifications
		// that could not be enqueued will have error information and no receipt ID.
		if (ticket.id) {
			receiptIds.push(ticket.id);
		}
	}

	let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
	(async () => {
		// Like sending notifications, there are different strategies you could use
		// to retrieve batches of receipts from the Expo service.
		for (let chunk of receiptIdChunks) {
			try {
				let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
				console.log(receipts);

				// The receipts specify whether Apple or Google successfully received the
				// notification and information about an error, if one occurred.
				for (let receiptId in receipts) {
					let { status, message, details } = receipts[receiptId];
					if (status === "ok") {
						continue;
					} else if (status === "error") {
						console.error(
							`There was an error sending a notification: ${message}`
						);
						if (details && details.error) {
							// The error codes are listed in the Expo documentation:
							// https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
							// You must handle the errors appropriately.
							console.error(`The error code is ${details.error}`);
						}
					}
				}
			} catch (error) {
				console.error(error);
			}
		}
	})();
};
