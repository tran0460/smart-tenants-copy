import { useState } from "react";
import PopupDropdown from "../PopupDropdown/PopupDropdown";
import Popup from "../Popup/Popup";
import "./UnapprovedNewsfeedPost.css";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, functions } from "../../firebase/firebase-config";
import { httpsCallable } from "firebase/functions";
import Highlighter from "react-highlight-words";

import Avatar from "react-avatar";

const UnapprovedNewsfeedPost = (props) => {
	//Newsfeed post component for flagged newsfeed posts
	//TODO: Add action status box when approving / declining a post
	let [blur, setBlur] = useState(true);
	const sendPostApproveNotification = httpsCallable(
		functions,
		"sendPostApproveNotification"
	);
	const deletePost = () => {
		let docRef = doc(db, "Newsfeed", props.data.id);
		deleteDoc(docRef);
	};
	const convertTime = () => {
		let msPerMinute = 60;
		let msPerHour = msPerMinute * 60;
		let msPerDay = msPerHour * 24;
		let msPerMonth = msPerDay * 30;
		let msPerYear = msPerDay * 36;
		let elapsed = (
			(Date.now() / 1000).toFixed(0) - props.data.timestamp.seconds
		).toFixed(0);
		if (!props.data.timestamp) return "";
		if (elapsed < msPerMinute) {
			return "0 minute ago";
		} else if (elapsed < msPerHour) {
			if (Math.round(elapsed / msPerMinute) === 1) return "1 minute ago";
			return Math.round(elapsed / msPerMinute) + " minutes ago";
		} else if (elapsed < msPerDay) {
			return Math.round(elapsed / msPerHour) + " hours ago";
		} else if (elapsed < msPerMonth) {
			return +Math.round(elapsed / msPerDay) + " days ago";
		} else if (elapsed < msPerYear) {
			return Math.round(elapsed / msPerMonth) + " months ago";
		} else {
			return +Math.round(elapsed / msPerYear) + " years ago";
		}
	};
	const hand =
		//prettier-ignore
		<svg width={32} height={32} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="m10 16-2.672 3.563a2.667 2.667 0 0 0 .167 3.402l5.046 5.503c.505.551 1.217.865 1.964.865h6.162c3.2 0 5.333-2.666 5.333-5.333V12.57" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> <path d="M22 13.333v-.762c0-3.048 4-3.048 4 0M18 13.333v-2.286c0-3.047 4-3.047 4 0v2.286M14 13.334v-3.333c0-3.048 4-3.048 4 0v3.333M14 13.334V4.666a1.999 1.999 0 1 0-4 .001V20" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const xMark =
		//prettier-ignore
		<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="m8 8 3.496 3.495m-6.99 0L8 8l-3.495 3.495Zm6.99-6.99L8 8l3.495-3.495ZM8 8 4.506 4.505 8 8Z" stroke="#E71D36" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const checkMark =
		//prettier-ignore
		<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M3.333 8.667 6 11.334l6.667-6.667" stroke="#51DC6B" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const houseIcon =
		//prettier-ignore
		<svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M7 19h6m-6 0H5a4 4 0 0 1-4-4V8.708a4 4 0 0 1 1.927-3.421l5-3.03a4 4 0 0 1 4.146 0l5 3.03A4 4 0 0 1 19 8.707V15a4 4 0 0 1-4 4H7Zm0 0v-4a3 3 0 1 1 6 0v4H7Z" stroke="#0C6350" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	return (
		<div className="newsfeed-post">
			<div className="newsfeed-post-header">
				<div className="profile-image-container">
					{props.data.userProfileImage ? (
						<img src={props.data.userProfileImage} alt="avatar" />
					) : (
						<Avatar
							size="64"
							maxInitials={2}
							textSizeRatio={3.1}
							round={"8px"}
							name={
								props.data
									? props.data.userFirstName + " " + props.data.userLastName
									: undefined
							}
							className="placeholder-avatar"
						/>
					)}
				</div>
				<div className="info">
					<div className="top-line">
						<p className="sender-name">
							{props.data
								? props.data.userFirstName + " " + props.data.userLastName
								: undefined}
						</p>
						<div className="icons">
							<span
								className="approve-post-box"
								onClick={() => {
									props.setPopup(
										<Popup
											action="approve"
											header={`You are approving ${
												props.data ? props.data.userFirstName : "an user"
											}'s post.`}
											content="It will be available for public view. The image will be unblurred."
											userID={props.data ? props.data.userID : ""}
											postID={props.data ? props.data.id : ""}
											cancelOnClick={() => {
												props.setTogglePopup(false);
											}}
											onConfirm={() => {
												props.approvePostById(props.data.id);
												props.setTogglePopup(false);
												sendPostApproveNotification({
													userID: props.data.userID,
													content: `Your newsfeed post has been approved`,
													postID: props.data.id,
												});
											}}
										/>
									);
									props.setTogglePopup(true);
								}}>
								{checkMark}
							</span>
							<span
								className="decline-post-box"
								onClick={() => {
									props.setPopup(
										<PopupDropdown
											action="decline"
											header="Please select the reason for declining the post."
											content="The author will be notified."
											userID={props.data ? props.data.userID : ""}
											postID={props.data ? props.data.id : ""}
											cancelOnClick={() => {
												props.setTogglePopup(false);
											}}
											onConfirm={() => {
												deletePost();
												props.setTogglePopup(false);
											}}
										/>
									);
									props.setTogglePopup(true);
								}}>
								{xMark}
							</span>
						</div>
					</div>
					<div className="bottom-line">
						<div className="building-address">
							<span>{houseIcon}</span>
							<p>{props.data.userBuildingName}</p>
						</div>
						<small>{convertTime()}</small>
					</div>
				</div>
			</div>
			<div className="newsfeed-post-content">
				<p>
					{
						<Highlighter
							highlightStyle={{ background: "#F9C6CD" }}
							highlightClassName="YourHighlightClass"
							searchWords={props.keywords}
							autoEscape={true}
							textToHighlight={props.data.postContent}
						/>
					}
				</p>
				<div className="newsfeed-post-image-container">
					{props.data ? (
						props.data.images[0] === "no image posted" ? (
							""
						) : (
							<img
								style={{ filter: blur ? "blur(50px)" : "", cursor: "pointer" }}
								src={props.data.images[0]}
								alt="random image"
								onClick={() => setBlur(false)}
							/>
						)
					) : (
						""
					)}
					<div
						className="click-to-reveal"
						style={{ display: blur ? "" : "none" }}>
						<p>Click to reveal</p>
						<span>{hand}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UnapprovedNewsfeedPost;
