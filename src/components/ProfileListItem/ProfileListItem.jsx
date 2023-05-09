import { useRef } from "react";
import TenantInfoWindow from "../TenantInfoWindow/TenantInfoWindow";
import Avatar from "react-avatar";
import "./ProfileListItem.css";

const ProfileListItem = (props) => {
	// A list item in the tenants table in the tenants screen
	/*
	The data will be passed in through props.user
	Refer to this link for the schema:
	https://console.firebase.google.com/u/0/project/son-demo-project/firestore/data/~2FTenants~2F2IU3aPODnnPfMI8Y3urEnB0SbxJ3
	*/
	let avatar = props.user.userProfileImage;
	let fullName = `${props.user.firstName ? props.user.firstName : "John"} ${
		props.user.lastName ? props.user.lastName : "Doe"
	}`;
	let email = props.user.email ? props.user.email : `placeholder@email.com`;
	let building = props.user.buildingName;

	let unit = props.user.unitNumber ? props.user.unitNumber : `111`;
	let checkboxRef = useRef(null);
	return (
		<div
			className="list-item"
			tabindex={0}
			aria-label={`view ${fullName}'s profile`}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					props.setTenantInfoWindow(
						<TenantInfoWindow
							listOfBuildings={props.listOfBuildings}
							setShowTenantInfoWindow={props.setShowTenantInfoWindow}
							showTenantInfoWindow={props.showTenantInfoWindow}
							user={props.user}
							sendNoticeWindow={props.sendNoticeWindow}
							setSendNoticeWindow={props.setSendNoticeWindow}
							toggleSendNoticeWindow={props.toggleSendNoticeWindow}
							setToggleSendNoticeWindow={props.setToggleSendNoticeWindow}
							popup={props.popup}
							setPopup={props.setPopup}
							togglePopup={props.togglePopup}
							setTogglePopup={props.setTogglePopup}
						/>
					);
					props.setShowTenantInfoWindow(!props.showTenantInfoWindow);
				}
			}}>
			<label htmlFor="" className="label-container">
				<input
					ref={checkboxRef}
					onKeyDown={(e) => {
						e.stopPropagation();
						if (e.key === "Enter") checkboxRef.current.click();
					}}
					aria-label={`select ${fullName}`}
					type="checkbox"
					id={props.id}
					checked={props.checkedList[props.id]}
					onChange={() => {}}
					onClick={() => {
						props.checkedList[props.id] = !props.checkedList[props.id];
						props.setCheckedList([...props.checkedList]);
					}}
				/>
				<span className="checkmark"></span>
			</label>
			<div
				className="avatar-col"
				onClick={() => {
					props.setTenantInfoWindow(
						<TenantInfoWindow
							listOfBuildings={props.listOfBuildings}
							setShowTenantInfoWindow={props.setShowTenantInfoWindow}
							showTenantInfoWindow={props.showTenantInfoWindow}
							user={props.user}
							sendNoticeWindow={props.sendNoticeWindow}
							setSendNoticeWindow={props.setSendNoticeWindow}
							toggleSendNoticeWindow={props.toggleSendNoticeWindow}
							setToggleSendNoticeWindow={props.setToggleSendNoticeWindow}
							popup={props.popup}
							setPopup={props.setPopup}
							togglePopup={props.togglePopup}
							setTogglePopup={props.setTogglePopup}
						/>
					);
					props.setShowTenantInfoWindow(!props.showTenantInfoWindow);
				}}
				style={{
					pointerEvents:
						props.user.tenantAuthorized && props.user.isActive ? "" : "none",
				}}>
				{avatar ? (
					<div className="profile-image-container">
						<img src={avatar} alt="avatar" />
					</div>
				) : (
					<Avatar
						size="64"
						maxInitials={2}
						textSizeRatio={3.1}
						round={"8px"}
						name={fullName}
						color={`linear-gradient(180deg, ${
							props.user.colors ? props.user.colors.start : ""
						} 0%, ${props.user.colors ? props.user.colors.end : ""} 100%)`}
						className="placeholder-avatar"
					/>
				)}
			</div>
			<div
				className="name-col"
				style={{
					cursor: "pointer",
					pointerEvents:
						props.user.tenantAuthorized && props.user.isActive ? "" : "none",
				}}
				onClick={() => {
					props.setTenantInfoWindow(
						<TenantInfoWindow
							listOfBuildings={props.listOfBuildings}
							setShowTenantInfoWindow={props.setShowTenantInfoWindow}
							showTenantInfoWindow={props.showTenantInfoWindow}
							user={props.user}
							sendNoticeWindow={props.sendNoticeWindow}
							setSendNoticeWindow={props.setSendNoticeWindow}
							toggleSendNoticeWindow={props.toggleSendNoticeWindow}
							setToggleSendNoticeWindow={props.setToggleSendNoticeWindow}
							popup={props.popup}
							setPopup={props.setPopup}
							togglePopup={props.togglePopup}
							setTogglePopup={props.setTogglePopup}
						/>
					);
					props.setShowTenantInfoWindow(!props.showTenantInfoWindow);
				}}>
				<p>{fullName}</p>
			</div>
			<div
				className="email-col"
				style={{
					pointerEvents:
						props.user.tenantAuthorized && props.user.isActive ? "" : "none",
				}}
				onClick={() => {
					props.setTenantInfoWindow(
						<TenantInfoWindow
							listOfBuildings={props.listOfBuildings}
							setShowTenantInfoWindow={props.setShowTenantInfoWindow}
							showTenantInfoWindow={props.showTenantInfoWindow}
							user={props.user}
							sendNoticeWindow={props.sendNoticeWindow}
							setSendNoticeWindow={props.setSendNoticeWindow}
							toggleSendNoticeWindow={props.toggleSendNoticeWindow}
							setToggleSendNoticeWindow={props.setToggleSendNoticeWindow}
							popup={props.popup}
							setPopup={props.setPopup}
							togglePopup={props.togglePopup}
							setTogglePopup={props.setTogglePopup}
						/>
					);
					props.setShowTenantInfoWindow(!props.showTenantInfoWindow);
				}}>
				<p>{email}</p>
			</div>
			<div
				className="building-col"
				style={{
					pointerEvents:
						props.user.tenantAuthorized && props.user.isActive ? "" : "none",
				}}
				onClick={() => {
					props.setTenantInfoWindow(
						<TenantInfoWindow
							listOfBuildings={props.listOfBuildings}
							setShowTenantInfoWindow={props.setShowTenantInfoWindow}
							showTenantInfoWindow={props.showTenantInfoWindow}
							user={props.user}
							sendNoticeWindow={props.sendNoticeWindow}
							setSendNoticeWindow={props.setSendNoticeWindow}
							toggleSendNoticeWindow={props.toggleSendNoticeWindow}
							setToggleSendNoticeWindow={props.setToggleSendNoticeWindow}
							popup={props.popup}
							setPopup={props.setPopup}
							togglePopup={props.togglePopup}
							setTogglePopup={props.setTogglePopup}
						/>
					);
					props.setShowTenantInfoWindow(!props.showTenantInfoWindow);
				}}>
				<p>{building}</p>
			</div>
			<div
				className="unit-col"
				style={{
					pointerEvents:
						props.user.tenantAuthorized && props.user.isActive ? "" : "none",
				}}
				onClick={() => {
					props.setTenantInfoWindow(
						<TenantInfoWindow
							listOfBuildings={props.listOfBuildings}
							setShowTenantInfoWindow={props.setShowTenantInfoWindow}
							showTenantInfoWindow={props.showTenantInfoWindow}
							user={props.user}
							sendNoticeWindow={props.sendNoticeWindow}
							setSendNoticeWindow={props.setSendNoticeWindow}
							toggleSendNoticeWindow={props.toggleSendNoticeWindow}
							setToggleSendNoticeWindow={props.setToggleSendNoticeWindow}
							popup={props.popup}
							setPopup={props.setPopup}
							togglePopup={props.togglePopup}
							setTogglePopup={props.setTogglePopup}
						/>
					);
					props.setShowTenantInfoWindow(!props.showTenantInfoWindow);
				}}>
				<p>{unit}</p>
			</div>
		</div>
	);
};

export default ProfileListItem;
