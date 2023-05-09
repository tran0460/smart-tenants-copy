import { useState, useRef } from "react";
import "./TenantInfoWindow.css";
import SendNoticeWindow from "../SendNoticeWindow/SendNoticeWindow";
import { functions, db } from "../../firebase/firebase-config";
import { updateDoc, doc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import Avatar from "react-avatar";
import Popup from "../Popup/Popup";

const TenantInfoWindow = (props) => {
	/*
	The right side sidebar for viewing tenants info
	There are 2 states, view and edit
	*/
	const auth = getAuth();
	const fileInputRef = useRef(null);
	let [editMode, setEditMode] = useState(false);
	let [firstName, setFirstName] = useState(
		props.user.firstName ? props.user.firstName : "John"
	);
	let [lastName, setLastName] = useState(
		props.user.lastName ? props.user.lastName : "Doe"
	);
	let [email, setEmail] = useState(props.user.email);
	let [building, setBuilding] = useState(props.user.buildingAddress);
	let [buildingName, setBuildingName] = useState(props.user.buildingName);
	let [unit, setUnit] = useState(props.user.unitNumber);
	let [image, setImage] = useState(props.user.userProfileImage);
	let [temporaryImage, setTemporaryImage] = useState(
		props.user.userProfileImage
	);
	let [fileHovering, setFileHovering] = useState(false);
	let [currentFile, setCurrentFile] = useState();
	let [toggleBuildingDropdown, setToggleBuildingDropdown] = useState(false);
	let [timeout, setTimeout] = useState();
	const doubleArrowGrey =
		//prettier-ignore
		<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M10.333 6.333 8 4 5.667 6.333M10.333 9.333 8 11.667 5.667 9.333" stroke="#828282" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const unitIcon =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M2.5 9.5 12 4l9.5 5.5" stroke="#0C6350" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> <path d="M7 21v-1a5 5 0 0 1 10 0v1" stroke="#0C6350" strokeWidth={1.5} /> <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="#0C6350" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const fileIcon =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M18 6h2m2 0h-2m0 0V4m0 2v2" stroke="#0C6350" strokeLinecap="round" strokeLinejoin="round" /> <path d="M21.4 20H2.6a.6.6 0 0 1-.6-.6V11h19.4a.6.6 0 0 1 .6.6v7.8a.6.6 0 0 1-.6.6Z" fill="none" stroke="#0C6350" strokeLinecap="round" strokeLinejoin="round" /> <path d="M2 11V4.6a.6.6 0 0 1 .6-.6h6.178a.6.6 0 0 1 .39.144l3.164 2.712a.6.6 0 0 0 .39.144H14" stroke="#0C6350" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const trashCanIcon =
		//prettier-ignore
		<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.666 7.333V13.6a.4.4 0 0 1-.4.4H3.733a.4.4 0 0 1-.4-.4V7.334M6.667 11.334v-4M9.333 11.334v-4M5.333 4.667h5.334m3.333 0h-3.333H14Zm-12 0h3.333H2Zm3.333 0V2.4c0-.22.18-.4.4-.4h4.534c.22 0 .4.18.4.4v2.267H5.333Z" stroke="#E71D36" strokeLinecap="round" strokeLinejoin="round" /></svg>;
	const pencilIcon =
		//prettier-ignore
		<svg onClick={() => {setEditMode(!editMode);}} className="pencil-icon" width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m13.02 5.828 4.95 4.95m-4.95-4.95L15.85 3l4.949 4.95-2.829 2.828-4.95-4.95Zm0 0-9.606 9.607a1 1 0 0 0-.293.707v4.536h4.536a1 1 0 0 0 .707-.293l9.606-9.607-4.95-4.95Z" stroke="#0C6350" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const buildingIcon =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M9 21h6m-6 0H7a4 4 0 0 1-4-4v-6.292a4 4 0 0 1 1.927-3.421l5-3.03a4 4 0 0 1 4.146 0l5 3.03A4 4 0 0 1 21 10.707V17a4 4 0 0 1-4 4H9Zm0 0v-4a3 3 0 1 1 6 0v4H9Z" stroke="#0C6350" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const mailIcon =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m7 9 5 3.5L17 9" stroke="#0C6350" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> <path d="M2 17V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z" stroke="#0C6350" strokeWidth={1.5} /> </svg>;
	const leftArrow =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m15 6-6 6 6 6" stroke="#000" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	// Calls the backend function to change the authentication credentials
	const changeEmail = httpsCallable(functions, "changeEmail");
	// Reset the form
	const resetForm = () => {
		setFirstName(props.user.firstName);
		setLastName(props.user.lastName);
		setEmail(props.user.email);
		setBuilding(props.user.buildingAddress);
		setBuildingName(props.user.buildingName);
		setUnit(props.user.unitNumber);
		setTemporaryImage(props.user.userProfileImage);
		setEditMode(!editMode);
	};
	// Send the reset password email to the tenant
	const sendResetLink = (auth, email) => {
		sendPasswordResetEmail(auth, email);
	};
	// Check for changes, returns true if there are changes, false if no changes
	const changesCheck = () => {
		return !(
			firstName === props.user.firstName &&
			lastName === props.user.lastName &&
			email === props.user.email &&
			building === props.user.buildingAddress &&
			unit === props.user.unitNumber &&
			temporaryImage === props.user.userProfileImage
		);
	};
	// Handle the close window behavior
	const handleCloseWindow = () => {
		setToggleBuildingDropdown(false);
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
						resetForm();
						props.setTogglePopup(false);
						if (editMode === true) return setEditMode(false);
						props.setShowTenantInfoWindow(false);
					}}
				/>
			);
			return props.setTogglePopup(true);
		}
		resetForm();
		if (editMode === true) return setEditMode(false);
		props.setShowTenantInfoWindow(false);
	};
	// Updates the form
	const saveForm = async () => {
		let docRef = doc(db, "Tenants", `${props.user.userID}`);
		// If the image didnt change, don't update it
		if (temporaryImage === "") {
			updateDoc(docRef, {
				userProfileImage: temporaryImage,
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				email: email.trim(),
				buildingAddress: building.trim(),
				unitNumber: unit,
			});
		}
		updateDoc(docRef, {
			firstName: firstName.trim(),
			lastName: lastName.trim(),
			email: email.trim(),
			buildingAddress: building,
			buildingID: building.replace(" ", ""),
			buildingName: buildingName,
			unitNumber: unit,
		});
		if (email.trim() !== props.user.email) {
			changeEmail({ email: props.user.email, newEmail: email });
		}
	};
	return (
		<div>
			<div
				className="dimmed-bg"
				onClick={() => {
					handleCloseWindow();
				}}></div>
			<div
				className="tenant-info-window"
				onWheel={(e) => {
					e.currentTarget.className = "tenant-info-window scroll-visible";
				}}
				onScroll={(e) => {
					window.clearTimeout(timeout);
					setTimeout(
						window.setTimeout(() => {
							e.target.className = "tenant-info-window";
						}, 1000)
					);
				}}>
				{editMode ? (
					<>
						<div
							className="tenant-profile-back-button"
							onClick={() => {
								handleCloseWindow();
							}}>
							{leftArrow}
							<p>Edit tenant</p>
						</div>
						<div
							className="tenant-profile-container"
							style={{ height: "100%" }}>
							{temporaryImage ? (
								<div
									tabIndex={0}
									aria-label="tenant image"
									className="profile-image-container large"
									style={{ marginBottom: "2rem" }}>
									<img src={temporaryImage} alt="image" />
									<span
										tabIndex={0}
										aria-label="delete tenant image"
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												setTemporaryImage("");
											}
										}}
										onClick={() => {
											setTemporaryImage("");
										}}
										className="tenant-image-delete-button">
										{trashCanIcon}
									</span>
								</div>
							) : (
								<Avatar
									size="128"
									round={"8px"}
									textMarginRatio={0.15}
									maxInitials={2}
									color={`linear-gradient(180deg, ${
										props.user.colors ? props.user.colors.start : ""
									} 0%, ${
										props.user.colors ? props.user.colors.end : ""
									} 100%)`}
									name={`${firstName} ${lastName}`}
									style={{ marginBottom: "2.5rem", marginTop: "0" }}
								/>
							)}
							<input
								type="file"
								style={{ display: "none" }}
								accept=".png,.jpg,.jpeg"
								ref={fileInputRef}
								onChange={async (e) => {
									await setCurrentFile((currentFile = e.target.files[0]));
									setTemporaryImage(URL.createObjectURL(currentFile));
								}}
							/>
							<label htmlFor="firstName">First name</label>
							<input
								type="text"
								id="firstName"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
							/>
							<label htmlFor="lastName">Last name</label>
							<input
								type="text"
								id="lastName"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
							/>
							<label htmlFor="email">Email</label>
							<input
								type="text"
								id="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<div
								className="building-input-container"
								onClick={(e) => {
									setToggleBuildingDropdown(!toggleBuildingDropdown);
								}}>
								<label htmlFor="building">Building</label>
								<input
									tabIndex={0}
									readOnly
									id="building"
									value={buildingName}
									className={toggleBuildingDropdown ? "dropdown active" : ""}
									onKeyDown={(e) => {
										if (e.key === "Enter")
											setToggleBuildingDropdown(!toggleBuildingDropdown);
									}}
									onChange={(e) => setBuilding(e.target.value)}
								/>
								<span>{doubleArrowGrey}</span>
							</div>
							<label htmlFor="unit">Unit</label>
							<input
								type="text"
								id="unit"
								value={unit}
								onChange={(e) => setUnit(e.target.value)}
							/>
							<div className="action-buttons" style={{ marginTop: "auto" }}>
								<button
									className="main"
									onKeyDown={async (e) => {
										if (e.key === "Enter") {
											await saveForm();
											props.setShowTenantInfoWindow(false);
										}
									}}
									onClick={async () => {
										await saveForm();
										props.setShowTenantInfoWindow(false);
									}}>
									Save
								</button>
								<button
									className="danger"
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											handleCloseWindow();
										}
									}}
									onClick={() => {
										handleCloseWindow();
									}}>
									Cancel
								</button>
							</div>
						</div>
						<div
							className="invisible-bg"
							style={{ display: toggleBuildingDropdown ? "" : "none" }}
							onClick={() => {
								setToggleBuildingDropdown(false);
							}}></div>
						<div
							className="profile list-dropdown"
							tabIndex={0}
							aria-label="buildings list"
							style={{ display: toggleBuildingDropdown ? "" : "none" }}>
							<div className="building-list-area">
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
									{props.listOfBuildings.map((buildingItem, index) => {
										return (
											<li
												tabIndex={0}
												aria-label={buildingItem.buildingName}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														setBuilding(buildingItem.buildingAddress);
														setBuildingName(
															buildingItem.buildingName
																? buildingItem.buildingName
																: "TBD"
														);
														setToggleBuildingDropdown(false);
													}
												}}
												onClick={() => {
													setBuilding(buildingItem.buildingAddress);
													setBuildingName(
														buildingItem.buildingName
															? buildingItem.buildingName
															: "TBD"
													);
													setToggleBuildingDropdown(false);
												}}
												className={
													building === buildingItem.buildingAddress
														? "active"
														: ""
												}>
												<span>{buildingIcon}</span>
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
					</>
				) : (
					<>
						<div
							className="tenant-profile-back-button"
							onClick={() => {
								props.setShowTenantInfoWindow(false);
							}}>
							{leftArrow}
							<p>Tenant information</p>
						</div>
						<div className="tenant-profile-container">
							{image ? (
								<div className="profile-image-container large">
									<img src={image} alt="avatar" />
								</div>
							) : (
								<Avatar
									size="128"
									round={"8px"}
									textMarginRatio={0.15}
									maxInitials={2}
									name={`${firstName} ${lastName}`}
									color={`linear-gradient(180deg, ${
										props.user.colors ? props.user.colors.start : ""
									} 0%, ${
										props.user.colors ? props.user.colors.end : ""
									} 100%)`}
									style={{ marginBottom: "2.5rem", marginTop: "0" }}
								/>
							)}
							<p className="tenant-profile-full-name">
								{firstName + " " + lastName}
							</p>
							<div
								tabIndex={0}
								aria-label="edit tenant profile"
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										setEditMode(true);
									}
								}}
								className="tenant-profile-edit-button"
								onClick={() => setEditMode(true)}>
								<span>{pencilIcon}</span>
								<p>Edit profile</p>
							</div>
							<button
								onClick={() => {
									props.setSendNoticeWindow(
										<SendNoticeWindow
											setTogglePopup={props.setTogglePopup}
											setPopup={props.setPopup}
											defaultTenant={props.user}
											setToggleSendNoticeWindow={
												props.setToggleSendNoticeWindow
											}
										/>
									);
									props.setToggleSendNoticeWindow(
										!props.toggleSendNoticeWindow
									);
								}}
								className="main tenant-profile-send-notice">
								Send notice
							</button>
							<div className="tenant-profile-mail">
								{mailIcon}
								<p>{email}</p>
							</div>
							<div className="tenant-profile-address">
								{buildingIcon}
								<p>{building}</p>
							</div>
							<div className="tenant-profile-unit">
								{unitIcon}
								<p>{unit}</p>
							</div>
						</div>
						<div className="action-buttons">
							<button
								className="light"
								onClick={() => {
									props.setPopup(
										<Popup
											action="confirm"
											header={`You are resetting ${firstName}’s password.`}
											content="The user will receive a password reset link to their email address. Do you want to proceed?"
											cancelOnClick={() => {
												props.setTogglePopup(false);
											}}
											onConfirm={async () => {
												sendResetLink(auth, email);
												props.setTogglePopup(false);
												props.setShowTenantInfoWindow(false);
											}}
										/>
									);
									props.setTogglePopup(true);
								}}>
								Reset Password
							</button>
							<button
								className="danger"
								style={{ display: props.user.isActive ? "" : "none" }}
								onClick={() => {
									props.setPopup(
										<Popup
											action="deactivate"
											header={`You are deactivating ${firstName}’s account.`}
											content="It will remain in the Inactive tab for the next 30 days. After that it will be deleted permanently. Do you wan to proceed?"
											cancelOnClick={() => {
												props.setTogglePopup(false);
											}}
											onConfirm={() => {
												let docRef = doc(db, "Tenants", `${props.user.userID}`);
												updateDoc(docRef, {
													isActive: false,
												});
												props.setTogglePopup(false);
												props.setShowTenantInfoWindow(false);
											}}
										/>
									);
									props.setTogglePopup(true);
								}}>
								Deactivate
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default TenantInfoWindow;
