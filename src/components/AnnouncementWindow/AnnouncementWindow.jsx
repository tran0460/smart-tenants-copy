import { useState, useRef, useEffect } from "react";
import { storage, db } from "../../firebase/firebase-config";
import {
	ref,
	uploadBytes,
	getDownloadURL,
	deleteObject,
} from "firebase/storage";
import { doc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import "./AnnouncementWindow.css";
import NoticeRecipientBox from "../NoticeRecipientBox/NoticeRecipientBox";
import Popup from "../Popup/Popup";
import ActionStatusBox from "../../components/ActionStatusBox/ActionStatusBox";
const { v4: uuidv4 } = require("uuid");

const AnnouncementWindow = (props) => {
	/*
	There are 2 types of announcement windows, "edit" and "new", determined by the prop "windowType" 
	The content in the window changes accordingly
	TODO: add actionStatusBox when an action completes
	*/
	let [recipientInputValue, setRecipientInputValue] = useState("");
	let [subject, setSubject] = useState(props.data ? props.data.subject : "");
	let [imageSrc, setImageSrc] = useState(
		props.data
			? props.data.attachment[0] === ""
				? ""
				: props.data.attachment[0]
			: ""
	);
	let [file, setFile] = useState();
	let [content, setContent] = useState(props.data ? props.data.content : "");
	let [recipientsList, setRecipientsList] = useState(
		props.data
			? [
					props.buildings?.find(
						(e) => e.buildingName === props.data.recipients[0]
					),
			  ]
			: []
	);
	let [toggleBuildingDropdown, setToggleBuildingDropdown] = useState(false);
	let [downloadURL, setDownloadURL] = useState(
		props.data ? props.data.attachment[0] : ""
	);
	let [building, setBuilding] = useState("");
	let [timeout, setTimeout] = useState();
	let [buildingsResults, setBuildingsResults] = useState([]);
	let [loading, setLoading] = useState(false);
	let imgRef = useRef(null);

	// Handle form submission
	let handleSubmit = async () => {
		setLoading(true);
		if (props.windowType === "new") await createAnnouncement();
		if (props.windowType === "edit") await updateAnnouncement();
		await props.getAnnouncements();
		setLoading(false);
		props.setActionStatusBox(
			<ActionStatusBox
				type="success"
				message="Action completed successfully"
				setToggleActionStatusBox={props.setToggleActionStatusBox}
			/>
		);
		props.setToggleActionStatusBox(true);
		props.setToggleAnnouncementWindow(false);
	};
	// True if changed, false if unchanged
	const changesCheck = () => {
		if (props.data) {
			return !(
				subject === props.data.subject &&
				downloadURL === props.data.attachment[0] &&
				content === props.data.content
			);
		}
		return !(subject === "" && file === undefined && content === "");
	};
	// Upload the image to cloud storage
	const uploadImage = async (fileName) => {
		const imagesRef = ref(storage, `Attachments/Announcements/${fileName}`);
		await uploadBytes(imagesRef, file).then(async (snapshot) => {
			await getDownloadURL(snapshot.ref).then((url) => {
				setDownloadURL((downloadURL = url));
			});
		});
	};

	// Create new announcement document in firestore
	const createAnnouncement = async () => {
		const randomID = uuidv4();
		if (file !== undefined) {
			await uploadImage(randomID);
		}
		let docRef = doc(db, "Announcements", `${randomID}`);
		await setDoc(docRef, {
			attachment: [downloadURL],
			content: content,
			id: randomID,
			recipients: recipientsList.map((recipient) => {
				return recipient.buildingName;
			}),
			subject: subject,
			senderID: "",
			timestamp: Timestamp.now(),
			wasSeen: [],
		}).catch((err) => {});
	};

	// Update the current document in firestore
	const updateAnnouncement = async () => {
		let docRef = doc(db, "Announcements", `${props.data.id}`);
		// If image is deleted
		if (props.data.attachment[0] !== "" && downloadURL === "") {
			let fileRef = ref(storage, `Attachments/Announcements/${props.data.id}`);
			await deleteObject(fileRef)
				.then(() => {
					// File deleted successfully
					setDownloadURL("");
				})
				.catch((error) => {
					// Uh-oh, an error occurred!
				});
		}
		// If a new image is selected
		if (
			(downloadURL !== "" && props.data.attachment[0] !== "") ||
			file !== undefined
		) {
			await uploadImage(props.data.id);
		}
		// If the file is not touched
		if (file === undefined) {
			return await updateDoc(docRef, {
				content: content,
				subject: subject,
			});
		}
		await updateDoc(docRef, {
			attachment: [downloadURL],
			content: content,
			subject: subject,
		});
	};

	// Handle the behavior when the window is closed
	const handleCloseWindow = () => {
		if (loading === true) return props.setToggleAnnouncementWindow(false);
		if (changesCheck()) {
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
						props.setToggleAnnouncementWindow(false);
					}}
				/>
			);
			return props.setTogglePopup(true);
		}
		props.setToggleAnnouncementWindow(false);
	};
	const fileInputRef = useRef(null);
	const buildingIconLg =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M9 21h6m-6 0H7a4 4 0 0 1-4-4v-6.292a4 4 0 0 1 1.927-3.421l5-3.03a4 4 0 0 1 4.146 0l5 3.03A4 4 0 0 1 21 10.707V17a4 4 0 0 1-4 4H9Zm0 0v-4a3 3 0 1 1 6 0v4H9Z" stroke="#0C6350" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const buildingIcon =
		//prettier-ignore
		<svg width={16} height={17} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M6 14.5h4m-4 0H4.667A2.667 2.667 0 0 1 2 11.833V7.638c0-.932.487-1.797 1.285-2.28l3.333-2.02a2.667 2.667 0 0 1 2.764 0l3.334 2.02A2.667 2.667 0 0 1 14 7.638v4.195a2.667 2.667 0 0 1-2.667 2.667H6Zm0 0v-2.667a2 2 0 1 1 4 0V14.5H6Z" stroke="#0C6350" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const trashCanIcon =
		//prettier-ignore
		<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M12.667 7.333V13.6a.4.4 0 0 1-.4.4H3.733a.4.4 0 0 1-.4-.4V7.334M6.667 11.334v-4M9.333 11.334v-4M5.333 4.667h5.334m3.333 0h-3.333H14Zm-12 0h3.333H2Zm3.333 0V2.4c0-.22.18-.4.4-.4h4.534c.22 0 .4.18.4.4v2.267H5.333Z" stroke="#E71D36" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const imageIcon =
		//prettier-ignore
		<svg width={24} height={25} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M21 4.1v16.8a.6.6 0 0 1-.6.6H3.6a.6.6 0 0 1-.6-.6V4.1a.6.6 0 0 1 .6-.6h16.8a.6.6 0 0 1 .6.6Z" stroke="#0C6350" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> <path d="m3 16.5 7-3 11 5M16 10.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" stroke="#0C6350" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const leftArrow =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m15 6-6 6 6 6" stroke="#4E4D4D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	// Displays buildings matching the query in the building dropdown
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
				onClick={() => {
					handleCloseWindow();
				}}></div>
			<div className="announcement-window">
				<div
					className="announcement-window-back-button"
					onClick={() => {
						handleCloseWindow();
					}}>
					{leftArrow}
					<p>
						{props.windowType === "new"
							? "New Announcement"
							: "Edit Announcement"}
					</p>
				</div>
				{loading ? (
					<span className="loader"></span>
				) : (
					<>
						<div className="announcement-window-content">
							<div
								className="invisible-bg"
								onClick={() => {
									setBuildingsResults([]);
								}}
								style={{
									display: buildingsResults.length > 0 ? "" : "none",
								}}></div>
							<div className="announcement-recipients-row">
								<p>To:</p>
								{recipientsList.map((recipient, index) => {
									return (
										<div className="announcement-recipient">
											<span>{buildingIconLg}</span>
											<p className="building-name">{recipient.buildingName}</p>
											<span className="x-mark"></span>
										</div>
									);
								})}
								<div className="recipient-input-container">
									<input
										type="text"
										className="announcement-recipients-input"
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
											display: buildingsResults.length > 0 ? "" : "none",
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
																	setBuilding(buildingItem.buildingAddress);
																}
															}}
															onClick={() => {
																setBuilding(buildingItem.buildingAddress);
																if (
																	recipientsList.findIndex(
																		(e) =>
																			e.buildingAddress ===
																			buildingItem.buildingAddress
																	) === -1
																) {
																	recipientsList.push(buildingItem);
																	setRecipientsList(
																		(recipientsList = [...recipientsList])
																	);
																}
																setRecipientInputValue("");
															}}>
															<span style={{ height: "1.5rem" }}>
																{buildingIconLg}
															</span>
															<p>
																{buildingItem.buildingName
																	? buildingItem.buildingName
																	: "TBD"}
															</p>
														</li>
													);
												})}
											</ul>
										</div>
									</div>
								</div>
							</div>
							<div className="announcement-subject-row">
								<p>Subject:</p>
								<input
									value={subject}
									type="text"
									className="announcement-subject-input"
									onChange={(e) => {
										setSubject(e.target.value);
									}}
								/>
							</div>
							<div className="scroll-area">
								<div className="announcement-content-area">
									<textarea
										value={content}
										onChange={(e) => {
											e.target.style.height = "auto";
											e.target.style.height = e.target.scrollHeight + "px";
											setContent(e.target.value);
										}}
										name=""
										id=""
										cols="10000"
										rows="10"
										placeholder="Type your message here"></textarea>
								</div>
								<div
									className="announcement-attachments-row"
									style={{ display: imageSrc ? "" : "none" }}>
									<div className="attachment-image-container">
										<img
											ref={imgRef}
											className="announcement-images"
											src={imageSrc}
											alt={"attachment"}
										/>
										<span
											className="announcement-attachment-delete-button"
											onClick={() => {
												setFile();
												setImageSrc("");
												setDownloadURL("");
												fileInputRef.current.value = "";
											}}>
											{trashCanIcon}
										</span>
									</div>
								</div>
							</div>
							<div className="announcement-actions-row">
								<label
									htmlFor=""
									className="file-upload-button"
									onClick={() => {
										fileInputRef.current.click();
									}}>
									<input
										type="file"
										accept=".png,.jpg,.jpeg"
										ref={fileInputRef}
										onChange={(e) => {
											setFile(e.target.files[0]);
											setImageSrc(
												URL.createObjectURL(fileInputRef.current.files[0])
											);
										}}
									/>
									<span className="paper-clip-icon">{imageIcon}</span>
									<span className="attach-file-text">Attach image</span>
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
										className="announcement-button main"
										onClick={() => handleSubmit()}>
										{props.windowType === "new"
											? "Post Announcement"
											: "Edit Announcement"}
									</button>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default AnnouncementWindow;
