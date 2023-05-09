import { useState, useRef } from "react";
import "./NewBuildingWindow.css";
import { FileDrop } from "react-file-drop";

const NewBuildingWindow = (props) => {
	// Component for creating a new building
	let [fileHovering, setFileHovering] = useState(false);
	let [image, setImage] = useState();
	const fileInputRef = useRef(null);
	const pencilIcon =
		//prettier-ignore
		<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m8.68 3.886 3.3 3.3m-3.3-3.3L10.566 2l3.3 3.3-1.886 1.885-3.3-3.3Zm0 0L2.276 10.29a.667.667 0 0 0-.195.471v3.024h3.023c.177 0 .347-.07.472-.195l6.404-6.405-3.3-3.3Z" stroke="#0C6350" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const plusIcon =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M12 12v6m-6-6h6-6Zm12 0h-6 6Zm-6 0V6v6Z" stroke="#0c6350" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const magnifyingGlass =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m16 16 3.5 3.5M5 11a6 6 0 1 0 12 0 6 6 0 0 0-12 0Z" stroke="#4E4D4D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const fileIcon =
		//prettier-ignore
		<svg width={64} height={65} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M48 16.5h5.333m5.334 0h-5.334m0 0v-5.334m0 5.334v5.333" stroke="#0C6350" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> <path d="M57.067 53.834H6.934a1.6 1.6 0 0 1-1.6-1.6v-22.4h51.733a1.6 1.6 0 0 1 1.6 1.6v20.8a1.6 1.6 0 0 1-1.6 1.6Z" fill="none" stroke="#0C6350" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> <path d="M5.333 29.833V12.767a1.6 1.6 0 0 1 1.6-1.6h16.475a1.6 1.6 0 0 1 1.041.385l8.435 7.23a1.6 1.6 0 0 0 1.041.384h3.409" stroke="#0C6350" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const leftArrow =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m15 6-6 6 6 6" stroke="#4E4D4D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	return (
		<div>
			<div className="dimmed-bg"></div>
			<div className="new-building-window">
				<div
					className="new-building-back-button"
					onClick={() => {
						props.setToggleNewBuildingWindow(false);
					}}>
					{leftArrow}
					<p>New building</p>
				</div>
				<div className="new-building-form-container">
					{image ? (
						<div className="new-building-image-container">
							<img src={image} alt="house" className="new-building-image" />
							<span
								className="new-building-image-edit-button"
								onClick={() => fileInputRef.current.click()}>
								{pencilIcon}
							</span>
						</div>
					) : (
						<FileDrop
							frame={document.querySelector(".new-building-file-section")}
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
							}}
							className={
								fileHovering
									? "new-building-file-section file-hovering"
									: "new-building-file-section"
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
					<label htmlFor="firstName">Building name</label>
					<input id="firstName" />
					<label htmlFor="lastName">Building address</label>
					<input id="lastName" />
					<div className="new-building-contacts-section">
						<label className="contacts-header">Contacts</label>
						<div className="choose-contact-input">
							<input
								placeholder="Choose a team member"
								className="choose-contact-input-field"
							/>
							<span>{magnifyingGlass}</span>
						</div>
						<button className="new-contact-button">
							<span>{plusIcon}</span>
							New contact
						</button>
					</div>
					<div
						className="new-building-action-buttons"
						style={{ marginTop: "auto" }}>
						<button className="light">Save</button>
						<button
							className="outline"
							onClick={() => {
								props.setToggleNewBuildingWindow(false);
							}}>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewBuildingWindow;
