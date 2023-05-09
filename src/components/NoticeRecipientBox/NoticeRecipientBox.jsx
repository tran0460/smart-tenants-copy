import { useState } from "react";
import Avatar from "react-avatar";
import "./NoticeRecipientBox.css";

const NoticeRecipientBox = (props) => {
	// Component for small recipients boxes in the notice window
	let [firstName, setFirstName] = useState(
		props.user ? (props.user ? props.user.firstName : "John") : ""
	);
	let [lastName, setLastName] = useState(
		props.user ? (props.user ? props.user.lastName : "Doe") : ""
	);

	const xmark =
		//prettier-ignore
		<svg style={{display: props.viewMode === true ? 'none' : ''}} width={8} height={8} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m4 4 3.496 3.495m-6.99 0L4 4 .505 7.495Zm6.99-6.99L4 4 7.496.505ZM4 4 .505.505 4.001 4Z" stroke="#4E4D4D" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	return (
		<div className="notice-recipient-box">
			<div className="profile-image-container">
				{props.user ? (
					props.user.userProfileImage ? (
						<div className="profile-image-container">
							<img src={props.user.userProfileImage} alt="avatar" />
						</div>
					) : (
						<Avatar
							size="24"
							maxInitials={2}
							textSizeRatio={2.1}
							round={"8px"}
							name={
								props.user
									? props.user.firstName + " " + props.user.lastName
									: "John Doe"
							}
							color={`linear-gradient(180deg, ${
								props.user.colors ? props.user.colors.start : "#000"
							} 0%, ${
								props.user.colors ? props.user.colors.end : "#000"
							} 100%)`}
							className="placeholder-avatar"
						/>
					)
				) : (
					""
				)}
			</div>
			<p className="recipient-name">{firstName + " " + lastName}</p>
			<span
				style={{ cursor: "pointer" }}
				onClick={() => {
					props.recipientsList.splice(props.id, 1);
					props.setRecipientsList([...props.recipientsList]);
				}}>
				{xmark}
			</span>
		</div>
	);
};

export default NoticeRecipientBox;
