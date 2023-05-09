import { useState } from "react";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import "./BuildingsScreen.css";
import BuildingListItem from "../../../components/BuildingListItem/BuildingListItem";
import NewBuildingWindow from "../../../components/NewBuildingWindow/NewBuildingWindow";
import BuildingWindow from "../../../components/BuildingWindow/BuildingWindow";

const BuildingsScreen = () => {
	const user = {}; /* This is a fake variable for testing */
	let [currentPageNumber, setCurrentPageNumber] = useState(1);
	let [itemsNumber, setItemsNumber] = useState(10);
	let [toggleItemsNumderDropdown, setToggleItemsNumderDropdown] =
		useState(false);
	let [toggleNewBuildingWindow, setToggleNewBuildingWindow] = useState(false);
	let [viewBuildingWindow, setViewBuildingWindow] = useState();
	let [toggleViewBuildingWindow, setToggleViewBuildingWindow] = useState(false);
	let [checkedList, setCheckedList] = useState([
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
	]);
	let handleSelectAll = (checked) => {
		if (checked === false) {
			checkedList.forEach((checkbox, index) => {
				checkedList[index] = true;
			});
			setCheckedList([...checkedList]);
		}
		if (checked === true) {
			checkedList.forEach((checkbox, index) => {
				checkedList[index] = false;
			});
			setCheckedList([...checkedList]);
		}
	};
	let itemsNumberChoiceList = [10, 20, 50, 100];
	const plusIcon =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M12 12v6m-6-6h6-6Zm12 0h-6 6Zm-6 0V6v6Z" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const doubleArrow =
		//prettier-ignore
		<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M10.333 6.333 8 4 5.667 6.333M10.333 9.333 8 11.667 5.667 9.333" stroke="#9D9D9D" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const leftArrow =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m15 6-6 6 6 6" stroke="#4E4D4D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const rightArrow =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="m9 6 6 6-6 6" stroke="#4E4D4D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	return (
		<div className="buildings-page">
			<div className="searchBar">
				<h2>Buildings</h2>
				<div className="search">
					{/* prettier-ignore*/}
					<svg className="search-icon" width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m16 16 3.5 3.5M5 11a6 6 0 1 0 12 0 6 6 0 0 0-12 0Z" stroke="#4E4D4D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>
					<input className="search-input" type="text" placeholder="Search" />
				</div>
				<button
					className="main approve-new"
					onClick={() => {
						setToggleNewBuildingWindow(true);
					}}>
					<span style={{ height: "1.5rem" }}>{plusIcon}</span>
					New building
				</button>
			</div>
			<div className="buildings-page-container">
				<div className="options-bar">
					<div className="building-actions">
						<button className="light">Export</button>
						<button className="outline">Deactivate</button>
					</div>
					<div className=""></div>
				</div>
				<div className="buildings-list">
					{/* HEADER */}
					<div className="building-list-item list-header">
						<input
							type="checkbox"
							onChange={() => {}}
							onClick={(e) => {
								handleSelectAll(!e.target.checked);
							}}
							checked={checkedList.includes(false) ? false : true}
						/>
						<div className="building-image-col"></div>
						<div className="building-name-col">
							<p>Building</p>
							{/* high -> low icon */}
							{/* prettier-ignore */}
							<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M9.334 6.667h-8M6.667 9.333H1.334M4 12H1.333M12 4H1.334M12.666 13.333l-2-2m2-4.666v6.666-6.666Zm0 6.666 2-2-2 2Z" stroke="#828282" strokeLinecap="round" strokeLinejoin="round" /> </svg>{" "}
							{/* low -> high icon */}
							{/* prettier-ignore */}
							{/* <svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M9.334 6.667h-8M6.667 9.333H1.334M4 12H1.333M12 4H1.334M12.666 13.333l-2-2m2-4.666v6.666-6.666Zm0 6.666 2-2-2 2Z" stroke="#828282" strokeLinecap="round" strokeLinejoin="round" /> </svg> */}
						</div>
						<div className="building-address-col">
							<p>Building address</p>
							{/* high -> low icon */}
							{/* prettier-ignore */}
							<span>
								<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M9.334 6.667h-8M6.667 9.333H1.334M4 12H1.333M12 4H1.334M12.666 13.333l-2-2m2-4.666v6.666-6.666Zm0 6.666 2-2-2 2Z" stroke="#828282" strokeLinecap="round" strokeLinejoin="round" /> </svg>{" "}
							</span>
							{/* low -> high icon */}
							{/* prettier-ignore */}
							{/* <svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M9.334 6.667h-8M6.667 9.333H1.334M4 12H1.333M12 4H1.334M12.666 13.333l-2-2m2-4.666v6.666-6.666Zm0 6.666 2-2-2 2Z" stroke="#828282" strokeLinecap="round" strokeLinejoin="round" /> </svg> */}
						</div>
						<div className="building-contact-col">
							<p>Primary contact</p>
						</div>
						<div className="building-email-col">
							<p>Email address</p>
						</div>
						<div className="building-phone-col">
							<p>Phone number</p>
						</div>
					</div>
					{/* BODY */}
					{/* {buildings.map((building) => {
						return <ProfileListItem key={building.id} user={building} />;
					})} */}
					<BuildingListItem
						setViewBuildingWindow={setViewBuildingWindow}
						setToggleViewBuildingWindow={setToggleViewBuildingWindow}
						id={0}
						checkedList={checkedList}
						setCheckedList={setCheckedList}
						user={user}
					/>
					<BuildingListItem
						setViewBuildingWindow={setViewBuildingWindow}
						setToggleViewBuildingWindow={setToggleViewBuildingWindow}
						id={1}
						checkedList={checkedList}
						setCheckedList={setCheckedList}
						user={user}
					/>
					<BuildingListItem
						setViewBuildingWindow={setViewBuildingWindow}
						setToggleViewBuildingWindow={setToggleViewBuildingWindow}
						id={2}
						checkedList={checkedList}
						setCheckedList={setCheckedList}
						user={user}
					/>
					<BuildingListItem
						setViewBuildingWindow={setViewBuildingWindow}
						setToggleViewBuildingWindow={setToggleViewBuildingWindow}
						id={3}
						checkedList={checkedList}
						setCheckedList={setCheckedList}
						user={user}
					/>
					<BuildingListItem
						setViewBuildingWindow={setViewBuildingWindow}
						setToggleViewBuildingWindow={setToggleViewBuildingWindow}
						id={4}
						checkedList={checkedList}
						setCheckedList={setCheckedList}
						user={user}
					/>
					<BuildingListItem
						setViewBuildingWindow={setViewBuildingWindow}
						setToggleViewBuildingWindow={setToggleViewBuildingWindow}
						id={5}
						checkedList={checkedList}
						setCheckedList={setCheckedList}
						user={user}
					/>
					<BuildingListItem
						setViewBuildingWindow={setViewBuildingWindow}
						setToggleViewBuildingWindow={setToggleViewBuildingWindow}
						id={6}
						checkedList={checkedList}
						setCheckedList={setCheckedList}
						user={user}
					/>
					<BuildingListItem
						setViewBuildingWindow={setViewBuildingWindow}
						setToggleViewBuildingWindow={setToggleViewBuildingWindow}
						id={7}
						checkedList={checkedList}
						setCheckedList={setCheckedList}
						user={user}
					/>
					<BuildingListItem
						setViewBuildingWindow={setViewBuildingWindow}
						setToggleViewBuildingWindow={setToggleViewBuildingWindow}
						id={8}
						checkedList={checkedList}
						setCheckedList={setCheckedList}
						user={user}
					/>
				</div>
				<div className="footer">
					<div className="number-filter">
						<p>Show</p>
						<div
							className="item-number-selection"
							onClick={() => {
								setToggleItemsNumderDropdown(!toggleItemsNumderDropdown);
							}}>
							<p>{itemsNumber}</p>
							<span>{doubleArrow}</span>
						</div>
						<div
							className="items-number-dropdown"
							style={{ display: toggleItemsNumderDropdown ? "" : "none" }}>
							<ul style={{ flexDirection: "column-reverse" }}>
								{itemsNumberChoiceList.map((number, index) => {
									return (
										<li
											className={
												itemsNumber === number
													? "items-number-choice active"
													: "items-number-choice"
											}
											key={index}
											onClick={(e) => {
												setItemsNumber(parseInt(e.currentTarget.textContent));
												setToggleItemsNumderDropdown(false);
											}}>
											{number}
										</li>
									);
								})}
							</ul>
						</div>
						<p>items</p>
						<p>
							Showing{" "}
							{currentPageNumber === 1
								? currentPageNumber
								: itemsNumber * currentPageNumber + 1 - itemsNumber}
							-
							{currentPageNumber === 1
								? currentPageNumber * itemsNumber
								: currentPageNumber * itemsNumber}{" "}
							of 1056 items
						</p>
					</div>
					<ReactPaginate
						className="pagination"
						pageCount={5}
						previousLabel={leftArrow}
						nextLabel={rightArrow}
						pageClassName={"pagination-numbers"}
						previousClassName={"pagination-prev-arrow"}
						nextClassName={"pagination-next-arrow"}
						disabledClassName={"pagination-disabled"}
						activeClassName={"pagination-active-link"}
						onPageChange={(page) => {
							setCurrentPageNumber(page.selected + 1);
						}}
					/>
				</div>
			</div>
			{toggleViewBuildingWindow ? viewBuildingWindow : ""}
			{toggleNewBuildingWindow ? (
				<NewBuildingWindow
					setToggleNewBuildingWindow={setToggleNewBuildingWindow}
				/>
			) : (
				""
			)}
		</div>
	);
};

export default BuildingsScreen;
