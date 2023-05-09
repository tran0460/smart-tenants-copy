import { useState } from "react";
import { db } from "../../firebase/firebase-config";
import { deleteDoc, doc } from "firebase/firestore";

import "./MarketplacePost.css";
import PopupDropdown from "../PopupDropdown/PopupDropdown";
import Avatar from "react-avatar";
import Carousel from "react-material-ui-carousel";
import Highlighter from "react-highlight-words";

const MarketplacePost = (props) => {
	/*
	Marketplace post component, contains the post itself and its comments
	*/
	let [currentIndex, setCurrentIndex] = useState(0);
	let [carouselHeight, setCarouselHeight] = useState(0);
	let leftArrowImg = require("../../assets/left.png");
	let rightArrowImg = require("../../assets/right.png");
	const leftArrow =
		//prettier-ignore
		<svg width={57} height={60} fill="none" xmlns="http://www.w3.org/2000/svg"> <g filter="url(#a)"> <path fillRule="evenodd" clipRule="evenodd" d="M16 12a4 4 0 0 0-4 4v28a4 4 0 0 0 4 4h25a4 4 0 0 0 4-4V16a4 4 0 0 0-4-4H16Zm15.293 11.293a1 1 0 0 1 1.414 1.414L27.414 30l5.293 5.293a1 1 0 0 1-1.414 1.414l-6-6a1 1 0 0 1 0-1.414l6-6Z" fill="#fff" fillOpacity={0.9} shapeRendering="crispEdges" /> </g> <defs> <filter id="a" x={0} y={0} width={57} height={60} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB" > <feFlood floodOpacity={0} result="BackgroundImageFix" /> <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" /> <feOffset /> <feGaussianBlur stdDeviation={6} /> <feComposite in2="hardAlpha" operator="out" /> <feColorMatrix values="0 0 0 0 0.301961 0 0 0 0 0.301961 0 0 0 0 0.301961 0 0 0 0.25 0" /> <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_1979_8534" /> <feBlend in="SourceGraphic" in2="effect1_dropShadow_1979_8534" result="shape" /> </filter> </defs> </svg>;
	const rightArrow =
		//prettier-ignore
		<svg width={57} height={60} fill="none" xmlns="http://www.w3.org/2000/svg"> <g filter="url(#a)"> <path fillRule="evenodd" clipRule="evenodd" d="M16 12a4 4 0 0 0-4 4v28a4 4 0 0 0 4 4h25a4 4 0 0 0 4-4V16a4 4 0 0 0-4-4H16Zm10.707 11.293a1 1 0 0 0-1.414 1.414L30.586 30l-5.293 5.293a1 1 0 0 0 1.414 1.414l6-6a1 1 0 0 0 0-1.414l-6-6Z" fill="#fff" fillOpacity={0.9} shapeRendering="crispEdges" /> </g> <defs> <filter id="a" x={0} y={0} width={57} height={60} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB" > <feFlood floodOpacity={0} result="BackgroundImageFix" /> <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" /> <feOffset /> <feGaussianBlur stdDeviation={6} /> <feComposite in2="hardAlpha" operator="out" /> <feColorMatrix values="0 0 0 0 0.301961 0 0 0 0 0.301961 0 0 0 0 0.301961 0 0 0 0.25 0" /> <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_1979_1518" /> <feBlend in="SourceGraphic" in2="effect1_dropShadow_1979_1518" result="shape" /> </filter> </defs> </svg>;
	const commentIcon =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M21 20.29V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11.039a2 2 0 0 1 1.561.75l2.331 2.914A.6.6 0 0 0 21 20.29Z" stroke="#4D4D4D" strokeWidth={1.5} /> </svg>;
	const heartIcon =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M2 8.862a5.95 5.95 0 0 0 1.654 4.13c2.441 2.531 4.809 5.17 7.34 7.608.581.55 1.502.53 2.057-.045l7.295-7.562c2.205-2.286 2.205-5.976 0-8.261a5.58 5.58 0 0 0-8.08 0L12 5.006l-.265-.274A5.612 5.612 0 0 0 7.695 3a5.613 5.613 0 0 0-4.04 1.732A5.95 5.95 0 0 0 2 8.862Z" stroke="#4D4D4D" strokeWidth={1.5} strokeLinejoin="round" /> </svg>;
	const houseIcon =
		//prettier-ignore
		<svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M7 19h6m-6 0H5a4 4 0 0 1-4-4V8.708a4 4 0 0 1 1.927-3.421l5-3.03a4 4 0 0 1 4.146 0l5 3.03A4 4 0 0 1 19 8.707V15a4 4 0 0 1-4 4H7Zm0 0v-4a3 3 0 1 1 6 0v4H7Z" stroke="#0C6350" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const trashIcon =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M19 11v9.4a.6.6 0 0 1-.6.6H5.6a.6.6 0 0 1-.6-.6V11M10 17v-6M14 17v-6M8 7h8m5 0h-5 5ZM3 7h5-5Zm5 0V3.6a.6.6 0 0 1 .6-.6h6.8a.6.6 0 0 1 .6.6V7H8Z" stroke="#E71D36" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const pencilIcon =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="m13.02 5.828 4.95 4.95m-4.95-4.95L15.85 3l4.949 4.95-2.829 2.828-4.95-4.95Zm0 0-9.606 9.607a1 1 0 0 0-.293.707v4.536h4.536a1 1 0 0 0 .707-.293l9.606-9.607-4.95-4.95Z" stroke="#0C6350" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
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
						<p className="marketplace-post-item-name">
							{props.data?.postTitle}
						</p>
						<div className="icons">
							<span
								onClick={() => {
									props.setPopup(
										<PopupDropdown
											action="delete"
											header="You are deleting a marketplace post"
											content="This change cannot be reverted. Do you want to proceed?"
											cancelOnClick={() => {
												props.setTogglePopup(false);
											}}
											onConfirm={() => {
												deletePost();
												props.setTogglePopup(false);
											}}
											userID={props.data ? props.data.userID : ""}
											postID={props.data ? props.data.id : ""}
										/>
									);
									props.setTogglePopup(true);
								}}>
								{trashIcon}
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
						<p className="marketplace-item-price">
							{props.data.price.includes("$")
								? props.data.price
								: `$${props.data.price}`}
						</p>
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
						index={currentIndex}
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

export default MarketplacePost;
