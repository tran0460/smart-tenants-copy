import { useState, useEffect } from "react";
import ViewNoticeWindow from "../ViewNoticeWindow/ViewNoticeWindow";
import "./NoticeListItem.css";
import ReadStatusComponent from "../ReadStatusComponent/ReadStatusComponent";
import SentStatusComponent from "../SentStatusComponent/SentStatusComponent";

const NoticeListItem = (props) => {
	// A list item in the notices table in the notices screen
	let [recipients, setRecipients] = useState([]);
	let [names, setNames] = useState("");
	let [emails, setEmails] = useState("");
	let [buildings, setBuildings] = useState("");
	let [toggleNameWindow, setToggleNameWindow] = useState(false);
	let [toggleEmailWindow, setToggleEmailWindow] = useState(false);
	let [toggleBuildingWindow, setToggleBuildingWindow] = useState(false);
	// update recipients
	useEffect(() => {
		setRecipients(
			(recipients = props.data
				? props.tenants
						.map((tenant) => {
							if (props.data.recipients.includes(tenant.userID)) return tenant;
						})
						.filter((e) => e != undefined)
				: [])
		);
	}, [props.data, props.results]);
	// set the names on the list item
	useEffect(() => {
		setNames((names = ""));
		recipients.map((recipient, i) => {
			let fullName = recipient.firstName + " " + recipient.lastName;
			return setNames((names = names.concat(fullName, ", ")));
		});
		setNames((names = names.substring(0, names.length - 2)));
	}, [props.results, props.data, recipients]);
	// set the emails
	useEffect(() => {
		setEmails((emails = ""));
		recipients.map((recipient, i) => {
			if (recipients.length > 1) if (i === recipients.length) return;
			return setEmails((emails = emails.concat(recipient.email, ", ")));
		});
		setEmails((emails = emails.substring(0, emails.length - 2)));
	}, [props.results, props.data, recipients]);
	// set the buildings
	useEffect(() => {
		setBuildings((buildings = ""));
		recipients.map((recipient, i) => {
			if (recipients.length > 1) if (i === recipients.length) return;
			if (buildings.includes(recipient.buildingName)) return;
			return setBuildings(
				(buildings = buildings.concat(recipient.buildingName, ", "))
			);
		});
		setBuildings((buildings = buildings.substring(0, buildings.length - 2)));
	}, [props.results, props.data, recipients]);
	return (
		<div
			className="notice-list-item "
			onClick={() => {
				props.setViewNoticeWindow(
					<>
						<div className="dimmed-bg"></div>
						<ViewNoticeWindow
							data={props.data}
							tenants={props.tenants}
							setToggleViewNoticeWindow={props.setToggleViewNoticeWindow}
						/>
					</>
				);
				props.setToggleViewNoticeWindow(true);
			}}>
			<div
				className="notice-name-col"
				onMouseEnter={() => setToggleNameWindow(true)}
				onMouseLeave={() => setToggleNameWindow(false)}>
				<p>{names}</p>
				<div
					className="info-window"
					style={{ display: toggleNameWindow ? "flex" : "none" }}>
					<p>{names}</p>
				</div>
			</div>
			<div
				className="notice-email-col"
				onMouseEnter={() => setToggleEmailWindow(true)}
				onMouseLeave={() => setToggleEmailWindow(false)}>
				<p>{emails}</p>
				<div
					className="info-window"
					style={{ display: toggleEmailWindow ? "flex" : "none" }}>
					<p>{emails}</p>
				</div>
			</div>
			<div
				className="notice-building-col"
				onMouseEnter={() => setToggleBuildingWindow(true)}
				onMouseLeave={() => setToggleBuildingWindow(false)}>
				<p>{buildings}</p>
				<div
					className="info-window"
					style={{ display: toggleBuildingWindow ? "flex" : "none" }}>
					<p>{buildings}</p>
				</div>
			</div>
			<div className="notice-subject-col">
				<p>{props.data ? props.data.subject : ""}</p>
			</div>
			<div className="notice-date-col">
				<p>
					{props.data
						? new Date(props.data.timestamp.seconds * 1000).toLocaleDateString()
						: ""}
				</p>
			</div>
			<div className="notice-status-col">
				<ReadStatusComponent
					recipients={recipients}
					seenList={props.data?.wasSeen}
					tenants={props.tenants}
				/>
				<SentStatusComponent
					recipients={recipients}
					sentList={props.data?.recipients}
					seenList={props.data?.wasSeen}
					tenants={props.tenants}
				/>
			</div>
		</div>
	);
};
export default NoticeListItem;
