import { useState } from "react";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import "./TeamScreen.css";
import AdminListItem from "../../../components/AdminListItem/AdminListItem";
import AdminWindow from "../../../components/AdminWindow/AdminWindow";
import NewAdminScreen from "../../../components/NewAdminScreen/NewAdminScreen";

const TeamScreen = () => {
	const user = {}; /* This is a fake variable for testing */
	let [currentPageNumber, setCurrentPageNumber] = useState(1);
	let [itemsNumber, setItemsNumber] = useState(10);
	let [toggleItemsNumderDropdown, setToggleItemsNumderDropdown] =
		useState(false);
	let [adminWindow, setAdminWindow] = useState();
	let [showAdminWindow, setShowAdminWindow] = useState(false);
	let [showNewAdminWindow, setShowNewAdminWindow] = useState(false);
	let [checkedList, setCheckedList] = useState([
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
	// let [team, setteam] = useState([]);
	return (
		<div className="team-screen">
			<div className="searchBar">
				<h2>Team</h2>
				<div className="search">
					{/* prettier-ignore*/}
					<svg className="search-icon" width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m16 16 3.5 3.5M5 11a6 6 0 1 0 12 0 6 6 0 0 0-12 0Z" stroke="#4E4D4D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>
					<input className="search-input" type="text" placeholder="Search" />
				</div>
				<div style={{ textDecoration: "none" }}>
					<button
						className="main approve-new"
						onClick={() => {
							setShowNewAdminWindow(true);
						}}>
						<span style={{ height: "1.5rem" }}>{plusIcon}</span>
						New team member
					</button>
				</div>
			</div>
			<div className="team-page-container">
				<div className="options-bar">
					<div className="tenant-state-filter">
						<div className="active-team-members active">
							<p>Active</p>
							<span className="notification-number">
								<p>1000</p>
							</span>
						</div>
						<div className="inactive-team-members">
							<p>Inactive</p>
							<span className="notification-number">
								<p>246</p>
							</span>
						</div>
					</div>
					<div className="tenant-actions">
						<div className="team-filter">
							{/*prettier-ignore*/}
							<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M9 21h6m-6 0H7a4 4 0 0 1-4-4v-6.292a4 4 0 0 1 1.927-3.421l5-3.03a4 4 0 0 1 4.146 0l5 3.03A4 4 0 0 1 21 10.707V17a4 4 0 0 1-4 4H9Zm0 0v-4a3 3 0 1 1 6 0v4H9Z" stroke="#4E4D4D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>
							<p>All roles</p>
							{/*prettier-ignore*/}
							<svg className="arrow" width={10} height={6} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m1 1 4 4 4-4" stroke="#111" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>
						</div>
						<div className="team-filter">
							{/*prettier-ignore*/}
							<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M9 21h6m-6 0H7a4 4 0 0 1-4-4v-6.292a4 4 0 0 1 1.927-3.421l5-3.03a4 4 0 0 1 4.146 0l5 3.03A4 4 0 0 1 21 10.707V17a4 4 0 0 1-4 4H9Zm0 0v-4a3 3 0 1 1 6 0v4H9Z" stroke="#4E4D4D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>
							<p>All teams</p>
							{/*prettier-ignore*/}
							<svg className="arrow" width={10} height={6} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m1 1 4 4 4-4" stroke="#111" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>
						</div>
						<button className="light">Export</button>
						<button className="outline">Deactivate</button>
					</div>
					<div className=""></div>
				</div>
				<div className="teams-list">
					{/* HEADER */}
					<div className="team-list-item list-header">
						<input
							type="checkbox"
							onChange={() => {}}
							onClick={(e) => {
								handleSelectAll(!e.target.checked);
							}}
							checked={checkedList.includes(false) ? false : true}
						/>
						<div className="team-image-col"></div>
						<div className="team-name-col">
							<p>Full Name</p>
							{/* high -> low icon */}
							{/* prettier-ignore */}
							<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M9.334 6.667h-8M6.667 9.333H1.334M4 12H1.333M12 4H1.334M12.666 13.333l-2-2m2-4.666v6.666-6.666Zm0 6.666 2-2-2 2Z" stroke="#828282" strokeLinecap="round" strokeLinejoin="round" /> </svg>{" "}
							{/* low -> high icon */}
							{/* prettier-ignore */}
							{/* <svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M9.334 6.667h-8M6.667 9.333H1.334M4 12H1.333M12 4H1.334M12.666 13.333l-2-2m2-4.666v6.666-6.666Zm0 6.666 2-2-2 2Z" stroke="#828282" strokeLinecap="round" strokeLinejoin="round" /> </svg> */}
						</div>
						<div className="team-role-col">
							<p>Role</p>
						</div>
						<div className="team-email-col">
							<p>Email address</p>
						</div>
						<div className="team-phone-col">
							<p>Phone numbers</p>
						</div>
						<div className="team-building-col">
							<p>Building</p>
							{/* high -> low icon */}
							{/* prettier-ignore */}
							<span>
								<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M9.334 6.667h-8M6.667 9.333H1.334M4 12H1.333M12 4H1.334M12.666 13.333l-2-2m2-4.666v6.666-6.666Zm0 6.666 2-2-2 2Z" stroke="#828282" strokeLinecap="round" strokeLinejoin="round" /> </svg>{" "}
							</span>
							{/* low -> high icon */}
							{/* prettier-ignore */}
							{/* <svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M9.334 6.667h-8M6.667 9.333H1.334M4 12H1.333M12 4H1.334M12.666 13.333l-2-2m2-4.666v6.666-6.666Zm0 6.666 2-2-2 2Z" stroke="#828282" strokeLinecap="round" strokeLinejoin="round" /> </svg> */}
						</div>
					</div>
					{/* BODY */}
					{/* {teams.map((team) => {
						return <ProfileListItem key={team.id} user={team} />;
					})} */}
					<AdminListItem
						setAdminWindow={setAdminWindow}
						setShowAdminWindow={setShowAdminWindow}
						id={0}
						checkedList={checkedList}
						setCheckedList={setCheckedList}
					/>
					<AdminListItem
						setAdminWindow={setAdminWindow}
						setShowAdminWindow={setShowAdminWindow}
						id={1}
						checkedList={checkedList}
						setCheckedList={setCheckedList}
					/>
					<AdminListItem
						setAdminWindow={setAdminWindow}
						setShowAdminWindow={setShowAdminWindow}
						id={2}
						checkedList={checkedList}
						setCheckedList={setCheckedList}
					/>
					<AdminListItem
						setAdminWindow={setAdminWindow}
						setShowAdminWindow={setShowAdminWindow}
						id={3}
						checkedList={checkedList}
						setCheckedList={setCheckedList}
					/>
					<AdminListItem
						setAdminWindow={setAdminWindow}
						setShowAdminWindow={setShowAdminWindow}
						id={4}
						checkedList={checkedList}
						setCheckedList={setCheckedList}
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
			{showNewAdminWindow ? (
				<NewAdminScreen setShowNewAdminWindow={setShowNewAdminWindow} />
			) : (
				""
			)}
			{showAdminWindow ? adminWindow : ""}
		</div>
	);
};

export default TeamScreen;
