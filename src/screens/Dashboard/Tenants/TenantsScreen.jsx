import { useState, useEffect, useRef } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase/firebase-config";
import ReactPaginate from "react-paginate";
import ProfileListItem from "../../../components/ProfileListItem/ProfileListItem";
import Popup from "../../../components/Popup/Popup";
import { CSVLink } from "react-csv";
import "./TenantsScreen.css";
import BuildingFilterDropdown from "../../../components/BuildingFilterDropdown/BuildingFilterDropdown";
import ActionStatusBox from "../../../components/ActionStatusBox/ActionStatusBox";

const TenantsScreen = () => {
	let [currentPageNumber, setCurrentPageNumber] = useState(1);
	let [itemsNumber, setItemsNumber] = useState(10);
	let [toggleItemsNumderDropdown, setToggleItemsNumderDropdown] =
		useState(false);
	let [showTenantInfoWindow, setShowTenantInfoWindow] = useState(false);
	let [tenantInfoWindow, setTenantInfoWindow] = useState();
	let [sendNoticeWindow, setSendNoticeWindow] = useState();
	let [tenants, , unapprovedTenants, , buildings] = useOutletContext();
	let [toggleBuildingDropdown, setToggleBuildingDropdown] = useState(false);
	let [toggleSendNoticeWindow, setToggleSendNoticeWindow] = useState(false);
	let [checkedList, setCheckedList] = useState([]);
	let [buildingsCheckedList, setBuildingsCheckedList] = useState([]);
	let [tenantsStatus, setTenantsStatus] = useState("active");
	let [activeTenantsNumber, setActiveTenantsNumber] = useState(0);
	let [inactiveTenantsNumber, setInactiveTenantsNumber] = useState(0);
	let [popup, setPopup] = useState();
	let [togglePopup, setTogglePopup] = useState();
	let [searchQuery, setSearchQuery] = useState();
	let [buildingsSearchQuery, setBuildingsSearchQuery] = useState();
	let [results, setResults] = useState([]);
	let [tenantsOnScreen, setTenantsOnScreen] = useState([]);
	let [filteredBuildings, setFilteredBuildings] = useState([]);
	let [sortBy, setSortBy] = useState();
	let [scrolling, setScrolling] = useState(false);
	let [timeout, setTimeout] = useState();
	let checkAllRef = useRef(null);
	let buildingsCheckAllRef = useRef(null);
	let [exportData, setExportData] = useState([]);
	let [actionStatusBox, setActionStatusBox] = useState();
	let [toggleActionStatusBox, setToggleActionStatusBox] = useState(false);
	let headers = [
		{ label: "First Name", key: "firstName" },
		{ label: "Last Name", key: "lastName" },
		{ label: "Email", key: "email" },
		{ label: "Building Address", key: "buildingAddress" },
		{ label: "Building Name", key: "buildingName" },
		{ label: "unit", key: "unitNumber" },
	];
	// Starting displayed item number
	let tenantsAmount = results
		? results.filter((item) => item != undefined).length
		: null;
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
	let searchInputRef = useRef(null);
	const itemsNumberChoiceList = [10, 20, 50, 100];
	let numberOfChecked = checkedList
		.map((item) => {
			if (item === true) {
				return item;
			}
		})
		.filter((item) => item != undefined).length;
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
	const handleStatusAction = async () => {
		setCheckedList((checkedList = [...checkedList]));
		setTenantsOnScreen(
			(tenantsOnScreen = tenantsOnScreen.filter((item) => item !== undefined))
		);
		await checkedList.map(async (item, index) => {
			if (item !== true) return;
			let docRef = doc(db, "Tenants", `${tenantsOnScreen[index].userID}`);
			if (tenantsStatus === "active") {
				return updateDoc(docRef, { isActive: false }).catch(async (error) => {
					await setActionStatusBox(
						<ActionStatusBox
							type="error"
							message="Something went wrong, please try again"
							setToggleActionStatusBox={setToggleActionStatusBox}
						/>
					);
					return setToggleActionStatusBox(true);
				});
			}
			return updateDoc(docRef, { isActive: true }).catch(async (error) => {
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
		setToggleActionStatusBox(true);
	};
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
					listOfBuildings={buildings}
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
	const clearSearch =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" fill="#D2D2D2" /> <path d="m12 12 2.829 2.829m-5.657 0L12.001 12 9.171 14.83Zm5.657-5.657L12 12l2.829-2.828ZM12 12 9.173 9.172 12.001 12Z" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const buildingIcon =
		//prettier-ignore
		<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M6 14.5h4m-4 0H4.667A2.667 2.667 0 0 1 2 11.833V7.638c0-.932.487-1.797 1.285-2.28l3.333-2.02a2.667 2.667 0 0 1 2.764 0l3.334 2.02A2.667 2.667 0 0 1 14 7.638v4.195a2.667 2.667 0 0 1-2.667 2.667H6Zm0 0v-2.667a2 2 0 1 1 4 0V14.5H6Z" stroke="#0C6350" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const doubleArrowGrey =
		//prettier-ignore
		<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M10.333 6.333 8 4 5.667 6.333M10.333 9.333 8 11.667 5.667 9.333" stroke="#828282" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const doubleArrow =
		//prettier-ignore
		<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M10.333 6.333 8 4 5.667 6.333M10.333 9.333 8 11.667 5.667 9.333" stroke="#0C6350" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const leftArrow =
		//prettier-ignore
		<svg style={{transform: 'rotate(180deg)'}} width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="m6 4 4 4-4 4" stroke="#4D4D4D" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const rightArrow =
		//prettier-ignore
		<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="m6 4 4 4-4 4" stroke="#4D4D4D" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const magnifyingGlass =
		//prettier-ignore
		<svg className="search-icon" width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m16 16 3.5 3.5M5 11a6 6 0 1 0 12 0 6 6 0 0 0-12 0Z" stroke="#9D9D9D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;

	useEffect(() => {
		//Select all handling
		setResults(
			(results = tenants.map((tenant, index) => {
				if (filteredBuildings.includes(tenant.buildingAddress)) {
					if (searchQuery) {
						let fullName = tenant.firstName.concat(" ", tenant.lastName);
						if (!fullName.toLowerCase().includes(searchQuery.toLowerCase()))
							return;
						if (tenantsStatus === "active" && tenant.isActive === true) {
							return tenant;
						}
						if (tenantsStatus === "inactive" && tenant.isActive === false) {
							return tenant;
						}
					}
					if (tenantsStatus === "active" && tenant.isActive === true) {
						return tenant;
					}
					if (tenantsStatus === "inactive" && tenant.isActive === false) {
						return tenant;
					}
				}
			}))
		);
		setTenantsOnScreen(
			(tenantsOnScreen = tenantsOnScreen.filter(
				(tenant) => tenant != undefined
			))
		);
		let activeTenants = tenants.filter((tenant) => {
			if (filteredBuildings.includes(tenant.buildingAddress)) {
				if (searchQuery) {
					let fullName = tenant.firstName.concat(" ", tenant.lastName);
					if (!fullName.toLowerCase().includes(searchQuery.toLowerCase()))
						return;
					if (tenant.isActive === true) return tenant;
				}
				if (tenant.isActive === true) return tenant;
			}
		});
		setActiveTenantsNumber(activeTenants.length);
		let inactiveTenants = tenants.filter((tenant) => {
			if (filteredBuildings.includes(tenant.buildingAddress)) {
				if (searchQuery) {
					let fullName = tenant.firstName.concat(" ", tenant.lastName);
					if (!fullName.toLowerCase().includes(searchQuery.toLowerCase()))
						return;
					if (tenant.isActive === false) return tenant;
				}
				if (tenant.isActive === false) return tenant;
			}
		});
		setInactiveTenantsNumber(inactiveTenants.length);
	}, [tenants, tenantsStatus, searchQuery, sortBy, filteredBuildings]);
	useEffect(() => {
		setCheckedList((checkedList = []));
		if (tenantsStatus === "active") {
			checkedList = tenantsOnScreen.map((tenant, index) => {
				if (tenant === undefined) return;
				if (tenant.isActive === true) {
					return (checkedList[index] = false);
				}
			});
		} else if (tenantsStatus === "inactive") {
			checkedList = tenantsOnScreen.map((tenant, index) => {
				if (tenant === undefined) return;
				if (tenant.isActive === false) {
					return (checkedList[index] = false);
				}
			});
		}
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
				<h2>Tenants</h2>
				<div className="search">
					{searchQuery ? (
						<span
							onClick={() => {
								searchInputRef.current.value = "";
								setSearchQuery();
							}}>
							{clearSearch}
						</span>
					) : (
						<span>{magnifyingGlass}</span>
					)}
					<input
						aria-label="search for tenants"
						ref={searchInputRef}
						className="search-input"
						name="search-input"
						id="search-input"
						type="text"
						placeholder="Search"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<Link
					tabIndex={-1}
					style={{
						textDecoration: "none",
					}}
					to="/dashboard/new-tenants">
					<button
						aria-label="go to approve new tenants"
						className="approve-new main"
						style={{ display: unapprovedTenants.length === 0 ? "none" : "" }}>
						<span
							className="notification-number"
							style={{ display: unapprovedTenants.length === 0 ? "none" : "" }}>
							{unapprovedTenants.length}
						</span>
						Manage new
					</button>
				</Link>
			</div>
			<div className="tenants-page-container">
				<div className="options-bar">
					<div className="tenant-state-filter">
						<div
							tabIndex={0}
							aria-label="view active tenants"
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									setCurrentPageNumber(1);
									setCheckedList((checkedList = []));
									setTenantsStatus("active");
								}
							}}
							onClick={() => {
								setCurrentPageNumber(1);
								setCheckedList((checkedList = []));
								setTenantsStatus("active");
							}}
							className={
								tenantsStatus === "active"
									? "active-tenants active"
									: "active-tenants "
							}>
							<p>Active</p>
							<span className="notification-number">
								<p>{activeTenantsNumber}</p>
							</span>
						</div>
						<div
							tabIndex={0}
							aria-label="view inactive tenants"
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									setCurrentPageNumber(1);
									setCheckedList((checkedList = []));
									setTenantsStatus("inactive");
								}
							}}
							onClick={() => {
								setCurrentPageNumber(1);
								setCheckedList((checkedList = []));
								setTenantsStatus("inactive");
							}}
							className={
								tenantsStatus === "inactive"
									? "inactive-tenants active"
									: "inactive-tenants "
							}>
							<p>Deactivated</p>
							<span className="notification-number">
								<p>{inactiveTenantsNumber}</p>
							</span>
						</div>
					</div>
					<div className="tenant-actions">
						<div
							tabIndex={0}
							aria-label="open building filter"
							className="building-filter"
							style={{
								border: toggleBuildingDropdown
									? "2.4px solid #C9EADA"
									: "2.4px solid transparent",
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									setToggleBuildingDropdown(!toggleBuildingDropdown);
								}
							}}
							onClick={() => {
								setToggleBuildingDropdown(!toggleBuildingDropdown);
							}}>
							<span>{buildingIcon}</span>
							<p>
								{filteredBuildings.length === buildings.length
									? "All buildings"
									: "Selected buildings"}
							</p>
							<span className="double-arrow" style={{ height: "1rem" }}>
								{doubleArrow}
							</span>
						</div>
						<CSVLink
							tabIndex={-1}
							style={{ pointerEvents: numberOfChecked === 0 ? "none" : "" }}
							filename="SLP-Tenants-Info"
							data={exportData}
							headers={headers}
							onKeyDown={async (e) => {
								if (e.key === "Enter") {
									if (numberOfChecked === 0) return false;
									setExportData((exportData = []));
									await setCheckedList((checkedList = [...checkedList]));
									await setTenantsOnScreen(
										(tenantsOnScreen = tenantsOnScreen.filter(
											(item) => item !== undefined
										))
									);
									await checkedList.map(async (item, index) => {
										if (item == true) {
											exportData[index] = tenantsOnScreen[index];
										}
									});
									setExportData(
										(exportData = [
											...exportData.filter((item) => item != undefined),
										])
									);
								}
							}}
							onClick={async () => {
								if (numberOfChecked === 0) return false;
								setExportData((exportData = []));
								await setCheckedList((checkedList = [...checkedList]));
								await setTenantsOnScreen(
									(tenantsOnScreen = tenantsOnScreen.filter(
										(item) => item !== undefined
									))
								);
								await checkedList.map(async (item, index) => {
									if (item == true) {
										exportData[index] = tenantsOnScreen[index];
									}
								});
								setExportData(
									(exportData = [
										...exportData.filter((item) => item != undefined),
									])
								);
							}}>
							<button
								disabled={numberOfChecked === 0 ? true : false}
								className={numberOfChecked === 0 ? "light disabled" : "light"}
								aria-label="export selected tenants">
								Export
								<span
									className="notification-number"
									style={{
										display: numberOfChecked === 0 ? "none" : "",
										backgroundColor: "rgba(41, 170, 107, 0.1)",
									}}>
									{numberOfChecked}
								</span>
							</button>
						</CSVLink>
						<button
							disabled={numberOfChecked === 0 ? true : false}
							className={numberOfChecked === 0 ? "danger disabled" : "danger"}
							aria-label="deactivate selected tenants"
							onClick={() => {
								setCheckedList((checkedList = [...checkedList]));
								let itemsNumber = checkedList
									.map((item) => {
										if (item === true) {
											return item;
										}
									})
									.filter((item) => item != undefined);
								if (itemsNumber.length === 0) return;
								{
									tenantsStatus === "active"
										? setPopup(
												<Popup
													action="deactivate"
													header={`You are deactivating ${itemsNumber.length} user’s account.`}
													content="They will remain in the Inactive tab for the next 30 days. After that it will be deleted permanently. Do you want to proceed?"
													setActionStatusBox={setActionStatusBox}
													setToggleActionStatusBox={setToggleActionStatusBox}
													cancelOnClick={() => {
														setTogglePopup(false);
													}}
													onConfirm={() => {
														handleStatusAction();
														setTogglePopup(false);
													}}
												/>
										  )
										: setPopup(
												<Popup
													action="reactivate"
													header={`You are reactivating ${itemsNumber.length} user’s account.`}
													content="They will have access to the mobile app again. Do you want to proceed?"
													setActionStatusBox={setActionStatusBox}
													setToggleActionStatusBox={setToggleActionStatusBox}
													cancelOnClick={() => {
														setTogglePopup(false);
													}}
													onConfirm={() => {
														handleStatusAction();
														setTogglePopup(false);
													}}
												/>
										  );
								}
								setTogglePopup(true);
							}}>
							{tenantsStatus === "active" ? "Deactivate" : "Reactivate"}
							<span
								className="notification-number"
								style={{ display: numberOfChecked === 0 ? "none" : "" }}>
								{numberOfChecked}
							</span>
						</button>
					</div>
					<div className=""></div>
				</div>
				<div
					className={scrolling ? "tenants-list scroll-visible" : "tenants-list"}
					onWheel={(e) => {
						setScrolling(true);
					}}
					onScroll={(e) => {
						window.clearTimeout(timeout);
						setTimeout(
							window.setTimeout(() => {
								setScrolling(false);
							}, 1000)
						);
					}}>
					{/* HEADER */}
					<div className="list-item list-header">
						<label htmlFor="" className="label-container">
							<input
								aria-label="select all tenants"
								type="checkbox"
								onKeyDown={(e) => {
									if (e.key === "Enter") checkAllRef.current.click();
								}}
								// onchange here so browser dont throw error
								ref={checkAllRef}
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
							className={
								toggleItemsNumderDropdown
									? "item-number-selection active"
									: "item-number-selection"
							}
							onClick={() => {
								setToggleItemsNumderDropdown(!toggleItemsNumderDropdown);
							}}>
							<p>{itemsNumber}</p>
							<span>{doubleArrowGrey}</span>
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
												handleSelectAll(true);
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
						<p
							tabIndex={0}
							aria-label={`Showing ${pageNumberFrom}-${pageNumberTo} of ${tenantsAmount} items`}>
							Showing {pageNumberFrom}-{pageNumberTo} of {tenantsAmount} items
						</p>
					</div>
					<ReactPaginate
						className={tenantsAmount === 0 ? "pagination hidden" : "pagination"}
						pageCount={Math.ceil(tenantsAmount / itemsNumber)}
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
				className="invisible-bg"
				style={{
					display:
						toggleBuildingDropdown || toggleItemsNumderDropdown ? "" : "none",
				}}
				onClick={() => {
					setToggleItemsNumderDropdown(false);
					setToggleBuildingDropdown(false);
				}}></div>
			<BuildingFilterDropdown
				buildingsCheckAllRef={buildingsCheckAllRef}
				buildings={buildings}
				buildingsCheckedList={buildingsCheckedList}
				setBuildingsCheckedList={setBuildingsCheckedList}
				buildingsSearchQuery={buildingsSearchQuery}
				setBuildingsSearchQuery={setBuildingsSearchQuery}
				handleBuildingsSelectAll={handleBuildingsSelectAll}
				toggleBuildingDropdown={toggleBuildingDropdown}
				setToggleBuildingDropdown={setToggleBuildingDropdown}
				timeout={timeout}
				setTimeout={setTimeout}
			/>
			{toggleActionStatusBox ? actionStatusBox : null}
			{showTenantInfoWindow ? tenantInfoWindow : null}
			{toggleSendNoticeWindow ? sendNoticeWindow : null}
			{togglePopup ? popup : ""}
		</div>
	);
};

export default TenantsScreen;
