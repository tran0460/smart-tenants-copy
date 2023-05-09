import { Link, useOutletContext, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db, functions } from "../../../firebase/firebase-config";
import { httpsCallable } from "firebase/functions";
import ReactPaginate from "react-paginate";
import ProfileListItem from "../../../components/ProfileListItem/ProfileListItem";
import "./NewTenantsScreen.css";
import ActionStatusBox from "../../../components/ActionStatusBox/ActionStatusBox";

const NewTenantsScreen = () => {
	let [currentPageNumber, setCurrentPageNumber] = useState(1);
	let [itemsNumber, setItemsNumber] = useState(10);
	let [showTenantInfoWindow, setShowTenantInfoWindow] = useState(false);
	let [tenantInfoWindow, setTenantInfoWindow] = useState();
	let [sendNoticeWindow, setSendNoticeWindow] = useState();
	let [toggleSendNoticeWindow, setToggleSendNoticeWindow] = useState(false);
	let [toggleItemsNumderDropdown, setToggleItemsNumderDropdown] =
		useState(false);
	let [toggleBuildingDropdown, setToggleBuildingDropdown] = useState(false);
	let [checkedList, setCheckedList] = useState([]);
	let [searchQuery, setSearchQuery] = useState();
	let [results, setResults] = useState([]);
	let [popup, setPopup] = useState();
	let [togglePopup, setTogglePopup] = useState();
	let [tenantsOnScreen, setTenantsOnScreen] = useState([]);
	let [buildingsSearchQuery, setBuildingsSearchQuery] = useState();
	let [filteredBuildings, setFilteredBuildings] = useState([]);
	let [buildingsCheckedList, setBuildingsCheckedList] = useState([]);
	let buildingsCheckAllRef = useRef(null);
	let [sortBy, setSortBy] = useState();
	let navigate = useNavigate();
	let [actionStatusBox, setActionStatusBox] = useState(false);
	let [toggleActionStatusBox, setToggleActionStatusBox] = useState();
	let [
		tenants,
		setTenants,
		unapprovedTenants,
		setUnapprovedTenants,
		buildings,
	] = useOutletContext();
	let searchInputRef = useRef(null);
	let numberOfChecked = checkedList
		.map((item) => {
			if (item === true) {
				return item;
			}
		})
		.filter((item) => item != undefined).length;
	let tenantsAmount = results
		? results.filter((item) => item != undefined).length
		: null;
	// starting displayed item number
	let pageNumberFrom =
		currentPageNumber === 1
			? tenantsAmount === 0
				? 0
				: currentPageNumber
			: itemsNumber * currentPageNumber + 1 - itemsNumber;
	// Ending displayed item number
	let pageNumberTo =
		tenantsAmount < itemsNumber ||
		tenantsAmount < currentPageNumber * itemsNumber
			? tenantsAmount
			: currentPageNumber === 1
			? currentPageNumber * itemsNumber
			: currentPageNumber * itemsNumber;
	const deleteUserByEmail = httpsCallable(functions, "deleteUserByEmail");
	const handleBuildingsSelectAll = (checked) => {
		if (checked === false) {
			buildingsCheckedList = buildingsCheckedList.map((item, index) => {
				if (item === undefined) return;
				return (buildingsCheckedList[index] = true);
			});
			setBuildingsCheckedList(
				(buildingsCheckedList = [...buildingsCheckedList])
			);
		}
		if (checked === true) {
			buildingsCheckedList = buildingsCheckedList.map((item, index) => {
				if (item === undefined) return;
				return (buildingsCheckedList[index] = false);
			});
			setBuildingsCheckedList(
				(buildingsCheckedList = [...buildingsCheckedList])
			);
		}
	};
	let approveTenants = async () => {
		checkedList.map(async (checkbox, index) => {
			if (checkbox === false) return;
			let docRef = doc(db, "Tenants", `${unapprovedTenants[index].userID}`);
			await updateDoc(docRef, { tenantAuthorized: true }).catch(
				async (error) => {
					await setActionStatusBox(
						<ActionStatusBox
							type="error"
							message="Something went wrong, please try again"
							setToggleActionStatusBox={setToggleActionStatusBox}
						/>
					);
					return setToggleActionStatusBox(true);
				}
			);
		});
		await setActionStatusBox(
			<ActionStatusBox
				type="success"
				message="Action completed successfully"
				setToggleActionStatusBox={setToggleActionStatusBox}
			/>
		);
		return setToggleActionStatusBox(true);
	};
	let declineTenants = async () => {
		await checkedList.map(async (checkbox, index) => {
			if (checkbox === false) return;
			let docRef = doc(db, "Tenants", `${unapprovedTenants[index].userID}`);
			await deleteDoc(docRef)
				.then(() => {
					deleteUserByEmail({ email: unapprovedTenants[index].email });
				})
				.catch(async (error) => {
					await setActionStatusBox(
						<ActionStatusBox
							type="error"
							message="Something went wrong, please try again"
							setToggleActionStatusBox={setToggleActionStatusBox}
						/>
					);
					return setToggleActionStatusBox(true);
				});
		});
		await setActionStatusBox(
			<ActionStatusBox
				type="success"
				message="Action completed successfully"
				setToggleActionStatusBox={setToggleActionStatusBox}
			/>
		);
		return setToggleActionStatusBox(true);
	};
	let itemsNumberChoiceList = [10, 20, 50, 100];
	const handleSelectAll = (checked) => {
		if (checked === false) {
			checkedList = tenantsOnScreen.map((tenant, index) => {
				if (tenant === undefined) return;
				return (checkedList[index] = true);
			});
			setCheckedList(
				(checkedList = [...checkedList.filter((item) => item != undefined)])
			);
		}
		if (checked === true) {
			checkedList = tenantsOnScreen.map((tenant, index) => {
				if (tenant === undefined) return;
				return (checkedList[index] = false);
			});
			setCheckedList(
				(checkedList = [...checkedList.filter((item) => item != undefined)])
			);
		}
	};

	const magnifyingGlass =
		//prettier-ignore
		<svg className="search-icon" width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m16 16 3.5 3.5M5 11a6 6 0 1 0 12 0 6 6 0 0 0-12 0Z" stroke="#9D9D9D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const buildingIcon =
		//prettier-ignore
		<svg width={16} height={17} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M6 14.5h4m-4 0H4.667A2.667 2.667 0 0 1 2 11.833V7.638c0-.932.487-1.797 1.285-2.28l3.333-2.02a2.667 2.667 0 0 1 2.764 0l3.334 2.02A2.667 2.667 0 0 1 14 7.638v4.195a2.667 2.667 0 0 1-2.667 2.667H6Zm0 0v-2.667a2 2 0 1 1 4 0V14.5H6Z" stroke="#0C6350" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const clearSearch =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" fill="#D2D2D2" /> <path d="m12 12 2.829 2.829m-5.657 0L12.001 12 9.171 14.83Zm5.657-5.657L12 12l2.829-2.828ZM12 12 9.173 9.172 12.001 12Z" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const doubleArrow =
		//prettier-ignore
		<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M10.333 6.333 8 4 5.667 6.333M10.333 9.333 8 11.667 5.667 9.333" stroke="#0C6350" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const leftArrow =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m15 6-6 6 6 6" stroke="#4E4D4D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const rightArrow =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="m9 6 6 6-6 6" stroke="#4E4D4D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	let displayTenants = () => {
		let numberOfUndef = 0;
		let c = 0;
		tenantsOnScreen = [];
		tenantsOnScreen = results.map((tenant, index) => {
			if (pageNumberFrom && pageNumberTo) {
				if (tenant === undefined) {
					numberOfUndef++;
					return;
				}
				if (
					index < pageNumberFrom - 1 + numberOfUndef ||
					index > pageNumberTo - 1 + numberOfUndef
				)
					return;
				return tenant;
			}
		});
		switch (sortBy) {
			case "name-up":
				tenantsOnScreen.sort((a, b) => {
					if (a.firstName > b.firstName) return 1;
					return -1;
				});
				break;
			case "name-down":
				tenantsOnScreen.sort((a, b) => {
					if (a.firstName < b.firstName) return 1;
					return -1;
				});
				break;
			case "building-up":
				tenantsOnScreen.sort((a, b) => {
					if (a.buildingAddress > b.buildingAddress) return 1;
					return -1;
				});
				break;
			case "building-down":
				tenantsOnScreen.sort((a, b) => {
					if (a.buildingAddress < b.buildingAddress) return 1;
					return -1;
				});
				break;
		}
		return tenantsOnScreen.map((tenant, index) => {
			if (tenant === undefined) {
				c++;
				return;
			}
			return (
				<ProfileListItem
					key={index}
					id={index - c}
					checkedList={checkedList}
					setCheckedList={setCheckedList}
					user={tenant}
					showTenantInfoWindow={showTenantInfoWindow}
					setShowTenantInfoWindow={setShowTenantInfoWindow}
					tenantInfoWindow={tenantInfoWindow}
					setTenantInfoWindow={setTenantInfoWindow}
					sendNoticeWindow={sendNoticeWindow}
					setSendNoticeWindow={setSendNoticeWindow}
					toggleSendNoticeWindow={toggleSendNoticeWindow}
					setToggleSendNoticeWindow={setToggleSendNoticeWindow}
					popup={popup}
					setPopup={setPopup}
					togglePopup={togglePopup}
					setTogglePopup={setTogglePopup}
				/>
			);
		});
	};
	useEffect(() => {
		if (unapprovedTenants.length === 0) return navigate("/dashboard/tenants");
		//Select all handling
		setResults(
			(results = unapprovedTenants.map((tenant, index) => {
				if (filteredBuildings.includes(tenant.buildingAddress)) {
					if (searchQuery) {
						let fullName = tenant.firstName.concat(" ", tenant.lastName);
						if (!fullName.toLowerCase().includes(searchQuery.toLowerCase()))
							return;
						return tenant;
					}
					return tenant;
				}
			}))
		);
		setCheckedList((checkedList = []));
		setCheckedList(
			(checkedList = results.map((tenant, index) => {
				if (tenant === undefined) return tenant;
				if (tenant.isActive === true) {
					return (checkedList[index] = false);
				}
				return undefined;
			}))
		);
	}, [unapprovedTenants, searchQuery, filteredBuildings]);
	useEffect(() => {
		setCheckedList((checkedList = []));
		checkedList = tenantsOnScreen.map((tenant, index) => {
			if (tenant === undefined) return;
			return (checkedList[index] = false);
		});
		setCheckedList(
			(checkedList = [...checkedList.filter((item) => item != undefined)])
		);
	}, [tenantsOnScreen]);
	useEffect(() => {
		setBuildingsCheckedList(
			(buildingsCheckedList = buildings.map(() => {
				return true;
			}))
		);
	}, [buildings]);
	useEffect(() => {
		setBuildingsCheckedList((buildingsCheckedList = [...buildingsCheckedList]));
	}, [toggleBuildingDropdown]);
	useEffect(() => {
		setFilteredBuildings(
			(filteredBuildings = buildings
				.map((building, index) => {
					if (buildingsCheckedList[index] === true)
						return building.buildingAddress;
				})
				.filter((item) => item != undefined))
		);
	}, [buildingsCheckedList]);
	return (
		<div>
			<div className="searchBar">
				<Link className="back-to-tenants-link" to="/dashboard/tenants">
					{leftArrow}
					<h2>Manage new tenants</h2>
				</Link>
				<div className="search">
					{/* prettier-ignore*/}
					{searchQuery ? (
						<span
							onClick={() => {
								searchInputRef.current.value = "";
								setSearchQuery("");
							}}>
							{clearSearch}
						</span>
					) : (
						<span>{magnifyingGlass}</span>
					)}{" "}
					<input
						onChange={(e) => {
							setSearchQuery((searchQuery = e.target.value));
						}}
						ref={searchInputRef}
						className="search-input new-tenants"
						type="text"
						placeholder="Search"
					/>
				</div>
			</div>
			<div className="tenants-page-container">
				<div className="options-bar">
					<div className="tenant-actions">
						<div
							className="building-filter"
							onClick={() => {
								setToggleBuildingDropdown(!toggleBuildingDropdown);
							}}>
							<span>{buildingIcon}</span>
							<p>All buildings</p>
							<span className="double-arrow" style={{ height: "1rem" }}>
								{doubleArrow}
							</span>
						</div>
						<button
							disabled={numberOfChecked === 0 ? true : false}
							className={
								numberOfChecked === 0
									? "approve-tenant light disabled"
									: "approve-tenant light"
							}
							onClick={() => {
								if (!checkedList.includes(true)) return;
								approveTenants();
							}}>
							Approve
							<span
								className="notification-number"
								style={{ display: numberOfChecked === 0 ? "none" : "" }}>
								{numberOfChecked}
							</span>
						</button>
						<button
							disabled={numberOfChecked === 0 ? true : false}
							className={
								numberOfChecked === 0
									? "decline-tenant danger disabled"
									: "decline-tenant danger"
							}
							onClick={() => {
								declineTenants();
							}}>
							Decline
							<span
								className="notification-number"
								style={{ display: numberOfChecked === 0 ? "none" : "" }}>
								{numberOfChecked}
							</span>
						</button>
					</div>
					<div className=""></div>
				</div>
				<div className="tenants-list">
					{/* HEADER */}
					<div className="list-item list-header">
						<label htmlFor="" className="label-container">
							<input
								type="checkbox"
								onChange={() => {}}
								onClick={(e) => {
									handleSelectAll(!e.target.checked);
								}}
								checked={
									checkedList.includes(false) ||
									checkedList.includes(undefined) ||
									checkedList.length === 0
										? false
										: true
								}
							/>
							<span className="checkmark"></span>
						</label>
						<div className="avatar-col"></div>
						<div
							className="name-col"
							onClick={() => {
								if (sortBy == "name-up" || sortBy === undefined)
									return setSortBy("name-down");
								setSortBy("name-up");
							}}>
							<p style={{ marginRight: ".5rem" }}>Full name</p>
							{sortBy === "name-down" ? (
								/* prettier-ignore */
								<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M9.333 9.333h-8M6.667 6.667H1.333M4 4H1.333M12 12H1.333M12.667 2.667l-2 2m2 4.666V2.667v6.666Zm0-6.666 2 2-2-2Z" stroke="#828282" strokeLinecap="round" strokeLinejoin="round" /> </svg>
							) : (
								/* prettier-ignore */
								<svg width={17} height={16} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M9.666 6.667h-8M7 9.334H1.667M4.333 12H1.666M12.333 4H1.667M13 13.333l-2-2m2-4.667v6.667-6.667Zm0 6.667 2-2-2 2Z" stroke="#828282" strokeLinecap="round" strokeLinejoin="round" /> </svg>
							)}
						</div>
						<div className="email-col">
							<p>Email address</p>
						</div>
						<div
							className="building-col"
							onClick={() => {
								if (sortBy == "building-up" || sortBy === undefined)
									return setSortBy("building-down");
								setSortBy("building-up");
							}}>
							<p style={{ marginRight: ".5rem" }}>Building</p>
							{sortBy === "building-down" ? (
								/* prettier-ignore */
								<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M9.333 9.333h-8M6.667 6.667H1.333M4 4H1.333M12 12H1.333M12.667 2.667l-2 2m2 4.666V2.667v6.666Zm0-6.666 2 2-2-2Z" stroke="#828282" strokeLinecap="round" strokeLinejoin="round" /> </svg>
							) : (
								/* prettier-ignore */
								<svg width={17} height={16} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M9.666 6.667h-8M7 9.334H1.667M4.333 12H1.666M12.333 4H1.667M13 13.333l-2-2m2-4.667v6.667-6.667Zm0 6.667 2-2-2 2Z" stroke="#828282" strokeLinecap="round" strokeLinejoin="round" /> </svg>
							)}
						</div>
						<div className="unit-col">
							<p>Unit</p>
						</div>
					</div>
					{/* BODY */}
					{displayTenants()}
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
												setCurrentPageNumber(1);
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
							Showing {pageNumberFrom}-{pageNumberTo} of{" "}
							{results.filter((item) => item != undefined).length} items
						</p>
					</div>
					<ReactPaginate
						className={tenantsAmount === 0 ? "pagination hidden" : "pagination"}
						pageCount={Math.ceil(
							results.filter((item) => item != undefined).length / itemsNumber
						)}
						previousLabel={leftArrow}
						nextLabel={rightArrow}
						pageClassName={"pagination-numbers"}
						previousClassName={"pagination-prev-arrow"}
						nextClassName={"pagination-next-arrow"}
						disabledClassName={"pagination-disabled"}
						activeClassName={"pagination-active-link"}
						forcePage={currentPageNumber - 1}
						onPageChange={(page) => {
							handleSelectAll(true);
							setCurrentPageNumber(page.selected + 1);
						}}
					/>
				</div>
			</div>
			<div
				className="buildings-dropdown"
				style={{ display: toggleBuildingDropdown ? "" : "none" }}>
				<div className="search">
					<input
						aria-label="search for buildings"
						className="search-input"
						name="search-input"
						id="search-input"
						type="text"
						placeholder="Search buildings"
						value={buildingsSearchQuery}
						onChange={(e) => {
							setBuildingsSearchQuery(e.target.value);
						}}
					/>
					<span>{magnifyingGlass}</span>
				</div>
				<div className="buildings-list-area">
					<div
						className={
							buildingsCheckAllRef.current
								? buildingsCheckAllRef.current.checked === true
									? "buildings-list-item-header active"
									: "buildings-list-item-header"
								: ""
						}>
						<label htmlFor="" className="label-container">
							<input
								type="checkbox"
								ref={buildingsCheckAllRef}
								checked={
									buildingsCheckedList.includes(false) ||
									buildingsCheckedList.includes(undefined) ||
									buildingsCheckedList.length === 0
										? false
										: true
								}
								onChange={() => {}}
								onClick={(e) => {
									handleBuildingsSelectAll(!e.target.checked);
								}}
							/>
							<span className="checkmark"></span>
						</label>
						<p>Select all</p>
					</div>
					<ul>
						{buildings.map((building, index) => {
							if (
								buildingsSearchQuery &&
								building.buildingName
									.toLowerCase()
									.includes(buildingsSearchQuery.toLowerCase())
							) {
								return (
									<>
										<li>
											<div
												className={
													buildingsCheckedList[index] === true
														? "buildings-dropdown-list-item active"
														: "buildings-dropdown-list-item "
												}>
												<label htmlFor="" className="label-container">
													<input
														type="checkbox"
														onChange={() => {}}
														checked={buildingsCheckedList[index]}
														onClick={() => {
															buildingsCheckedList[index] =
																!buildingsCheckedList[index];
															setBuildingsCheckedList([
																...buildingsCheckedList,
															]);
														}}
													/>
													<span className="checkmark"></span>
												</label>
												<p>
													{building.buildingName
														? building.buildingName
														: "TBD"}
												</p>
											</div>
										</li>
									</>
								);
							}
							if (!buildingsSearchQuery) {
								return (
									<>
										<li>
											<div
												className={
													buildingsCheckedList[index] === true
														? "buildings-dropdown-list-item active"
														: "buildings-dropdown-list-item "
												}>
												<label htmlFor="" className="label-container">
													<input
														defaultChecked={false}
														type="checkbox"
														onChange={() => {}}
														checked={buildingsCheckedList[index]}
														onClick={() => {
															buildingsCheckedList[index] =
																!buildingsCheckedList[index];
															setBuildingsCheckedList([
																...buildingsCheckedList,
															]);
														}}
													/>
													<span className="checkmark"></span>
												</label>
												<p>
													{building.buildingName
														? building.buildingName
														: "TBD"}
												</p>
											</div>
										</li>
									</>
								);
							}
						})}
					</ul>
				</div>
			</div>
			{toggleActionStatusBox ? actionStatusBox : null}
			{showTenantInfoWindow ? tenantInfoWindow : null}
			{toggleSendNoticeWindow ? sendNoticeWindow : null}
		</div>
	);
};

export default NewTenantsScreen;
