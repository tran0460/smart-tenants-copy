import { useState, useEffect } from "react";
import { db, storage } from "../../firebase/firebase-config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import Comment from "../Comment/Comment";
import PopupDropdown from "../PopupDropdown/PopupDropdown";
import Avatar from "react-avatar";
import Highlighter from "react-highlight-words";

import "./NewsfeedPost.css";

const NewsfeedPost = (props) => {
	/*
	A newsfeed post component
	Contains a newsfeed post and its comments
	*/
	let [peopleWhoLiked, setPeopleWhoLiked] = useState([]);
	let [comments, setComments] = useState();
	let [displayedComments, setDisplayedComments] = useState([]);
	let [displayedCommentsCount, setDisplayedCommentsCount] = useState(2);
	let [loading, setLoading] = useState(false);
	let [repliesCollection, setRepliesCollection] = useState([]);
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
	// Convert timestamp to time-ago
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
	// Get comments
	const getComments = () => {
		if (!props.data) return;
		setLoading(true);
		setComments((comments = []));
		setRepliesCollection((repliesCollection = []));
		let commentsRef = collection(
			db,
			"Newsfeed",
			props.data.id,
			"peopleWhoCommented"
		);
		getDocs(commentsRef)
			.then((docs) => {
				docs.forEach((doc) => {
					comments.push(doc.data());
				});
				setComments([...comments]);
				setLoading(false);
			})
			.then(() => {})
			.catch((err) => {});
	};
	const deletePost = () => {
		let docRef = doc(db, "Newsfeed", props.data.id);
		deleteDoc(docRef);
		if (props.data.images[0] === "no image posted") return;
		let fileRef = ref(
			storage,
			`Images/Posts/Newsfeed/${props.data.id}-${props.data.userID}.jpeg`
		);
		deleteObject(fileRef)
			.then(() => {
				// File deleted successfully
			})
			.catch((error) => {
				// Uh-oh, an error occurred!
			});
	};
	// Get comments when rendered
	useEffect(() => {
		getComments();
	}, [props.data]);
	// Get the people who liked the post
	useEffect(() => {
		if (!props.data) return;
		setPeopleWhoLiked((peopleWhoLiked = []));
		let likesRef = collection(db, "Newsfeed", props.data.id, "peopleWhoLiked");
		getDocs(likesRef)
			.then((docs) => {
				docs.forEach((doc) => {
					peopleWhoLiked.push(doc.data());
				});
				setPeopleWhoLiked((peopleWhoLiked = [...peopleWhoLiked]));
			})
			.catch((err) => {});
	}, [props.data]);
	// Set the comments to display, we display 2 comments by default, and when we click on load more we display all of them.
	useEffect(() => {
		setDisplayedComments(
			(displayedComments = comments
				.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds)
				.map((comment, index) => {
					if (index > displayedCommentsCount - 1) return;
					return comment;
				}))
		);
	}, [displayedCommentsCount, comments]);
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
							color={`linear-gradient(180deg, ${
								props.data.userColors ? props.data.userColors.start : ""
							} 0%, ${
								props.data.userColors ? props.data.userColors.end : ""
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
				<div className="info">
					<div className="top-line">
						<p className="sender-name">
							{props.data
								? props.data.userFirstName + " " + props.data.userLastName
								: undefined}
						</p>
						<div className="icons">
							<span
								onClick={() => {
									props.setPopup(
										<PopupDropdown
											action="delete"
											header="You are deleting a newsfeed post"
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
								{props.data ? props.data.userBuildingName : "Woodroffe Place"}
							</p>
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
							searchWords={props.keywords ? props.keywords : []}
							autoEscape={true}
							textToHighlight={props.data ? props.data.postContent : ""}
						/>
					}
				</p>
				<div className="newsfeed-post-image-container">
					{props.data ? (
						props.data.images[0] === "no image posted" ? (
							""
						) : (
							<img src={props.data.images[0]} alt="random image" />
						)
					) : (
						""
					)}
				</div>
			</div>
			<div className="newsfeed-post-actions">
				<div className="icons">
					<div className="newsfeed-post-like-icon">
						<span>{heartIcon}</span>
						<p>
							{peopleWhoLiked
								? peopleWhoLiked.length === 0
									? 0
									: peopleWhoLiked.length
								: ""}
						</p>
					</div>
					<div className="newsfeed-post-comment-icon">
						<span>{commentIcon}</span>
						<p>{comments ? comments.length : ""}</p>
					</div>
				</div>
			</div>
			{loading ? (
				<div className="loader-container">
					<span class="loader"></span>
				</div>
			) : (
				<div
					className="newsfeed-post-comments-section"
					style={{
						display: comments ? (comments.length === 0 ? "none" : "") : "",
					}}>
					{comments
						? displayedComments.map((comment, index) => {
								if (comment === undefined) return;
								return (
									<Comment
										commentCount={comments.length}
										postID={props.data.id}
										data={comment}
										id={index}
										setPopup={props.setPopup}
										setTogglePopup={props.setTogglePopup}
										userColors={props.data.userColors}
										getComments={getComments}
									/>
								);
						  })
						: ""}
				</div>
			)}
			<span
				className="load-more"
				style={{
					display: comments
						? comments.length === 0
							? "none"
							: displayedCommentsCount < comments.length
							? ""
							: comments.length > 2 &&
							  displayedCommentsCount === comments.length
							? ""
							: "none"
						: "none",
				}}
				onClick={
					comments
						? displayedCommentsCount === comments.length
							? () => {
									setDisplayedCommentsCount((displayedCommentsCount = 2));
							  }
							: () => {
									setDisplayedCommentsCount(
										(displayedCommentsCount = comments.length)
									);
							  }
						: () => {}
				}>
				{comments
					? displayedCommentsCount === comments.length
						? displayedCommentsCount === 2
							? ""
							: "Hide comments"
						: "Load more comments"
					: ""}
			</span>
		</div>
	);
};

export default NewsfeedPost;
