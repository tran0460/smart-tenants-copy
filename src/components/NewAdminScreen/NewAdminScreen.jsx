import { useState, useRef } from "react";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import { FileDrop } from "react-file-drop";
import "./NewAdminScreen.css";

const NewAdminScreen = (props) => {
	// Screen for creating a new admin
	let [fileHovering, setFileHovering] = useState(false);
	let [image, setImage] = useState();
	const fileInputRef = useRef(null);

	let avatar = props.data
		? require(props.data.profileImage)
		: require("../../assets/avatar-placeholder.png");
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
	const trashIcon =
		//prettier-ignore
		<svg width="1em" height="1em" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.666 7.334v6.267a.4.4 0 0 1-.4.4H3.733a.4.4 0 0 1-.4-.4V7.334M6.667 11.334v-4M9.333 11.334v-4M5.333 4.667h5.334m3.333 0h-3.333H14Zm-12 0h3.333H2Zm3.333 0V2.4c0-.22.18-.4.4-.4h4.534c.22 0 .4.18.4.4v2.267H5.333Z" stroke="#E71D36" strokeLinecap="round" strokeLinejoin="round" /></svg>;
	const fileIcon =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M18 6h2m2 0h-2m0 0V4m0 2v2" stroke="#0C6350" strokeLinecap="round" strokeLinejoin="round" /> <path d="M21.4 20H2.6a.6.6 0 0 1-.6-.6V11h19.4a.6.6 0 0 1 .6.6v7.8a.6.6 0 0 1-.6.6Z" fill="none" stroke="#0C6350" strokeLinecap="round" strokeLinejoin="round" /> <path d="M2 11V4.6a.6.6 0 0 1 .6-.6h6.178a.6.6 0 0 1 .39.144l3.164 2.712a.6.6 0 0 0 .39.144H14" stroke="#0C6350" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const magnifyingGlass =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m16 16 3.5 3.5M5 11a6 6 0 1 0 12 0 6 6 0 0 0-12 0Z" stroke="#4E4D4D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const doubleArrow =
		//prettier-ignore
		<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M10.333 6.333 8 4 5.667 6.333M10.333 9.333 8 11.667 5.667 9.333" stroke="#9D9D9D" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const leftArrow =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m15 6-6 6 6 6" stroke="#4E4D4D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const rightArrow =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="m9 6 6 6-6 6" stroke="#4E4D4D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	return (
		<div>
			<div
				className="dimmed-bg"
				onClick={() => {
					props.setShowNewAdminWindow(false);
				}}></div>
			<div className="admin-info-window">
				<div
					className="admin-profile-back-button"
					style={{ marginLeft: "-7rem" }}
					onClick={() => {
						props.setShowNewAdminWindow(false);
					}}>
					{leftArrow}
					<p>New team member</p>
				</div>
				<div className="admin-profile-container" style={{ height: "100%" }}>
					{image ? (
						<div
							className="profile-image-container large"
							style={{ marginBottom: "2rem" }}>
							<img src={image} alt="avatar" />
							<span
								className="new-building-image-edit-button"
								onClick={() => setImage()}>
								{trashIcon}
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
								setImage(URL.createObjectURL(files[0]));
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
							setImage(URL.createObjectURL(e.target.files[0]));
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
					<label htmlFor="position">Password</label>
					<PasswordInput />
					<div
						className="admin-profile-action-buttons"
						style={{ marginTop: "auto" }}>
						<button className="light">Create account</button>
						<button
							className="outline"
							onClick={() => {
								props.setShowNewAdminWindow(false);
							}}>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewAdminScreen;
