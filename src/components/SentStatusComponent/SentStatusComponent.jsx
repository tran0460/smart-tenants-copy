import React from "react";
import Avatar from "react-avatar";

import "./SentStatusComponent.css";

const SentStatusComponent = (props) => {
	//Create an array of IDs of the tenants from the list of tenants who saw the notice
	const seenList = props.seenList?.map((tenant) => tenant.userID);
	const checkmark =
		//prettier-ignore
		<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M3.333 8.666 6 11.333l6.667-6.667" stroke="#3772FF" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	return (
		<div
			onMouseEnter={props.onMouseEnter}
			onMouseLeave={props.onMouseLeave}
			className="sent-status-container"
			style={{
				display: seenList?.length === props.sentList?.length ? "none" : "",
			}}>
			<div
				className="tenants-avatar"
				style={{
					display:
						props.sentList?.length > 0 &&
						!props.hideImages &&
						props.recipients?.length > 1
							? ""
							: "none",
				}}>
				<div className="images">
					{props.tenants.map((tenant, index) => {
						if (
							seenList?.includes(tenant.userID) ||
							!props.sentList?.includes(tenant.userID) ||
							props.sentList?.findIndex((e) => e === tenant.userID) > 2
						)
							return;
						return tenant.userProfileImage === "" ? (
							<Avatar
								size="16"
								maxInitials={2}
								textSizeRatio={2}
								round={"14px"}
								style={{
									zIndex: index,
									border: "0.8px solid #ebf1ff",
								}}
								name={tenant.firstName + " " + tenant.lastName}
								color={`linear-gradient(180deg, ${
									tenant.colors ? tenant.colors.start : ""
								} 0%, ${tenant.colors ? tenant.colors.end : ""} 100%)`}
								className="placeholder-avatar"
							/>
						) : (
							<img
								src={tenant.userProfileImage}
								alt="tenant image"
								style={{
									zIndex: index,
								}}
							/>
						);
					})}
				</div>
				<p
					style={{
						display: props.sentList.length > 3 ? "" : "none",
						whiteSpace: "nowrap",
					}}>{`+${props.sentList?.length - 3}`}</p>
			</div>
			<p>Sent</p>
			<span>{checkmark}</span>
		</div>
	);
};

export default SentStatusComponent;
