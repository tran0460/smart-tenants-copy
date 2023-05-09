import { useState, useRef } from "react";
import "./AdminWindow.css";
import { FileDrop } from "react-file-drop";

const AdminWindow = (props) => {
	let [editMode, setEditMode] = useState(false);
	let [firstName, setFirstName] = useState(
		props.data ? props.data.firstName : "John"
	);
	let [lastName, setLastName] = useState(
		props.data ? props.data.lastName : "Doe"
	);
	let [email, setEmail] = useState(
		props.data ? props.data.email : `placeholder@email.com`
	);
	let [phone, setPhone] = useState(
		props.data ? props.data.phoneNumber : "613-000-00-00"
	);
	let [building, setBuilding] = useState(
		props.data
			? props.data.buildingAddress
			: `100 Random St, Ottawa, ON, K1P 5L6`
	);
	let [position, setPosition] = useState(
		props.data ? props.data.position : "Community manager"
	);
	let [image, setImage] = useState(
		props.data
			? require(props.data.profileImage)
			: require("../../assets/avatar-placeholder.png")
	);
	let [temporaryImage, setTemporaryImage] = useState(
		props.data
			? require(props.data.profileImage)
			: require("../../assets/avatar-placeholder.png")
	);
	let [fileHovering, setFileHovering] = useState(false);
	const fileInputRef = useRef(null);
	const fileIcon =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M18 6h2m2 0h-2m0 0V4m0 2v2" stroke="#0C6350" strokeLinecap="round" strokeLinejoin="round" /> <path d="M21.4 20H2.6a.6.6 0 0 1-.6-.6V11h19.4a.6.6 0 0 1 .6.6v7.8a.6.6 0 0 1-.6.6Z" fill="none" stroke="#0C6350" strokeLinecap="round" strokeLinejoin="round" /> <path d="M2 11V4.6a.6.6 0 0 1 .6-.6h6.178a.6.6 0 0 1 .39.144l3.164 2.712a.6.6 0 0 0 .39.144H14" stroke="#0C6350" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const doubleArrow =
		//prettier-ignore
		<svg width={16} height={17} fill="none" xmlns="http://www.w3.org/2000/svg"  > <path d="M10.334 6.833 8 4.5 5.667 6.833M10.334 9.834 8 12.167 5.667 9.834" stroke="#9D9D9D" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const magnifyingGlass =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m16 16 3.5 3.5M5 11a6 6 0 1 0 12 0 6 6 0 0 0-12 0Z" stroke="#4E4D4D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const phoneIcon =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M18.118 14.702 14 15.5c-2.782-1.396-4.5-3-5.5-5.5l.77-4.13L7.814 2h-3.75c-1.128 0-2.016.932-1.848 2.047.42 2.783 1.66 7.83 5.284 11.453 3.805 3.805 9.285 5.456 12.302 6.113 1.165.253 2.198-.655 2.198-1.848v-3.584l-3.882-1.479Z" stroke="#4E4D4D" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const trashCanIcon =
		//prettier-ignore
		<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.666 7.333V13.6a.4.4 0 0 1-.4.4H3.733a.4.4 0 0 1-.4-.4V7.334M6.667 11.334v-4M9.333 11.334v-4M5.333 4.667h5.334m3.333 0h-3.333H14Zm-12 0h3.333H2Zm3.333 0V2.4c0-.22.18-.4.4-.4h4.534c.22 0 .4.18.4.4v2.267H5.333Z" stroke="#E71D36" strokeLinecap="round" strokeLinejoin="round" /></svg>;
	const pencilIcon =
		//prettier-ignore
		<svg onClick={() => {setEditMode(!editMode);}} className="pencil-icon" width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m13.02 5.828 4.95 4.95m-4.95-4.95L15.85 3l4.949 4.95-2.829 2.828-4.95-4.95Zm0 0-9.606 9.607a1 1 0 0 0-.293.707v4.536h4.536a1 1 0 0 0 .707-.293l9.606-9.607-4.95-4.95Z" stroke="#4E4D4D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const buildingIcon =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M9 21h6m-6 0H7a4 4 0 0 1-4-4v-6.292a4 4 0 0 1 1.927-3.421l5-3.03a4 4 0 0 1 4.146 0l5 3.03A4 4 0 0 1 21 10.707V17a4 4 0 0 1-4 4H9Zm0 0v-4a3 3 0 1 1 6 0v4H9Z" stroke="#4E4D4D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const mailIcon =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m7 9 5 3.5L17 9" stroke="#4E4D4D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> <path d="M2 17V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z" stroke="#4E4D4D" strokeWidth={2} /> </svg>;
	const leftArrow =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m15 6-6 6 6 6" stroke="#4E4D4D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	return (
		<div className="view-admin-window">
			<div
				className="dimmed-bg"
				onClick={() => {
					props.setShowAdminWindow(false);
				}}></div>
			<div className="admin-info-window">
				{editMode ? (
					<>
						<div
							className="admin-profile-back-button"
							style={{ marginLeft: "-8rem" }}
							onClick={() => {
								props.setShowAdminWindow(false);
							}}>
							{leftArrow}
							<p>View team member</p>
						</div>
						<div className="admin-profile-container" style={{ height: "100%" }}>
							{temporaryImage ? (
								<div
									className="profile-image-container large"
									style={{ marginBottom: "2rem" }}>
									<img src={temporaryImage} alt="image" />
									<span
										onClick={() => {
											setTemporaryImage();
										}}
										className="admin-image-delete-button">
										{trashCanIcon}
									</span>
								</div>
							) : (
								<FileDrop
									frame={document.querySelector(".new-admin-file-section")}
									onTargetClick={() => fileInputRef.current.click()}
									onDragOver={() => {
										setFileHovering(true);
									}}
									onDragLeave={() => {
										setFileHovering(false);
									}}
									onDrop={(files, ev) => {
										ev.stopPropagation();
										ev.preventDefault();
										setTemporaryImage(URL.createObjectURL(files[0]));
										setFileHovering(false);
									}}
									className={
										fileHovering
											? "new-admin-file-section file-hovering"
											: "new-admin-file-section"
									}>
									<span>{fileIcon}</span>
									<p>Drag and drop your image here</p>
									<p>or</p>
									<p>Click to browse</p>
								</FileDrop>
							)}
							<input
								type="file"
								style={{ display: "none" }}
								accept=".png,.jpg,.jpeg"
								ref={fileInputRef}
								onChange={(e) => {
									setTemporaryImage(URL.createObjectURL(e.target.files[0]));
								}}
							/>
							<label htmlFor="firstName">First name</label>
							<input
								id="firstName"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
							/>
							<label htmlFor="lastName">Last name</label>
							<input
								id="lastName"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
							/>
							<label htmlFor="email">Email</label>
							<input
								id="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<label htmlFor="phone">Phone number</label>
							<input
								id="building"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
							/>
							<label htmlFor="building">Building</label>
							<div className="building-input">
								<input
									id="building"
									value={building}
									onChange={(e) => setBuilding(e.target.value)}
								/>
								<span>{magnifyingGlass}</span>
							</div>
							<label htmlFor="position">Position</label>
							<div className="position-input">
								<input
									disabled
									id="position"
									value={position}
									onChange={(e) => setPosition(e.target.value)}
								/>
								<span>{doubleArrow}</span>
							</div>
							<div
								className="action-buttons"
								style={{ marginTop: "auto", paddingBottom: "0" }}>
								<button className="light">Save</button>
								<button
									className="outline"
									onClick={() => setEditMode(!editMode)}>
									Cancel
								</button>
							</div>
						</div>
					</>
				) : (
					<>
						<div
							className="admin-profile-back-button"
							onClick={() => {
								props.setShowAdminWindow(false);
							}}>
							{leftArrow}
							<p>View team member</p>
						</div>
						<div className="admin-profile-container">
							<div className="profile-image-container large">
								<img src={image} alt="image" />
							</div>
							<p className="admin-profile-full-name">
								{firstName + " " + lastName}
							</p>
							<div className="admin-profile-status">
								<p>Banned</p>
							</div>
							<div
								className="admin-profile-edit-button"
								onClick={() => setEditMode(true)}>
								<span>{pencilIcon}</span>
								<p>Edit profile</p>
							</div>
							<div className="contact-info">
								<div className="admin-profile-mail">
									<span>{mailIcon}</span>
									<p>{email}</p>
								</div>
								<div className="admin-profile-phone">
									<span>{phoneIcon}</span>
									<p>{phone}</p>
								</div>
								<div className="admin-profile-address">
									<span>{buildingIcon}</span>
									<p>{building}</p>
								</div>
							</div>
						</div>
						<div
							className="action-buttons"
							style={{ marginTop: "auto", paddingBottom: "0" }}>
							<button className="light">Reset Password</button>
							<button className="outline">Deactivate</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default AdminWindow;
