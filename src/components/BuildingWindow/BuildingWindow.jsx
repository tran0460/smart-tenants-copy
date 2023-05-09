import { useState, useRef } from "react";
import "./BuildingWindow.css";

const BuildingWindow = (props) => {
	/*
	Component for the building info window
	There are 2 states, edit state and view state, determined by the Boolean property "editMode"
	*/
	let [buildingName, setBuildingName] = useState(
		props.data ? props.data.buildingName : "Algonquin Place"
	);
	let [buildingAddress, setBuildingAddress] = useState(
		props.data ? props.buildingAddress : "101-115 Amaya , Ottawa, ON"
	);
	let contacts = props.data
		? props.data.contacts
		: [
				{
					email: "tgreen@smartlivingproperties.com",
					fullName: "Tracey Green",
					main: true,
					phone: "613-244-1551",
				},
		  ];
	const fileInputRef = useRef(null);

	let [image, setImage] = useState(
		props.data
			? props.data.buildingImage
			: "https://firebasestorage.googleapis.com/v0/b/son-demo-project.appspot.com/o/Images%2FBuildings%2Fplaceholder-house-img.jpg?alt=media&token=9758a38d-4737-40ff-bb8b-ac9319a5317a"
	);
	let [editMode, setEditMode] = useState(false);
	const phoneIcon =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M18.118 14.702 14 15.5c-2.782-1.396-4.5-3-5.5-5.5l.77-4.13L7.814 2h-3.75c-1.128 0-2.016.932-1.848 2.047.42 2.783 1.66 7.83 5.284 11.453 3.805 3.805 9.285 5.456 12.302 6.113 1.165.253 2.198-.655 2.198-1.848v-3.584l-3.882-1.479Z" stroke="#0C6350" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const mailIcon =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m7 9 5 3.5L17 9" stroke="#0C6350" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> <path d="M2 17V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z" stroke="#0C6350" strokeWidth={1.5} /> </svg>;
	const personIcon =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M5 20v-1a7 7 0 1 1 14 0v1" stroke="#0C6350" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="#0C6350" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const pencilIcon =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m13.02 5.828 4.95 4.95m-4.95-4.95L15.85 3l4.95 4.95-2.829 2.828-4.95-4.95Zm0 0-9.606 9.607a1 1 0 0 0-.293.707v4.536h4.536a1 1 0 0 0 .707-.293l9.606-9.607-4.95-4.95Z" stroke="#0C6350" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const pinIcon =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M4 10c0 4.418 8 12 8 12s8-7.582 8-12a8 8 0 1 0-16 0Z" stroke="#4D4D4D" strokeWidth={1.5} /> <path d="M12 11a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" fill="#4D4D4D" stroke="#4D4D4D" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const leftArrow =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m15 6-6 6 6 6" stroke="#4E4D4D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const plusIcon =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M12 12v6m-6-6h6-6Zm12 0h-6 6Zm-6 0V6v6Z" stroke="#0c6350" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const magnifyingGlass =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m16 16 3.5 3.5M5 11a6 6 0 1 0 12 0 6 6 0 0 0-12 0Z" stroke="#4E4D4D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	return (
		<div>
			<div className="dimmed-bg"></div>
			{editMode ? (
				<div className="new-building-window">
					<div
						className="new-building-back-button"
						onClick={() => {
							setEditMode(false);
						}}>
						{leftArrow}
						<p>Edit building</p>
					</div>
					<div className="new-building-form-container">
						<div className="new-building-image-container">
							<img src={image} alt="house" className="new-building-image" />
							<span
								className="new-building-image-edit-button"
								onClick={() => fileInputRef.current.click()}>
								{pencilIcon}
							</span>
						</div>
						<input
							type="file"
							style={{ display: "none" }}
							accept=".png,.jpg,.jpeg"
							ref={fileInputRef}
							onChange={(e) => {
								setImage(URL.createObjectURL(e.target.files[0]));
							}}
						/>
						<label htmlFor="building_name">Building name</label>
						<input
							id="building_name"
							value={buildingName}
							onChange={(e) => setBuildingName(e.target.value)}
						/>
						<label htmlFor="building_address">Address</label>
						<input
							id="building_address"
							value={buildingAddress}
							onChange={(e) => setBuildingAddress(e.target.value)}
						/>
						<div className="new-building-contacts-section">
							<label className="contacts-header">Contacts</label>
							{contacts.map((contact) => {
								return (
									<div
										className="choose-contact-input"
										style={{ display: "flex", flexDirection: "column" }}>
										<input
											className="choose-contact-input-field"
											value={contact.fullName}
										/>
										<input
											className="choose-contact-input-field"
											value={contact.role ? contact.role : "Admin"}
										/>
									</div>
								);
							})}
							<button className="new-contact-button">
								<span>{plusIcon}</span>
								New contact
							</button>
						</div>
						<div
							className="action-buttons"
							style={{ marginTop: "auto", paddingBottom: "0" }}>
							<button className="light">Save</button>
							<button
								className="outline"
								onClick={() => {
									setEditMode(false);
								}}>
								Cancel
							</button>
						</div>
					</div>
				</div>
			) : (
				<div className="view-building-window">
					<div
						className="view-building-back-button"
						onClick={() => {
							props.setToggleViewBuildingWindow(false);
						}}>
						{leftArrow}
						<p>View building</p>
					</div>
					<div className="view-building-info-container">
						<div className="view-building-image-container">
							<img src={image} alt="house" className="view-building-image" />
						</div>
						<div className="view-building-info-section">
							<p className="view-building-name">{buildingName}</p>
							<p className="view-building-address">
								<span>{pinIcon}</span>
								{buildingAddress}
							</p>
							<p
								className="view-building-edit-button"
								onClick={() => {
									setEditMode(true);
								}}>
								<span>{pencilIcon}</span>Edit building
							</p>
						</div>
						<button className="view-building-send-announcement-button main">
							Send announcement
						</button>
						<div className="view-building-contacts-section">
							<p className="contacts-header">Contacts</p>
							{contacts.map((contact) => {
								return (
									<div className="view-building-contact">
										<p className="contact-name">{contact.fullName}</p>
										<p className="contact-role">
											<span>{personIcon}</span>
											{contact.role ? contact.role : "Admin"}
										</p>
										<p className="contact-email">
											<span>{mailIcon}</span>
											{contact.email}
										</p>
										<p className="contact-phone">
											<span>{phoneIcon}</span>
											{contact.phone}
										</p>
									</div>
								);
							})}
						</div>
						<div
							className="action-buttons"
							style={{ marginTop: "auto", paddingBottom: "0" }}>
							<button className="outline">Delete building</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default BuildingWindow;
