import React from "react";
import PopupDropdown from "../PopupDropdown/PopupDropdown";
import Popup from "../Popup/Popup";
import Carousel from "react-material-ui-carousel";
import Highlighter from "react-highlight-words";
import Avatar from "react-avatar";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, functions } from "../../firebase/firebase-config";
import { httpsCallable } from "firebase/functions";

const UnapprovedMarketplacePost = (props) => {
	// Marketplace post component for flagged posts
	//TODO: Add action status box when approving / declining a post
	let leftArrowImg = require("../../assets/left.png");
	let rightArrowImg = require("../../assets/right.png");
	const sendPostApproveNotification = httpsCallable(
		functions,
		"sendPostApproveNotification"
	);
	const xMark =
		//prettier-ignore
		<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="m8 8 3.496 3.495m-6.99 0L8 8l-3.495 3.495Zm6.99-6.99L8 8l3.495-3.495ZM8 8 4.506 4.505 8 8Z" stroke="#E71D36" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const checkMark =
		//prettier-ignore
		<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M3.333 8.667 6 11.334l6.667-6.667" stroke="#51DC6B" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const houseIcon =
		//prettier-ignore
		<svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M7 19h6m-6 0H5a4 4 0 0 1-4-4V8.708a4 4 0 0 1 1.927-3.421l5-3.03a4 4 0 0 1 4.146 0l5 3.03A4 4 0 0 1 19 8.707V15a4 4 0 0 1-4 4H7Zm0 0v-4a3 3 0 1 1 6 0v4H7Z" stroke="#0C6350" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const deletePost = () => {
		let docRef = doc(db, "Marketplace", props.data.id);
		deleteDoc(docRef);
	};
	const convertTime = () => {
		let msPerMinute = 60;
		let msPerHour = msPerMinute * 60;
		let msPerDay = msPerHour * 24;
		let msPerMonth = msPerDay * 30;
		let msPerYear = msPerMonth * 12;
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
			return Math.round(elapsed / msPerDay) + " days ago";
		} else if (elapsed < msPerYear) {
			return Math.round(elapsed / msPerMonth) + " months ago";
		} else {
			return Math.round(elapsed / msPerYear) + " years ago";
		}
	};
	return (
		<div className="marketplace-post">
			<div className="marketplace-post-header">
				<div className="info">
					<div className="top-line">
						<p className="marketplace-post-item-name">{props.data.postTitle}</p>
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
													content: `Your marketplace post has been approved`,
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
							<p>
								{props.data.userBuildingName
									? props.data.userBuildingName
									: "Woodroffe Place"}
							</p>
						</div>
						<p className="marketplace-item-price">{props.data.price}</p>
					</div>
				</div>
			</div>
			<div className="marketplace-post-content">
				<p>
					{
						<Highlighter
							highlightStyle={{ background: "#F9C6CD" }}
							searchWords={props.keywords ? props.keywords : []}
							autoEscape={true}
							textToHighlight={props.data ? props.data.postContent : ""}
						/>
					}
				</p>
				{props.data.images.length === 0 ? (
					""
				) : (
					<Carousel
						autoPlay={false}
						className="carousel"
						indicators={false}
						navButtonsAlwaysVisible={true}
						animation="slide"
						duration={700}
						height={450}
						NextIcon={<img src={rightArrowImg} alt="" />}
						PrevIcon={<img src={leftArrowImg} alt="" />}
						navButtonsProps={{
							style: {
								display: props.data.images
									? props.data.images.length === 1
										? "none !important"
										: ""
									: "none !important",
							},
							className: props.data.images
								? props.data.images.length === 1
									? "hidden carousel-buttons"
									: "carousel-buttons"
								: "carousel-buttons",
						}}>
						{props.data.images
							? props.data.images.map((image, index) => {
									return (
										<img
											src={props.data.images ? props.data.images[index] : ""}
											alt="post image"
										/>
									);
							  })
							: ""}
					</Carousel>
				)}
			</div>
			<div className="marketplace-post-footer">
				<div className="profile-image-container">
					{props.data.userProfileImage ? (
						<img src={props.data.userProfileImage} alt="avatar" />
					) : (
						<Avatar
							size="48"
							maxInitials={2}
							textSizeRatio={3.2}
							round={"8px"}
							color={`linear-gradient(180deg, ${
								props.data.userColors ? props.data.userColors.start : "#000"
							} 0%, ${
								props.data.userColors ? props.data.userColors.end : "#000"
							} 100%)`}
							name={
								props.data
									? props.data.userFirstName + " " + props.data.userLastName
									: undefined
							}
							className="placeholder-avatar"
						/>
					)}
				</div>
				<p className="sender-name">
					{props.data
						? props.data.userFirstName + " " + props.data.userLastName
						: "User"}
				</p>
				<small>{convertTime()}</small>
			</div>
		</div>
	);
};

export default UnapprovedMarketplacePost;
