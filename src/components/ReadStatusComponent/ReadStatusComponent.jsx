import React from "react";
import Avatar from "react-avatar";
import "./ReadStatusComponent.css";

const ReadStatusComponent = (props) => {
	//Create an array of IDs of the tenants from the list of tenants who saw the notice
	const seenList = props.seenList?.map((tenant) => {
		return tenant.userID;
	});
	const checkmark =
		//prettier-ignore
		<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="m1 8.334 2.717 2.717a.4.4 0 0 0 .566 0L6 9.334M10.667 4.667 8 7.332M4.667 8l3.05 3.05a.4.4 0 0 0 .566 0l6.384-6.384" stroke="#51DC6B" strokeLinecap="round" /> </svg>;
	return (
		<div
			onMouseEnter={props.onMouseEnter}
			onMouseLeave={props.onMouseLeave}
			className="read-status-container"
			style={{
				display: seenList?.length > 0 ? "" : "none",
				cursor: "pointer",
			}}>
			<div
				className="tenants-avatar"
				style={{
					display:
						seenList?.length > 0 &&
						!props.hideImages &&
						props.recipients?.length > 1
							? ""
							: "none",
				}}>
				<div className="images">
					{props.tenants.map((tenant, index) => {
						if (
							!seenList?.includes(tenant.userID) ||
							seenList.findIndex((e) => e === tenant.userID) > 2
						)
							return;
						return tenant.userProfileImage === "" ? (
							<Avatar
								size="16"
								maxInitials={2}
								textSizeRatio={2}
								round={"14px"}
								name={tenant.firstName + " " + tenant.lastName}
								style={{
									zIndex: index,
									border: "0.8px solid #eefbf0",
								}}
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
						display: seenList?.length > 3 ? "" : "none",
						whiteSpace: "nowrap",
					}}>{`+${seenList?.length - 3}`}</p>
			</div>
			<p>Read</p>
			<span>{checkmark}</span>
		</div>
	);
};

export default ReadStatusComponent;
