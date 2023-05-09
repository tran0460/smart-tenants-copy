import { useState, useEffect } from "react";
import Avatar from "react-avatar";
import {
	collection,
	doc,
	deleteDoc,
	updateDoc,
	getDocs,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import Popup from "../Popup/Popup";

import "./Comment.css";

const Comment = (props) => {
	/*
	Comment component for each comment, contains a comment and its replies
	*/
	let [replies, setReplies] = useState([]);
	const [displayedRepliesCount, setDisplayedRepliesCount] = useState(2);
	const [loading, setLoading] = useState(false);
	const deleteComment = () => {
		let docRef = doc(
			db,
			"Newsfeed",
			props.postID,
			"peopleWhoCommented",
			props.data.id
		);
		deleteDoc(docRef)
			.then(() => props.getComments())
			.catch((err) => {
				console.warn(err);
			});
	};
	const deleteReply = (id) => {
		let docRef = doc(
			db,
			"Newsfeed",
			props.postID,
			"peopleWhoCommented",
			props.data.id,
			"peopleWhoReplied",
			id
		);
		deleteDoc(docRef).then(() => {
			updateDoc(
				doc(db, "Newsfeed", props.postID, "peopleWhoCommented", props.data.id),
				{
					repliesCount: replies.length - 1,
				}
			).then(() => {
				getReplies();
			});
		});
	};
	const getReplies = () => {
		setLoading(true);
		setReplies((replies = []));
		let repliesRef = collection(
			db,
			"Newsfeed",
			props.postID,
			"peopleWhoCommented",
			props.data.id,
			"peopleWhoReplied"
		);
		getDocs(repliesRef)
			.then((docs) => {
				if (docs.empty) return;
				docs.forEach((doc) => {
					let data = doc.data();
					replies.push(data);
				});
			})
			.then(() => {
				setReplies(
					(replies = replies.sort(
						(a, b) => b.timestamp.seconds - a.timestamp.seconds
					))
				);
				setLoading(false);
			});
	};
	const convertTime = (timestamp) => {
		let msPerMinute = 60;
		let msPerHour = msPerMinute * 60;
		let msPerDay = msPerHour * 24;
		let msPerMonth = msPerDay * 30;
		let msPerYear = msPerDay * 36;
		if (!timestamp) return 0;
		let elapsed = ((Date.now() / 1000).toFixed(0) - timestamp).toFixed(0);
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
	const trashIcon =
		//prettier-ignore
		<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M12.667 7.333V13.6a.4.4 0 0 1-.4.4H3.733a.4.4 0 0 1-.4-.4V7.333M6.667 11.333v-4M9.333 11.333v-4M5.333 4.667h5.334m3.333 0h-3.333H14Zm-12 0h3.333H2Zm3.333 0V2.4c0-.22.18-.4.4-.4h4.534c.22 0 .4.18.4.4v2.267H5.333Z" stroke="#E71D36" strokeLinecap="round" strokeLinejoin="round" /> </svg>;

	useEffect(() => {
		getReplies();
	}, [props.data]);
	return (
		<div className="comment-area">
			<div className="comment-container">
				<div className="comment-info-row">
					<div className="profile-image-container">
						{props.data.userProfileImage ? (
							<img src={props.data.userProfileImage} alt="avatar" />
						) : (
							<Avatar
								size="32"
								maxInitials={2}
								textSizeRatio={3.1}
								round={"8px"}
								color={`linear-gradient(180deg, ${
									props.userColors ? props.userColors.start : ""
								} 0%, ${props.userColors ? props.userColors.end : ""} 100%)`}
								name={props.data.firstName + " " + props.data.lastName}
								className="placeholder-avatar"
							/>
						)}
					</div>
					<div className="comment-info">
						<div>
							<p className="commentor-name">
								{props.data
									? props.data.firstName + " " + props.data.lastName
									: "John Doe"}
							</p>
							<div>
								<small>{convertTime(props.data.timestamp.seconds)}</small>
							</div>
							<span
								onClick={() => {
									props.setPopup(
										<Popup
											action="delete"
											header={`You are deleting ${props.data.firstName}'s comment`}
											content="This change cannot be reverted. Do you want to proceed?"
											cancelOnClick={() => {
												props.setTogglePopup(false);
											}}
											onConfirm={() => {
												deleteComment();
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
				</div>
				{/*****************REPLIES SECTION*****************/}
				<div className="comment-content-area">
					<p className="comment-content">
						{props.data
							? props.data.commentContent
							: " Vestibulum sem tortor, feugiat."}
					</p>
				</div>
			</div>
			{loading ? (
				<div className="loader-container" style={{ marginTop: "1rem" }}>
					<span class="loader"></span>
				</div>
			) : (
				<div
					className="reply-area"
					style={{ display: replies.length === 0 ? "none" : "" }}>
					{replies.length != 0
						? replies.map((reply, index) => {
								if (index + 1 > displayedRepliesCount || reply === undefined)
									return;
								return (
									<div className="comment-container reply">
										<div className="comment-info-row">
											<div className="profile-image-container">
												{reply.userProfileImage ? (
													<img src={reply.userProfileImage} alt="avatar" />
												) : (
													<Avatar
														size="32"
														maxInitials={2}
														textSizeRatio={3.1}
														round={"8px"}
														color={`linear-gradient(180deg, ${
															reply.colors ? reply.colors.start : ""
														} 0%, ${
															reply.colors ? reply.colors.end : ""
														} 100%)`}
														name={reply.firstName + " " + reply.lastName}
														className="placeholder-avatar"
													/>
												)}
											</div>
											<div className="comment-info">
												<div>
													<p className="commentor-name">
														{reply.firstName + " " + reply.lastName}
													</p>
													<div>
														<small>
															{convertTime(reply.timestamp.seconds)}
														</small>
													</div>
													<span
														onClick={() => {
															props.setPopup(
																<Popup
																	action="delete"
																	header={`You are deleting ${reply.firstName}'s reply`}
																	content="This change cannot be reverted. Do you want to proceed?"
																	cancelOnClick={() => {
																		props.setTogglePopup(false);
																	}}
																	onConfirm={async () => {
																		await deleteReply(reply.id);
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
										</div>
										<div className="comment-content-area">
											<p className="comment-content">{reply.commentContent}</p>
										</div>
									</div>
								);
						  })
						: ""}
					<span
						className="load-more reply"
						style={{
							display:
								replies.length > displayedRepliesCount
									? ""
									: replies.length <= displayedRepliesCount
									? "none"
									: "",
						}}
						onClick={(e) => {
							if (e.target.textContent === "Show more replies") {
								return setDisplayedRepliesCount(replies.length);
							}
							return setDisplayedRepliesCount(2);
						}}>
						{displayedRepliesCount === replies.length
							? "Show less replies"
							: "Show more replies"}
					</span>
				</div>
			)}
		</div>
	);
};

export default Comment;
