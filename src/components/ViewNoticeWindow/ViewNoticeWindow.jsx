import { useState, useRef, useEffect } from "react";
import AttachmentBox from "../AttachmentBox/AttachmentBox";
import NoticeRecipientBox from "../NoticeRecipientBox/NoticeRecipientBox";
import ReadStatusComponent from "../ReadStatusComponent/ReadStatusComponent";
import SentStatusComponent from "../SentStatusComponent/SentStatusComponent";
import Avatar from "react-avatar";
import "./ViewNoticeWindow.css";

const ViewNoticeWindow = (props) => {
	//Component for viewing a notice
	let [seenList, setSeenList] = useState([]);
	let [sentList, setSentList] = useState([]);
	let [subject, setSubject] = useState(
		props.data.subject ? props.data.subject : "Notice of entry"
	);
	let [files, setFiles] = useState(props.data ? props.data.attachment : []);
	let [content, setContent] = useState(
		props.data.content ? props.data.content : ""
	);
	let [recipients, setRecipients] = useState(
		props.data
			? props.data.recipients.map((id) => {
					return props.tenants.find((e) => e.userID === id);
			  })
			: []
	);
	let [toggleViewStatusDropdown, setToggleViewStatusDropdown] = useState(false);
	let [statusDropdownType, setStatusDropdownType] = useState("read");
	// Convert timestamp to the [Day, Month + Date, Year] format
	let getNoticeTimestamp = (timestamp) => {
		let currentDate = new Date(timestamp.seconds * 1000).toDateString();
		let dayOfWeek = currentDate.split(" ")[0].concat(", ");
		let dateAndMonth = currentDate
			.split(" ")
			.slice(1, 3)
			.join(" ")
			.concat(", ");
		let year = currentDate.split(" ").slice(3, 4);
		return `${dayOfWeek}${dateAndMonth}${year}`;
	};
	const leftArrow =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m15 6-6 6 6 6" stroke="#4E4D4D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	// Create list of tenants who saw the notice, add an extra seenTimestamp prop
	useEffect(() => {
		setSeenList(
			(seenList = props.data?.wasSeen.map((tenant) => {
				let tenantData = props.tenants?.find((e) => e.userID === tenant.userID);
				return { ...tenantData, seenTimestamp: tenant.timestamp };
			}))
		);
	}, [props.data, props.tenants]);
	//Create list of tenants who DID NOT see the notice
	useEffect(() => {
		setSentList(
			(sentList = props.data?.recipients.map((tenant) => {
				let tenantData = props.tenants?.find((e) => e.userID === tenant);
				if (!props.data?.wasSeen.find((e) => e.userID === tenant.userID))
					return { ...tenantData };
			}))
		);
	}, [props.data, props.tenants]);
	return (
		<div>
			<div
				className="dimmed-bg"
				style={{ opacity: 0 }}
				onClick={() => {}}></div>
			<div className="view-notice-window">
				<div
					className="view-notice-window-back-button"
					onClick={() => {
						props.setToggleViewNoticeWindow(false);
					}}>
					{leftArrow}
					<p>View notice</p>
				</div>
				<div className="view-notice-window-content">
					<div className="notice-info-row">
						<p className="notice-date">
							{getNoticeTimestamp(props.data?.timestamp)}
						</p>
						<SentStatusComponent
							recipients={recipients}
							sentList={props.data?.recipients}
							seenList={props.data?.wasSeen}
							tenants={props.tenants}
							onMouseEnter={() => {
								setStatusDropdownType("sent");
								setToggleViewStatusDropdown(true);
							}}
							onMouseLeave={() => setToggleViewStatusDropdown(false)}
						/>
						<ReadStatusComponent
							recipients={recipients}
							seenList={props.data?.wasSeen}
							tenants={props.tenants}
							onMouseEnter={() => {
								setStatusDropdownType("read");
								setToggleViewStatusDropdown(true);
							}}
							onMouseLeave={() => setToggleViewStatusDropdown(false)}
						/>
						<div
							className="view-status-dropdown profile list-dropdown"
							style={{ display: toggleViewStatusDropdown ? "" : "none" }}>
							{statusDropdownType === "read"
								? seenList.map((tenant) => {
										if (tenant === undefined) return;
										return (
											<div className="list-item">
												{tenant.userProfileImage ? (
													<img
														src={tenant.userProfileImage}
														alt="tenant image"
														className="tenant-avatar"
													/>
												) : (
													<Avatar
														size="24"
														maxInitials={2}
														textSizeRatio={2.1}
														round={"8px"}
														name={
															tenant
																? tenant.firstName + " " + tenant.lastName
																: "John Doe"
														}
														color={`linear-gradient(180deg, ${
															tenant.colors ? tenant.colors.start : "#000"
														} 0%, ${
															tenant.colors ? tenant.colors.end : "#000"
														} 100%)`}
														className="placeholder-avatar"
													/>
												)}
												<p className="tenant-name">
													{tenant.firstName + " " + tenant.lastName}
												</p>
												<p className="timestamp">
													{getNoticeTimestamp(tenant.seenTimestamp) +
														" at " +
														new Date(
															tenant.seenTimestamp.seconds * 1000
														).toLocaleTimeString()}
												</p>
												<ReadStatusComponent
													hideImages={true}
													tenants={props.tenants}
													seenList={props.data.wasSeen}
												/>
											</div>
										);
								  })
								: sentList.map((tenant) => {
										if (tenant === undefined) return;
										return (
											<div className="list-item">
												{tenant.userProfileImage ? (
													<img
														src={tenant.userProfileImage}
														alt="tenant image"
														className="tenant-avatar"
													/>
												) : (
													<Avatar
														size="24"
														maxInitials={2}
														textSizeRatio={2.1}
														round={"8px"}
														name={
															tenant
																? tenant.firstName + " " + tenant.lastName
																: "John Doe"
														}
														color={`linear-gradient(180deg, ${
															tenant.colors ? tenant.colors.start : "#000"
														} 0%, ${
															tenant.colors ? tenant.colors.end : "#000"
														} 100%)`}
														className="placeholder-avatar"
													/>
												)}
												<p className="tenant-name">
													{tenant.firstName + " " + tenant.lastName}
												</p>
												<p className="timestamp"></p>
												<SentStatusComponent
													hideImages={true}
													tenants={props.tenants}
													sentList={sentList}
													seenList={props.data.wasSeen}
												/>
											</div>
										);
								  })}
						</div>
					</div>
					<div className="notice-recipients-row">
						<p>To:</p>
						<div className="recipients-list">
							{recipients.map((recipient, index) => {
								return (
									<NoticeRecipientBox
										viewMode={true}
										id={index}
										key={index}
										user={recipient}
										recipients={recipients}
										setRecipients={setRecipients}
									/>
								);
							})}
							<input type="text" className="notice-recipients-input" disabled />
						</div>
					</div>
					<div className="notice-subject-row">
						<p>Subject:</p>
						<input
							type="text"
							className="notice-subject-input"
							value={subject}
							disabled
						/>
					</div>
					<div className="scroll-area">
						<div
							className="notice-content-area"
							style={{
								borderBottom: files.length > 0 ? "2px solid #ededed" : "",
							}}
							onChange={(e) => {
								e.target.style.height = "auto";
								e.target.style.height = e.target.scrollHeight + "px";
							}}>
							{content}
						</div>
						<div className="notice-attachments-row">
							{files
								? files.map((file, index) => {
										return (
											<AttachmentBox
												viewOnly
												files={files}
												setFiles={setFiles}
												currentFile={file}
												key={index}
												id={index}
											/>
										);
								  })
								: ""}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ViewNoticeWindow;
