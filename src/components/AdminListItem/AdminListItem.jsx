import React from "react";
import AdminWindow from "../AdminWindow/AdminWindow";
import "./AdminListItem.css";

const AdminListItem = (props) => {
	let avatar = props.data
		? require(props.data.image)
		: require("../../assets/avatar-placeholder.png");
	let fullName = props.data
		? `${props.data.firstName} ${props.data.lastName}`
		: "Tracey Green";
	let role = props.data ? props.data.role : "Community Manager";
	let email = props.data ? props.data.email : "tgreen@smartlivingproperties.ca";
	let phone = props.data ? props.data.phoneNumber : "613-000-00-00";
	let building = props.data ? props.data.buildingName : "Woodroffe Place";
	return (
		<div className="team-list-item ">
			<input
				type="checkbox"
				id={props.id}
				checked={props.checkedList[props.id]}
				onChange={() => {}}
				onClick={() => {
					props.checkedList[props.id] = !props.checkedList[props.id];
					props.setCheckedList([...props.checkedList]);
				}}
			/>
			<div
				className="team-image-col"
				onClick={() => {
					props.setAdminWindow(
						<AdminWindow
							data={props.data}
							setShowAdminWindow={props.setShowAdminWindow}
						/>
					);
					props.setShowAdminWindow(true);
				}}>
				<div className="team-image-container">
					<img src={avatar} alt="avatar" />
				</div>
			</div>
			<div
				className="team-name-col"
				onClick={() => {
					props.setAdminWindow(
						<AdminWindow
							data={props.data}
							setShowAdminWindow={props.setShowAdminWindow}
						/>
					);
					props.setShowAdminWindow(true);
				}}>
				<p>{fullName}</p>
			</div>
			<div
				className="team-role-col"
				onClick={() => {
					props.setAdminWindow(
						<AdminWindow
							data={props.data}
							setShowAdminWindow={props.setShowAdminWindow}
						/>
					);
					props.setShowAdminWindow(true);
				}}>
				<p>{role}</p>
			</div>
			<div
				className="team-email-col"
				onClick={() => {
					props.setAdminWindow(
						<AdminWindow
							data={props.data}
							setShowAdminWindow={props.setShowAdminWindow}
						/>
					);
					props.setShowAdminWindow(true);
				}}>
				<p>{email}</p>
			</div>
			<div
				className="team-phone-col"
				onClick={() => {
					props.setAdminWindow(
						<AdminWindow
							data={props.data}
							setShowAdminWindow={props.setShowAdminWindow}
						/>
					);
					props.setShowAdminWindow(true);
				}}>
				<p>{phone}</p>
			</div>
			<div
				className="team-building-col"
				onClick={() => {
					props.setAdminWindow(
						<AdminWindow
							data={props.data}
							setShowAdminWindow={props.setShowAdminWindow}
						/>
					);
					props.setShowAdminWindow(true);
				}}>
				<p>{building}</p>
			</div>
		</div>
	);
};

export default AdminListItem;
