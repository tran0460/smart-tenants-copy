import React from "react";
import AnnouncementWindow from "../AnnouncementWindow/AnnouncementWindow";
import "./AnnouncementPost.css";
import Popup from "../Popup/Popup";
import { storage, db } from "../../firebase/firebase-config";
import { ref, deleteObject } from "firebase/storage";
import { doc, deleteDoc } from "firebase/firestore";

const AnnouncementPost = (props) => {
	const avatar = require("../../assets/announcement-profile-pic.png");
	const houseIcon =
		//prettier-ignore
		<svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M7 19h6m-6 0H5a4 4 0 0 1-4-4V8.708a4 4 0 0 1 1.927-3.421l5-3.03a4 4 0 0 1 4.146 0l5 3.03A4 4 0 0 1 19 8.707V15a4 4 0 0 1-4 4H7Zm0 0v-4a3 3 0 1 1 6 0v4H7Z" stroke="#0C6350" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const trashIcon =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M19 11v9.4a.6.6 0 0 1-.6.6H5.6a.6.6 0 0 1-.6-.6V11M10 17v-6M14 17v-6M8 7h8m5 0h-5 5ZM3 7h5-5Zm5 0V3.6a.6.6 0 0 1 .6-.6h6.8a.6.6 0 0 1 .6.6V7H8Z" stroke="#E71D36" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const pencilIcon =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="m13.02 5.828 4.95 4.95m-4.95-4.95L15.85 3l4.949 4.95-2.829 2.828-4.95-4.95Zm0 0-9.606 9.607a1 1 0 0 0-.293.707v4.536h4.536a1 1 0 0 0 .707-.293l9.606-9.607-4.95-4.95Z" stroke="#0C6350" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const deleteAnnouncement = () => {
		let docRef = doc(db, "Announcements", `${props.data.id}`);
		deleteDoc(docRef).then(() => {
			props.getAnnouncements();
			let fileRef = ref(storage, `Attachments/Announcements/${props.data.id}`);
			deleteObject(fileRef)
				.then(() => {
					// File deleted successfully
				})
				.catch((error) => {
					// Uh-oh, an error occurred!
				});
		});
	};
	const convertTime = () => {
		let msPerMinute = 60;
		let msPerHour = msPerMinute * 60;
		let msPerDay = msPerHour * 24;
		let msPerMonth = msPerDay * 30;
		let msPerYear = msPerMonth * 12;
		let elapsed = (
			(Date.now() / 1000).toFixed(0) - props.data?.timestamp.seconds
		).toFixed(0);
		if (!props.data?.timestamp) return "";
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
			console.log(props.data?.timestamp.seconds);
			return Math.round(elapsed / msPerYear) + " years ago";
		}
	};
	return (
		<div className="announcement-post">
			<div className="announcement-post-header">
				<div className="profile-image-container">
					<img src={avatar} alt="avatar" />
				</div>
				<div className="info">
					<div className="top-line">
						<p className="sender-name">Smart Living Properties</p>
						<div className="icons">
							<span
								onClick={() => {
									props.setAnnouncementWindow(
										<AnnouncementWindow
											windowType="edit"
											id={props.id}
											data={props.data}
											posts={props.posts}
											setPosts={props.setPosts}
											buildings={props.buildings}
											setToggleAnnouncementWindow={
												props.setToggleAnnouncementWindow
											}
											getAnnouncements={props.getAnnouncements}
											popup={props.popup}
											setPopup={props.setPopup}
											togglePopup={props.togglePopup}
											setTogglePopup={props.setTogglePopup}
											setActionStatusBox={props.setActionStatusBox}
											setToggleActionStatusBox={props.setToggleActionStatusBox}
										/>
									);
									props.setToggleAnnouncementWindow(true);
								}}>
								{pencilIcon}
							</span>
							<span
								onClick={() => {
									props.setPopup(
										<Popup
											action="delete"
											header="You are deleting an announcement"
											content="This change cannot be reverted. Do you wan to proceed?"
											cancelOnClick={() => {
												props.setTogglePopup(false);
											}}
											onConfirm={async () => {
												await deleteAnnouncement();
												props.setTogglePopup(false);
											}}
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
							<p>{props.data?.recipients[0]}</p>
						</div>
						<small>{convertTime()}</small>
					</div>
				</div>
			</div>
			<div className="announcement-post-content">
				<p className="announcement-title">{props.data?.subject}</p>
				<p>{props.data?.content}</p>
				{props.data?.attachment ? (
					props.data?.attachment[0] === "" ? (
						""
					) : (
						<img src={props.data?.attachment[0]} alt="random image" />
					)
				) : (
					""
				)}
			</div>
		</div>
	);
};

export default AnnouncementPost;
