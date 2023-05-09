import React from "react";
import "./BuildingListItem.css";
import BuildingWindow from "../BuildingWindow/BuildingWindow";

const BuildingListItem = (props) => {
	let buildingName = props.data ? props.data.buildingName : "Algonquin Place";
	let buildingAddress = props.data
		? props.buildingAddress
		: "101-115 Amaya , Ottawa, ON";
	let mainContact = props.data
		? props.data.contacts.find((contact) => contact.main === true)
		: {
				email: "tgreen@smartlivingproperties.com",
				fullName: "Tracey Green",
				main: true,
				phone: "613-244-1551",
		  };
	let buildingImage = props.data
		? props.data.buildingImage
		: "https://firebasestorage.googleapis.com/v0/b/son-demo-project.appspot.com/o/Images%2FBuildings%2Fplaceholder-house-img.jpg?alt=media&token=9758a38d-4737-40ff-bb8b-ac9319a5317a";
	return (
		<div className="building-list-item">
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
				className="building-image-col"
				onClick={() => {
					props.setViewBuildingWindow(
						<BuildingWindow
							data={props.data}
							setToggleViewBuildingWindow={props.setToggleViewBuildingWindow}
						/>
					);
					props.setToggleViewBuildingWindow(true);
				}}>
				<div className="building-image-container">
					<img src={buildingImage} alt="building image" />
				</div>
			</div>
			<div
				className="building-name-col"
				onClick={() => {
					props.setViewBuildingWindow(
						<BuildingWindow
							data={props.data}
							setToggleViewBuildingWindow={props.setToggleViewBuildingWindow}
						/>
					);
					props.setToggleViewBuildingWindow(true);
				}}>
				<p>{buildingName}</p>
			</div>
			<div
				className="building-address-col"
				onClick={() => {
					props.setViewBuildingWindow(
						<BuildingWindow
							data={props.data}
							setToggleViewBuildingWindow={props.setToggleViewBuildingWindow}
						/>
					);
					props.setToggleViewBuildingWindow(true);
				}}>
				<p>{buildingAddress}</p>
			</div>
			<div
				className="building-contact-col"
				onClick={() => {
					props.setViewBuildingWindow(
						<BuildingWindow
							data={props.data}
							setToggleViewBuildingWindow={props.setToggleViewBuildingWindow}
						/>
					);
					props.setToggleViewBuildingWindow(true);
				}}>
				<p>{mainContact.fullName}</p>
			</div>
			<div
				className="building-email-col"
				onClick={() => {
					props.setViewBuildingWindow(
						<BuildingWindow
							data={props.data}
							setToggleViewBuildingWindow={props.setToggleViewBuildingWindow}
						/>
					);
					props.setToggleViewBuildingWindow(true);
				}}>
				<p>{mainContact.email}</p>
			</div>
			<div
				className="building-phone-col"
				onClick={() => {
					props.setViewBuildingWindow(
						<BuildingWindow
							data={props.data}
							setToggleViewBuildingWindow={props.setToggleViewBuildingWindow}
						/>
					);
					props.setToggleViewBuildingWindow(true);
				}}>
				<p>{mainContact.phone}</p>
			</div>
		</div>
	);
};

export default BuildingListItem;
