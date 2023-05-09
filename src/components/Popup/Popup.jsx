import React from "react";
import "./Popup.css";

const Popup = (props) => {
	// Popup component
	/*
	All contents are passed down from the parent component
	Required props: 
	- action: the text that appears in the green button (string)
	- header (string)
	- content (string)
	- cancelOnClick (function)
	- onConfirm (function)
	*/
	return (
		<div>
			<div className="white-dimmed-bg"></div>
			<div className="popup-container">
				<p className="popup-header">{props.header}</p>
				<p className="popup-content">{props.content}</p>
				<div className="popup-buttons">
					<p className="cancel-button" onClick={props.cancelOnClick}>
						Cancel
					</p>
					<button className="main" onClick={props.onConfirm}>
						{props.action.charAt(0).toUpperCase() + props.action.slice(1)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Popup;
