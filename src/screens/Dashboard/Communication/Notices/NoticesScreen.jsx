import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { db } from "../../../../firebase/firebase-config";
import { getDocs, collection } from "firebase/firestore";
import ReactPaginate from "react-paginate";
import NoticeListItem from "../../../../components/NoticeListItem/NoticeListItem";
import SendNoticeWindow from "../../../../components/SendNoticeWindow/SendNoticeWindow";
import ViewNoticeWindow from "../../../../components/ViewNoticeWindow/ViewNoticeWindow";
import BuildingFilterDropdown from "../../../../components/BuildingFilterDropdown/BuildingFilterDropdown";
import Popup from "../../../../components/Popup/Popup";
import "./NoticesScreen.css";

const NoticesScreen = () => {
	const [tenants, buildings] = useOutletContext();
	let [currentPageNumber, setCurrentPageNumber] = useState(1);
	let [itemsNumber, setItemsNumber] = useState(10);
	let [toggleItemsNumderDropdown, setToggleItemsNumderDropdown] =
		useState(false);
	let [toggleSendNoticeWindow, setToggleSendNoticeWindow] = useState(false);
	let [viewNoticeWindow, setViewNoticeWindow] = useState();
	let [toggleViewNoticeWindow, setToggleViewNoticeWindow] = useState(false);
	let [checkedList, setCheckedList] = useState([]);
	let [notices, setNotices] = useState([]);
	let [toggleDateFilter, setToggleDateFilter] = useState(false);
	let [dateFilterOption, setDateFilterOption] = useState("all time");
	let [filteredBuildings, setFilteredBuildings] = useState([]);
	let [results, setResults] = useState([]);
	let [toggleBuildingDropdown, setToggleBuildingDropdown] = useState(false);
	let [buildingsCheckedList, setBuildingsCheckedList] = useState([]);
	let [buildingsSearchQuery, setBuildingsSearchQuery] = useState();
	let [popup, setPopup] = useState();
	let [togglePopup, setTogglePopup] = useState(false);
	let [nameSortOrder, setNameSortOrder] = useState("");
	let [dateSortOrder, setDateSortOrder] = useState("");
	let [buildingSortOrder, setBuildingSortOrder] = useState("");
	let [query, setQuery] = useState("");
	let [timeout, setTimeout] = useState();
	let [dateFrom, setDateFrom] = useState(0);
	let [dateTo, setDateTo] = useState(0);
	let dateFromRef = useRef(null);
	let dateToRef = useRef(null);
	let buildingsCheckAllRef = useRef(null);
	let itemsNumberChoiceList = [10, 20, 50, 100];
	let searchInputRef = useRef(null);
	const getNotices = () => {
		setNotices((notices = []));
		let noticesRef = collection(db, "Notices");
		getDocs(noticesRef).then((snap) => {
			snap.forEach((notice) => {
				notices.push(notice.data());
			});
			setNotices((notices = [...notices]));
		});
	};
	const displayNotices = () => {
		let numberOfUndef = 0;
		let c = 0;
		let noticesOnScreen = [];
		noticesOnScreen = results.map((notices, index) => {
			if (pageNumberFrom && pageNumberTo) {
				if (notices === undefined) {
					numberOfUndef++;
					return;
				}
				if (
					index < pageNumberFrom - 1 + numberOfUndef ||
					index > pageNumberTo - 1 + numberOfUndef
				)
					return;
				return notices;
			}
		});
		return noticesOnScreen.map((notice, index) => {
			if (notice === undefined) return;
			return (
				<NoticeListItem
					tenants={tenants}
					key={index}
					data={notice}
					results={results}
					setViewNoticeWindow={setViewNoticeWindow}
					setToggleViewNoticeWindow={setToggleViewNoticeWindow}
				/>
			);
		});
	};
	const dateSort = () => {
		setNameSortOrder("");
		setBuildingSortOrder("");
		if (dateSortOrder === "up") {
			setResults(
				(results = results.sort((a, b) => {
					if (a.timestamp.seconds > b.timestamp.seconds) return 1;
					return -1;
				}))
			);
		}
		if (dateSortOrder === "down") {
			setResults(
				(results = results.sort((a, b) => {
					if (a.timestamp.seconds < b.timestamp.seconds) return 1;
					return -1;
				}))
			);
		}
	};
	const nameSort = () => {
		setDateSortOrder("");
		setBuildingSortOrder("");
		if (nameSortOrder === "down") {
			setResults(
				(results = results.sort((a, b) => {
					let a_firstName = a.recipients.map((item) =>
						tenants.find((e) => e.userID === item)
					)[0].firstName;
					let b_firstName = b.recipients.map((item) =>
						tenants.find((e) => e.userID === item)
					)[0].firstName;
					if (a_firstName > b_firstName) return 1;
					return -1;
				}))
			);
		}
		if (nameSortOrder === "up") {
			setResults(
				(results = results.sort((a, b) => {
					let a_firstName = a.recipients.map((item) =>
						tenants.find((e) => e.userID === item)
					)[0].firstName;
					let b_firstName = b.recipients.map((item) =>
						tenants.find((e) => e.userID === item)
					)[0].firstName;
					if (a_firstName < b_firstName) return 1;
					return -1;
				}))
			);
		}
	};
	const buildingSort = () => {
		setNameSortOrder("");
		setDateSortOrder("");
		if (buildingSortOrder === "down") {
			setResults(
				(results = results.sort((a, b) => {
					let a_building = a.recipients.map((item) =>
						tenants.find((e) => e.userID === item)
					)[0].buildingName;
					let b_building = b.recipients.map((item) =>
						tenants.find((e) => e.userID === item)
					)[0].buildingName;
					if (a_building < b_building) return 1;
					return -1;
				}))
			);
		}
		if (buildingSortOrder === "up") {
			setResults(
				(results = results.sort((a, b) => {
					let a_building = a.recipients.map((item) =>
						tenants.find((e) => e.userID === item)
					)[0].buildingName;
					let b_building = b.recipients.map((item) =>
						tenants.find((e) => e.userID === item)
					)[0].buildingName;
					if (a_building > b_building) return 1;
					return -1;
				}))
			);
		}
	};
	// Handle the select all feature for the checked list in the building dropdown
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
	// Starting displayed item number
	let noticesAmount = results
		? results.filter((item) => item != undefined).length
		: null;
	let pageNumberFrom =
		currentPageNumber === 1
			? noticesAmount === 0
				? 0
				: currentPageNumber
			: itemsNumber * currentPageNumber + 1 - itemsNumber;
	// Ending displayed item number
	let pageNumberTo =
		noticesAmount < itemsNumber ||
		noticesAmount < currentPageNumber * itemsNumber
			? noticesAmount
			: currentPageNumber === 1
			? currentPageNumber * itemsNumber
			: currentPageNumber * itemsNumber;
	const doubleArrowGrey =
		//prettier-ignore
		<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M10.333 6.333 8 4 5.667 6.333M10.333 9.333 8 11.667 5.667 9.333" stroke="#828282" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const magnifyingGlass =
		//prettier-ignore
		<svg className="search-icon" width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m16 16 3.5 3.5M5 11a6 6 0 1 0 12 0 6 6 0 0 0-12 0Z" stroke="#9D9D9D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const clearSearch =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" fill="#D2D2D2" /> <path d="m12 12 2.829 2.829m-5.657 0L12.001 12 9.171 14.83Zm5.657-5.657L12 12l2.829-2.828ZM12 12 9.173 9.172 12.001 12Z" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const buildingIcon =
		//prettier-ignore
		<svg width={16} height={17} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M6 14.5h4m-4 0H4.667A2.667 2.667 0 0 1 2 11.833V7.638c0-.932.487-1.797 1.285-2.28l3.333-2.02a2.667 2.667 0 0 1 2.764 0l3.334 2.02A2.667 2.667 0 0 1 14 7.638v4.195a2.667 2.667 0 0 1-2.667 2.667H6Zm0 0v-2.667a2 2 0 1 1 4 0V14.5H6Z" stroke="#0C6350" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const calendarIcon =
		//prettier-ignore
		<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M10 2.667V1.334v1.333Zm0 0V4 2.667Zm0 0H7h3Zm-8 4v6C2 13.403 2.597 14 3.333 14h9.334c.736 0 1.333-.597 1.333-1.333v-6H2Z" stroke="#0C6350" strokeLinecap="round" strokeLinejoin="round" /> <path d="M2 6.667V4c0-.737.597-1.333 1.333-1.333h1.334M4.667 1.333V4M14 6.667V4c0-.737-.597-1.333-1.333-1.333h-.334" stroke="#4D4D4D" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const plusIcon =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M12 12v6m-6-6h6-6Zm12 0h-6 6Zm-6 0V6v6Z" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const doubleArrow =
		//prettier-ignore
		<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M10.333 6.833 8 4.5 5.667 6.833M10.333 9.833 8 12.167 5.667 9.833" stroke="#0C6350" strokeLinecap="round" strokeLinejoin="round" /> </svg>;

	const leftArrow =
		//prettier-ignore
		<svg style={{transform: 'rotate(180deg)'}} width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="m6 4 4 4-4 4" stroke="#4D4D4D" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const rightArrow =
		//prettier-ignore
		<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="m6 4 4 4-4 4" stroke="#4D4D4D" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	useEffect(() => {
		getNotices();
	}, []);
	// filter notices by query / time / building
	useEffect(() => {
		// filter by query / building
		setResults(
			(results = notices.map((notice) => {
				// if (filteredBuildings.includes(notice.recipients[0])) {
				if (!notice) return;
				let recipients = notice.recipients.map((recipient) => {
					return tenants.find((e) => e.userID === recipient);
				});
				let names = recipients
					.map((recipient) => recipient.firstName + " " + recipient.lastName)
					.join("");
				let mails = recipients.map((recipient) => recipient.email).join("");
				let buildings = recipients.map((recipient) => recipient.buildingName);
				let noticeBuildingIncluded = buildings
					.map((building) => {
						if (!filteredBuildings.includes(building) || building === "")
							return false;
						return true;
					})
					.includes(true)
					? true
					: false;
				if (!noticeBuildingIncluded) return;
				if (query) {
					if (
						names.toLowerCase().includes(query.toLowerCase()) ||
						mails.toLowerCase().includes(query.toLowerCase()) ||
						notice.subject.toLowerCase().includes(query.toLowerCase())
					) {
						return notice;
					}
					return;
				}
				return notice;
			})).sort((a, b) => b.timestamp.seconds - a.timestamp.seconds)
		);
		if (nameSortOrder !== "") nameSort();
		if (dateSortOrder !== "") dateSort();
		if (buildingSortOrder !== "") buildingSort();
		// filter by time
		let currentDate = (Date.now() / 1000).toFixed(0);
		if (dateFilterOption === "all time") return;
		if (!results) return;
		setResults(
			(results = results.map((notice) => {
				if (!notice) return;
				if (dateFilterOption === "all time") return notice;
				if (dateFilterOption === "past 24 hours") {
					if (currentDate - notice.timestamp.seconds < 60 * 60 * 24)
						return notice;
				}
				if (dateFilterOption === "past week") {
					if (currentDate - notice.timestamp.seconds < 60 * 60 * 24 * 7)
						return notice;
				}
				if (dateFilterOption === "past month") {
					if (currentDate - notice.timestamp.seconds < 60 * 60 * 24 * 30)
						return notice;
				}
				if (dateFilterOption === "") {
					if (
						dateFrom <= notice.timestamp.seconds &&
						notice.timestamp.seconds <= dateTo
					)
						return notice;
				}
			}))
		);
	}, [
		dateFilterOption,
		dateFrom,
		dateTo,
		notices,
		query,
		buildingsCheckedList,
		filteredBuildings,
		nameSortOrder,
		dateSortOrder,
		buildingSortOrder,
	]);
	// Set the check list for the building dropdown whenever theres a change in buildings
	useEffect(() => {
		setBuildingsCheckedList(
			(buildingsCheckedList = buildings.map(() => {
				return true;
			}))
		);
	}, [buildings]);
	// When the dropdown is toggled, set the list again
	useEffect(() => {
		setBuildingsCheckedList((buildingsCheckedList = [...buildingsCheckedList]));
	}, [toggleBuildingDropdown]);
	// Create list of filtered buildings, only notices that came from the buildings in this list will be displayed
	useEffect(() => {
		setFilteredBuildings(
			(filteredBuildings = buildings
				.map((building, index) => {
					if (buildingsCheckedList[index] === true)
						return building.buildingName;
				})
				.filter((item) => item != undefined))
		);
	}, [buildingsCheckedList]);
	//reset from and to inputs in the time filter dropdown
	useEffect(() => {
		if (dateFilterOption === "") return;
		setDateFrom((dateFrom = 0));
		setDateTo((dateTo = (Date.now() / 1000).toFixed(0)));
		dateFromRef.current.value = ``;
		dateToRef.current.value = `${new Date().toLocaleDateString("en-ca")}`;
	}, [dateFilterOption]);
	return (
		<div className="notice-screen">
			<div className="searchBar">
				<h2>Notices</h2>
				<div className="search">
					{query ? (
						<span
							onClick={() => {
								searchInputRef.current.value = "";
								setQuery();
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
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
				</div>
				<div style={{ textDecoration: "none" }}>
					<button
						className="main approve-new"
						onClick={() => {
							setToggleSendNoticeWindow(true);
						}}>
						<span style={{ height: "1.5rem" }}>{plusIcon}</span>
						New notice
					</button>
				</div>
			</div>
			<div className="notice-page-container">
				<div className="options-bar">
					<div className="tenant-actions">
						<div
							style={{
								border: toggleDateFilter
									? "2.4px solid #C9EADA"
									: "2.4px solid transparent",
							}}
							className="newsfeed-page-filter"
							onClick={() => {
								setToggleDateFilter(!toggleDateFilter);
							}}>
							<span>{calendarIcon}</span>
							<p>
								{dateFilterOption === ""
									? "Specific dates"
									: dateFilterOption.charAt(0).toUpperCase() +
									  dateFilterOption.slice(1)}
							</p>
							<span className="double-arrow">{doubleArrow}</span>
						</div>
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
								{filteredBuildings.length === 0
									? "All buildings"
									: filteredBuildings.length === buildings.length
									? "All buildings"
									: "Selected buildings"}
							</p>
							<span className="double-arrow" style={{ height: "1rem" }}>
								{doubleArrow}
							</span>
						</div>
					</div>
					<div className=""></div>
				</div>
				<div className="notices-list">
					{/* HEADER */}
					<div className="notice-list-item list-header">
						<div
							className="notice-name-col"
							onClick={() => {
								nameSortOrder === "down" || nameSortOrder === ""
									? setNameSortOrder((nameSortOrder = "up"))
									: setNameSortOrder((nameSortOrder = "down"));
							}}>
							<p>Recipient Name</p>
							{/* prettier-ignore */}
							<span>
								{
									nameSortOrder === "down" || nameSortOrder === ""? 
									// high -> low icon
									<>
									<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M9.334 6.667h-8M6.667 9.333H1.334M4 12H1.333M12 4H1.334M12.666 13.333l-2-2m2-4.666v6.666-6.666Zm0 6.666 2-2-2 2Z" stroke="#828282" strokeLinecap="round" strokeLinejoin="round" /> </svg>{" "}
									</>
									// low -> high icon
									: 
									<>
									<svg style={{transform: 'rotate(180deg)'}} width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M9.334 6.667h-8M6.667 9.333H1.334M4 12H1.333M12 4H1.334M12.666 13.333l-2-2m2-4.666v6.666-6.666Zm0 6.666 2-2-2 2Z" stroke="#828282" strokeLinecap="round" strokeLinejoin="round" /> </svg>
									</>
								}
							</span>
						</div>
						<div className="notice-email-col">
							<p>Email address</p>
						</div>
						<div
							className="notice-building-col"
							onClick={() => {
								buildingSortOrder === "down"
									? setBuildingSortOrder((buildingSortOrder = "up"))
									: setBuildingSortOrder((buildingSortOrder = "down"));
							}}>
							<p>Building</p>
							{/* prettier-ignore */}
							<span>
								{
									buildingSortOrder === 'down' ? 
									// high -> low icon
									<>
									<svg style={{transform: 'rotate(180deg)'}} width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M9.334 6.667h-8M6.667 9.333H1.334M4 12H1.333M12 4H1.334M12.666 13.333l-2-2m2-4.666v6.666-6.666Zm0 6.666 2-2-2 2Z" stroke="#828282" strokeLinecap="round" strokeLinejoin="round" /> </svg>
									</>	
									: 
									// low -> high icon
									<>
									<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M9.334 6.667h-8M6.667 9.333H1.334M4 12H1.333M12 4H1.334M12.666 13.333l-2-2m2-4.666v6.666-6.666Zm0 6.666 2-2-2 2Z" stroke="#828282" strokeLinecap="round" strokeLinejoin="round" /> </svg>{" "}
									</>
								}
							</span>
						</div>
						<div className="notice-subject-col">
							<p>Subject</p>
						</div>
						<div
							className="notice-date-col"
							onClick={() => {
								dateSortOrder === "down" || dateSortOrder === ""
									? setDateSortOrder((dateSortOrder = "up"))
									: setDateSortOrder((dateSortOrder = "down"));
							}}>
							<p>Date sent</p>
							{/* prettier-ignore */}
							<span>
								{
									dateSortOrder === "down" || dateSortOrder === ''? 
									// high -> low icon
									<>
									<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M9.334 6.667h-8M6.667 9.333H1.334M4 12H1.333M12 4H1.334M12.666 13.333l-2-2m2-4.666v6.666-6.666Zm0 6.666 2-2-2 2Z" stroke="#828282" strokeLinecap="round" strokeLinejoin="round" /> </svg>{" "}
									</>
									:
									// low -> high icon
									<>
									<svg style={{transform: 'rotate(180deg)'}} width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M9.334 6.667h-8M6.667 9.333H1.334M4 12H1.333M12 4H1.334M12.666 13.333l-2-2m2-4.666v6.666-6.666Zm0 6.666 2-2-2 2Z" stroke="#828282" strokeLinecap="round" strokeLinejoin="round" /> </svg>
									</>
								}
							</span>
						</div>
						<div className="notice-status-col">
							<p>Status</p>
						</div>
					</div>
					{/* BODY */}
					{displayNotices()}
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
							aria-label={`Showing ${pageNumberFrom}-${pageNumberTo} of ${noticesAmount} items`}>
							Showing {pageNumberFrom}-{pageNumberTo} of {noticesAmount} items
						</p>
					</div>
					<ReactPaginate
						className={noticesAmount === 0 ? "pagination hidden" : "pagination"}
						pageCount={Math.ceil(noticesAmount / itemsNumber)}
						previousLabel={leftArrow}
						nextLabel={rightArrow}
						pageClassName={"pagination-numbers"}
						previousClassName={"pagination-prev-arrow"}
						nextClassName={"pagination-next-arrow"}
						disabledClassName={"pagination-disabled"}
						activeClassName={"pagination-active-link"}
						forcePage={currentPageNumber - 1}
						onPageChange={(page) => {
							setCurrentPageNumber(page.selected + 1);
						}}
					/>
				</div>
				<div
					className="date-filter-dropdown"
					style={{ display: toggleDateFilter ? "" : "none" }}>
					<ul>
						<li className={dateFilterOption === "all time" ? "active" : ""}>
							<div>
								<input
									onClick={() => {
										setDateFilterOption((dateFilterOption = "all time"));
									}}
									type="radio"
									id="all-time"
									name="time-picker"
									defaultChecked
								/>
								<label
									onClick={() => {
										setDateFilterOption((dateFilterOption = "all time"));
									}}
									htmlFor="all-time">
									All time
								</label>
							</div>
						</li>
						<li
							className={dateFilterOption === "past 24 hours" ? "active" : ""}>
							<div>
								<input
									onClick={() => {
										setDateFilterOption((dateFilterOption = "past 24 hours"));
									}}
									type="radio"
									id="past-24-hours"
									name="time-picker"
								/>
								<label
									onClick={() => {
										setDateFilterOption((dateFilterOption = "past 24 hours"));
									}}
									htmlFor="past-24-hours">
									Past 24 hours
								</label>
							</div>
						</li>
						<li className={dateFilterOption === "past week" ? "active" : ""}>
							<div>
								<input
									onClick={() => {
										setDateFilterOption((dateFilterOption = "past week"));
									}}
									type="radio"
									id="past-week"
									name="time-picker"
									value="past-week"
								/>
								<label
									onClick={() => {
										setDateFilterOption((dateFilterOption = "past week"));
									}}
									for="past-week">
									Past week
								</label>
							</div>
						</li>
						<li className={dateFilterOption === "past month" ? "active" : ""}>
							<div>
								<input
									onClick={() => {
										setDateFilterOption((dateFilterOption = "past month"));
									}}
									type="radio"
									id="past-month"
									name="time-picker"
									value="past-month"
								/>
								<label
									onClick={() => {
										setDateFilterOption((dateFilterOption = "past month"));
									}}
									for="past-month">
									Past month
								</label>
							</div>
						</li>
						<li>
							<div>
								<input
									onClick={() => {
										setDateFilterOption((dateFilterOption = ""));
									}}
									type="radio"
									id="specific-dates"
									name="time-picker"
									value="specific-dates"
								/>
								<label
									onClick={() => {
										setDateFilterOption((dateFilterOption = ""));
									}}
									for="specific-dates">
									Specific dates
								</label>
							</div>
							<div
								className="date-picker-fields"
								style={{ display: dateFilterOption === "" ? "" : "none" }}>
								<div className="from">
									<label htmlFor="from">From</label>
									<input
										type="date"
										ref={dateFromRef}
										id="from"
										name="from"
										onChange={(e) => {
											setDateFrom(
												(dateFrom = Date.parse(e.target.value) / 1000)
											);
										}}
										min="2000-01-01"
										max={dateToRef.current ? dateToRef.current.value : ""}
									/>
								</div>
								<div className="to">
									<label htmlFor="to">To</label>
									<input
										type="date"
										ref={dateToRef}
										id="to"
										name="to"
										onChange={(e) => {
											// add 23:59 hours because the value from the input is 12:00 AM
											setDateTo(
												(dateTo =
													(Date.parse(e.target.value) +
														(1000 * 60 * 60 * 23 + 1000 * 59)) /
													1000)
											);
										}}
										min="1980-01-01"
										max={new Date().toLocaleDateString("en-ca")}
									/>
								</div>
							</div>
						</li>
					</ul>
				</div>
				<div
					className="invisible-bg"
					style={{
						display:
							toggleBuildingDropdown ||
							toggleDateFilter ||
							toggleItemsNumderDropdown
								? ""
								: "none",
					}}
					onClick={() => {
						setToggleItemsNumderDropdown(false);
						setToggleDateFilter(false);
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
			</div>
			{toggleSendNoticeWindow ? (
				<div>
					<div className="dimmed-bg"></div>
					<SendNoticeWindow
						setToggleSendNoticeWindow={setToggleSendNoticeWindow}
						setPopup={setPopup}
						setTogglePopup={setTogglePopup}
						tenants={tenants}
						getNotices={getNotices}
						buildings={buildings}
					/>
				</div>
			) : (
				""
			)}
			{togglePopup ? popup : ""}
			{toggleViewNoticeWindow ? viewNoticeWindow : ""}
		</div>
	);
};

export default NoticesScreen;
