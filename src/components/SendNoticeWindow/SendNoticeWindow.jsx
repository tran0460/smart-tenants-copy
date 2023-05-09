import { useState, useRef, useEffect } from "react";
import { storage, db } from "../../firebase/firebase-config";
import Avatar from "react-avatar";

import {
	ref,
	uploadBytes,
	getDownloadURL,
	deleteObject,
} from "firebase/storage";
import { doc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import AttachmentBox from "../AttachmentBox/AttachmentBox";
import NoticeRecipientBox from "../NoticeRecipientBox/NoticeRecipientBox";
import Popup from "../Popup/Popup";
import "./SendNoticeWindow.css";

const { v4: uuidv4 } = require("uuid");
const SendNoticeWindow = (props) => {
	// Component for sending the notice window
	let [recipientInputValue, setRecipientInputValue] = useState("");
	let [tenantsResults, setTenantsResults] = useState([]);
	let [timeout, setTimeout] = useState();
	let [subject, setSubject] = useState("");
	let [files, setFiles] = useState([]);
	let [recipientsList, setRecipientsList] = useState([]);
	let [content, setContent] = useState("");
	let [buildingsResults, setBuildingsResults] = useState([]);
	let [maxRecipients, setMaxRecipients] = useState(10);
	let [loading, setLoading] = useState(false);
	const fileInputRef = useRef(null);
	const buildingIcon =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M9 21h6m-6 0H7a4 4 0 0 1-4-4v-6.292a4 4 0 0 1 1.927-3.421l5-3.03a4 4 0 0 1 4.146 0l5 3.03A4 4 0 0 1 21 10.707V17a4 4 0 0 1-4 4H9Zm0 0v-4a3 3 0 1 1 6 0v4H9Z" stroke="#0C6350" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const paperClip =
		//prettier-ignore
		<svg width={22} height={23} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="m20.438 11.162-9.19 9.19a6.003 6.003 0 1 1-8.49-8.49l9.19-9.19a4.002 4.002 0 0 1 5.66 5.66l-9.2 9.19a2.001 2.001 0 1 1-2.83-2.83l8.49-8.48" stroke="#0C6350" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const leftArrow =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m15 6-6 6 6 6" stroke="#4E4D4D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	// Handle behavior for actions that closes the window
	const handleCloseWindow = () => {
		if (loading) return props.setToggleSendNoticeWindow(false);
		if (!changesCheck()) {
			props.setPopup(
				<Popup
					action="confirm"
					header="You have unsaved changes"
					content="They will be lost. Are you sure you want to exit?"
					cancelOnClick={() => {
						props.setTogglePopup(false);
					}}
					onConfirm={() => {
						props.setTogglePopup(false);
						props.setToggleSendNoticeWindow(false);
					}}
				/>
			);
			return props.setTogglePopup(true);
		}
		props.setToggleSendNoticeWindow(false);
	};
	// Check if theres any change in the inputs, returns true if there are no changes, false if there are changes
	const changesCheck = () => {
		return (
			recipientsList.length === 0 &&
			subject === "" &&
			content === "" &&
			files.length === 0
		);
	};
	// Create a new notice document
	const createNotice = async () => {
		setLoading(true);
		const randomID = uuidv4();
		let docRef = doc(db, "Notices", `${randomID}`);
		// if attachments are added
		if (files.length > 0) {
			let urls = await uploadAttachments(randomID);
			await setDoc(docRef, {
				attachment: urls,
				content: content,
				recipients: recipientsList.map((recipient) => recipient.userID),
				senderID: "",
				subject: subject,
				timestamp: Timestamp.now(),
				wasSeen: [],
				id: randomID,
			}).catch((err) => console.warn(err));
			setLoading(false);
			if (props.defaultTenant) return;
			return props.getNotices();
		}
		// if no attachments added
		await setDoc(docRef, {
			attachment: [],
			content: content,
			recipients: recipientsList.map((recipient) => recipient.userID),
			senderID: "",
			subject: subject,
			timestamp: Timestamp.now(),
			wasSeen: [],
			id: randomID,
		}).catch((err) => console.warn(err));
		setLoading(false);
		if (props.defaultTenant) return;
		return await props.getNotices();
	};
	// Upload attachments to cloud storage
	const uploadAttachments = async (id) => {
		let promises = files.map(async (file) => {
			const fileRef = ref(storage, `Attachments/Notices/${id}/${file.name}`);
			let snapshot = await uploadBytes(fileRef, file);
			let url = await getDownloadURL(snapshot.ref);
			return url;
		});
		// resolve all promises and return them
		return await Promise.all(promises);
	};
	//Add default tenant if there is
	useEffect(() => {
		if (!props.defaultTenant) return;
		recipientsList.push(props.defaultTenant);
		setRecipientsList((recipientsList = [...recipientsList]));
	}, []);
	// Displays tenants matching the query in the dropdown
	useEffect(() => {
		if (recipientInputValue === "") return setTenantsResults([]);
		setTenantsResults(
			(tenantsResults = props.tenants
				.map((tenant) => {
					if (tenant.tenantAuthorized === false || tenant.isActive === false)
						return;
					if (
						(tenant.firstName + " " + tenant.lastName)
							.toLowerCase()
							.includes(recipientInputValue.toLowerCase())
					)
						return tenant;
				})
				.filter((e) => e !== undefined))
		);
	}, [recipientInputValue]);
	// Displays buildings matching the query in the dropdown
	useEffect(() => {
		if (recipientInputValue === "") return setBuildingsResults([]);
		setBuildingsResults(
			(buildingsResults = props.buildings
				.map((building) => {
					if (
						building.buildingName
							.toLowerCase()
							.includes(recipientInputValue.toLowerCase())
					)
						return building;
				})
				.filter((e) => e !== undefined))
		);
	}, [recipientInputValue]);
	return (
		<div>
			<div
				className="dimmed-bg"
				style={{ opacity: 0 }}
				onClick={() => {
					handleCloseWindow();
				}}></div>
			<div className="send-notice-window">
				<div
					className="send-notice-window-back-button"
					onClick={() => {
						handleCloseWindow();
					}}>
					{leftArrow}
					<p>Send notice</p>
				</div>
				{loading ? (
					<span className="loader"></span>
				) : (
					<div className="send-notice-window-content">
						<div
							className="invisible-bg"
							style={{ display: recipientInputValue === "" ? "none" : "" }}
							onClick={() => {
								setRecipientInputValue("");
							}}></div>
						<div className="notice-recipients-row">
							<p>To:</p>
							<div className="recipients-list">
								{recipientsList.map((recipient, index) => {
									if (maxRecipients && index + 1 > maxRecipients) return;
									return (
										<NoticeRecipientBox
											id={index}
											key={index}
											user={recipient}
											recipientsList={recipientsList}
											setRecipientsList={setRecipientsList}
										/>
									);
								})}
								<div className="recipient-input-container">
									<p
										className="extra-number"
										onClick={() => {
											maxRecipients ? setMaxRecipients() : setMaxRecipients(10);
										}}
										style={{
											display: maxRecipients
												? recipientsList.length > maxRecipients
													? ""
													: "none"
												: "",
										}}>
										{maxRecipients
											? ` +${recipientsList.length - maxRecipients} more`
											: "See less"}
									</p>
									<input
										type="text"
										className="notice-recipients-input"
										value={recipientInputValue}
										onChange={(e) => {
											setRecipientInputValue(e.target.value);
										}}
									/>
									<div
										className="profile list-dropdown"
										tabIndex={0}
										aria-label="buildings list"
										style={{
											display:
												tenantsResults.length > 0 || buildingsResults.length > 0
													? ""
													: "none",
										}}>
										<div className="list-area">
											<ul
												onWheel={(e) => {
													e.currentTarget.className = "scroll-visible";
												}}
												onScroll={(e) => {
													window.clearTimeout(timeout);
													setTimeout(
														window.setTimeout(() => {
															e.target.className = "";
														}, 1000)
													);
												}}>
												{buildingsResults.map((buildingItem, index) => {
													return (
														<li
															tabIndex={0}
															aria-label={buildingItem.buildingName}
															onKeyDown={(e) => {
																if (e.key === "Enter") {
																}
															}}
															onClick={() => {
																props.tenants
																	.map((tenant) => {
																		if (
																			tenant.buildingName !==
																			buildingItem.buildingName
																		)
																			return;
																		if (
																			recipientsList.findIndex(
																				(e) => e.userID === tenant.userID
																			) === -1
																		) {
																			recipientsList.push(tenant);
																			setRecipientsList(
																				(recipientsList = [...recipientsList])
																			);
																			console.log(recipientsList);
																		}
																		return;
																	})
																	.filter((item) => item != undefined);
																setRecipientInputValue("");
															}}>
															<span style={{ height: "1.5rem" }}>
																{buildingIcon}
															</span>
															<p>
																{buildingItem.buildingName
																	? buildingItem.buildingName
																	: "TBD"}
															</p>
														</li>
													);
												})}
												{tenantsResults.map((tenant, index) => {
													let tenantAdded = recipientsList.find(
														(e) => e.userID === tenant.userID
													);
													return (
														<li
															tabIndex={0}
															aria-label={tenant.buildingName}
															onKeyDown={(e) => {
																if (e.key === "Enter") {
																	setRecipientInputValue("");
																}
															}}
															style={
																tenantAdded
																	? {
																			background: " #EDEDED",
																			pointerEvents: "none",
																			cursor: "default !important",
																	  }
																	: {}
															}
															onClick={() => {
																if (
																	recipientsList.findIndex(
																		(e) => e.userID === tenant.userID
																	) === -1
																) {
																	recipientsList.push(tenant);
																	setRecipientsList(
																		(recipientsList = [...recipientsList])
																	);
																}
																setRecipientInputValue("");
															}}>
															{tenant.userProfileImage ? (
																<div className="image-container">
																	<img
																		src={tenant.userProfileImage}
																		alt="tenant image"
																	/>
																</div>
															) : (
																<Avatar
																	size="24"
																	maxInitials={2}
																	textSizeRatio={2.1}
																	round={"8px"}
																	name={
																		tenant.firstName + " " + tenant.lastName
																	}
																	color={`linear-gradient(180deg, ${
																		tenant.colors ? tenant.colors.start : ""
																	} 0%, ${
																		tenant.colors ? tenant.colors.end : ""
																	} 100%)`}
																	className="placeholder-avatar"
																/>
															)}
															<p
																style={{ color: tenantAdded ? "#828282" : "" }}>
																{tenant.firstName + " " + tenant.lastName}
															</p>
															<p
																style={{
																	marginLeft: "auto",
																	marginRight: ".25rem",
																	color: "#828282",
																	display: tenantAdded ? "" : "none",
																}}>
																Added
															</p>
														</li>
													);
												})}
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="notice-subject-row">
							<p>Subject:</p>
							<input
								type="text"
								className="notice-subject-input"
								value={subject}
								onChange={(e) => {
									setSubject(e.target.value);
								}}
							/>
						</div>
						<div className="scroll-area">
							<div className="notice-content-area">
								<textarea
									onChange={(e) => {
										e.target.style.height = "auto";
										e.target.style.height = e.target.scrollHeight + "px";
										setContent((content = e.target.value));
									}}
									name=""
									id=""
									cols="100000"
									rows="37"
									placeholder="Type your message here"></textarea>
							</div>
							<div className="notice-attachments-row">
								{files.map((file, index) => {
									return (
										<AttachmentBox
											files={files}
											setFiles={setFiles}
											currentFile={file}
											key={index}
											id={index}
										/>
									);
								})}
							</div>
						</div>
						<div className="notice-actions-row">
							<label
								htmlFor=""
								className="file-upload-button"
								onClick={() => {
									fileInputRef.current.click();
								}}>
								<input
									type="file"
									accept=".pdf,.png,.jpg,.jpeg"
									multiple
									ref={fileInputRef}
									onChange={() => {
										setFiles([...fileInputRef.current.files, ...files]);
									}}
								/>
								<span className="paper-clip-icon">{paperClip}</span>
								<span className="attach-file-text">Attach file</span>
							</label>
							<div className="actions">
								<p
									className="cancel-button"
									onClick={() => {
										handleCloseWindow();
									}}>
									Cancel
								</p>
								<button
									className="send-notice-button main"
									onClick={async () => {
										await createNotice();
										props.setToggleSendNoticeWindow(false);
									}}>
									Send notice
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default SendNoticeWindow;
