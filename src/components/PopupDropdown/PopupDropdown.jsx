import { useState } from "react";
import "./PopupDropdown.css";
import { db, functions } from "../../firebase/firebase-config";
import { httpsCallable } from "firebase/functions";

const PopupDropdown = (props) => {
	// Popup dropdown component
	/*
	All contents are passed down from the parent component
	Required props: 
	- action: the text that appears in the green button (string)
	- header (string)
	- content (string)
	- cancelOnClick (function)
	- onConfirm (function)
	*/
	let [showDropdown, setShowDropdown] = useState(false);
	let [dropdownList, setDropdownList] = useState(
		props.dropdownList
			? props.dropdownList
			: [
					"Profanity",
					"Nudity",
					"Drug-related content",
					"Abusive content",
					"Offensive content",
			  ]
	);
	const sendPostDeclineNotification = httpsCallable(
		functions,
		"sendPostDeclineNotification"
	);
	const sendPostDeleteNotification = httpsCallable(
		functions,
		"sendPostDeleteNotification"
	);
	let [currentDropdownChoice, setCurrentDropdownChoice] =
		useState("Select reason");
	const doubleArrow =
		//prettier-ignore
		<svg width={16} height={17} fill="none" xmlns="http://www.w3.org/2000/svg"  > <path d="M10.334 6.833 8 4.5 5.667 6.833M10.334 9.834 8 12.167 5.667 9.834" stroke="#9D9D9D" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	return (
		<div>
			<div className="white-dimmed-bg"></div>
			<div
				className="invisible-bg"
				style={{ display: showDropdown ? "" : "none", zIndex: 999999 }}
				onClick={() => setShowDropdown(false)}></div>
			<div className="popup-container">
				<p className="popup-header">{props.header}</p>
				<p className="popup-content">{props.content}</p>
				<div className="popup-dropdown">
					<input
						onClick={() => {
							setShowDropdown(!showDropdown);
						}}
						value={currentDropdownChoice}
						type="button"
					/>
					<span>{doubleArrow}</span>
					{showDropdown ? (
						<div className="dropdown-box">
							<ul>
								{dropdownList.map((choice, index) => {
									return (
										<li
											className={
												currentDropdownChoice === choice ? "active" : ""
											}
											onClick={() => {
												setCurrentDropdownChoice(
													(currentDropdownChoice = choice)
												);
												setShowDropdown(false);
											}}
											key={index}>
											{choice}
										</li>
									);
								})}
							</ul>
						</div>
					) : (
						""
					)}
				</div>
				<div className="popup-buttons">
					<p className="cancel-button" onClick={props.cancelOnClick}>
						Cancel
					</p>
					<button
						className="main"
						disabled={currentDropdownChoice === "Select reason" ? true : false}
						onClick={() => {
							if (props.action === "decline")
								sendPostDeclineNotification({
									userID: props.userID,
									content: `Your post was declined due to ${
										currentDropdownChoice.charAt(0).toLowerCase() +
										currentDropdownChoice.slice(1)
									}`,
									postID: props.postID,
								});
							if (props.action === "delete") {
								sendPostDeleteNotification({
									userID: props.userID,
									content: `Your post was deleted due to ${
										currentDropdownChoice.charAt(0).toLowerCase() +
										currentDropdownChoice.slice(1)
									}`,
									postID: props.postID,
								});
							}
							props.onConfirm();
						}}>
						{props.action.charAt(0).toUpperCase() + props.action.slice(1)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default PopupDropdown;
