import { useRef } from "react";
import "./ActionStatusBox.css";

const ActionStatusBox = (props) => {
	/*
	There are 4 types of status boxes, success, info, warning, error, refer to:
	https://www.figma.com/file/2LKqA8ThjN9JZhQHB2I8D1/Smart-Tenant-%7C-Phase-2-%7C-May-2022?node-id=827%3A11252
	--
	The type of the box is determined by the prop "type"
	*/
	let parentRef = useRef(null);
	const closeIcon =
		//prettier-ignore
		<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="m8 8 3.495 3.495m-6.99 0L8 8l-3.495 3.495Zm6.99-6.99L8 8l3.495-3.495ZM8 8 4.505 4.505 8 8Z" stroke="#9D9D9D" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const warningIcon =
		//prettier-ignore
		<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M16 9.33334V17.3333" stroke="#FDCA40" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M16 22.68L16.0133 22.6652" stroke="#FDCA40" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M15.9998 29.3333C23.3636 29.3333 29.3332 23.3637 29.3332 16C29.3332 8.63621 23.3636 2.66667 15.9998 2.66667C8.63604 2.66667 2.6665 8.63621 2.6665 16C2.6665 23.3637 8.63604 29.3333 15.9998 29.3333Z" stroke="#FDCA40" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>;
	const warningIconError =
		//prettier-ignore
		<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M16 9.33334V17.3333" stroke="#E71D36" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M16 22.68L16.0133 22.6652" stroke="#E71D36" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M15.9998 29.3333C23.3636 29.3333 29.3332 23.3637 29.3332 16C29.3332 8.63621 23.3636 2.66667 15.9998 2.66667C8.63604 2.66667 2.6665 8.63621 2.6665 16C2.6665 23.3637 8.63604 29.3333 15.9998 29.3333Z" stroke="#E71D36" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>;
	const infoIcon =
		//prettier-ignore
		<svg width={32} height={32} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M16 15.333V22M16 10.013l.013-.014M16 29.333c7.364 0 13.333-5.97 13.333-13.333 0-7.364-5.97-13.333-13.333-13.333C8.636 2.667 2.666 8.637 2.666 16c0 7.364 5.97 13.333 13.334 13.333Z" stroke="#3772FF" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const successIcon =
		//prettier-ignore
		<svg width={32} height={32} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="m9.334 16.667 4 4 9.333-9.334" stroke="#51DC6B" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> <path d="M16 29.333c7.364 0 13.333-5.97 13.333-13.333 0-7.364-5.97-13.333-13.333-13.333C8.636 2.667 2.666 8.637 2.666 16c0 7.364 5.97 13.333 13.334 13.333Z" stroke="#51DC6B" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	let displayedIcon;
	switch (props.type) {
		case "success":
			displayedIcon = successIcon;
			break;
		case "info":
			displayedIcon = infoIcon;
			break;
		case "warning":
			displayedIcon = warningIcon;
			break;
		case "error":
			displayedIcon = warningIconError;
			break;
	}
	return (
		<div
			ref={parentRef}
			className={`action-status-box ${props.type} slide-in`}
			onAnimationEnd={(e) => {
				if (e.animationName === "slide-in")
					window.setTimeout(() => {
						e.target.className = `action-status-box ${props.type} slide-out`;
					}, 5000);
				if (e.animationName === "slide-out")
					window.setTimeout(() => {
						props.setToggleActionStatusBox(false);
					}, 1500);
			}}>
			<div className={`main-content ${props.type}`}>
				<span>{displayedIcon}</span>
				<p>{props.message}</p>
				<span
					className="close"
					onClick={(e) => {
						parentRef.current.className = `action-status-box ${props.type} slide-out`;
					}}>
					{closeIcon}
				</span>
			</div>
			<div className={`shadow ${props.type}`}></div>
		</div>
	);
};

export default ActionStatusBox;
