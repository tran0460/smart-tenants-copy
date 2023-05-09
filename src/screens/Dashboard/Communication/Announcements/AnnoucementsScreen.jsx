import { useState, useEffect, useRef } from "react";
import { db } from "../../../../firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { Link, useOutletContext } from "react-router-dom";
import "./AnnouncementsScreen.css";
import AnnouncementPost from "../../../../components/AnnouncementPostComponent/AnnouncementPost";
import AnnouncementWindow from "../../../../components/AnnouncementWindow/AnnouncementWindow";
import Masonry from "react-masonry-css";
import BuildingFilterDropdown from "../../../../components/BuildingFilterDropdown/BuildingFilterDropdown";

const AnnoucementsScreen = () => {
	let [buildings] = useOutletContext();
	let [announcementWindow, setAnnouncementWindow] = useState();
	let [toggleAnnouncementWindow, setToggleAnnouncementWindow] = useState(false);
	let [popup, setPopup] = useState();
	let [togglePopup, setTogglePopup] = useState(false);
	let [posts, setPosts] = useState([]);
	let [results, setResults] = useState([]);
	let [toggleDateFilter, setToggleDateFilter] = useState(false);
	let [dateFilterOption, setDateFilterOption] = useState("all time");
	let [filteredBuildings, setFilteredBuildings] = useState([]);
	let [toggleBuildingDropdown, setToggleBuildingDropdown] = useState(false);
	let [buildingsCheckedList, setBuildingsCheckedList] = useState([]);
	let [buildingsSearchQuery, setBuildingsSearchQuery] = useState();
	let [actionStatusBox, setActionStatusBox] = useState(false);
	let [toggleActionStatusBox, setToggleActionStatusBox] = useState();
	let [query, setQuery] = useState("");
	let [timeout, setTimeout] = useState();
	let [dateFrom, setDateFrom] = useState(0);
	let [dateTo, setDateTo] = useState(0);
	let dateFromRef = useRef(null);
	let dateToRef = useRef(null);
	let buildingsCheckAllRef = useRef(null);
	let searchInputRef = useRef(null);
	const breakpoints = {
		default: 3,
		1728: 2,
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
	// Fetch announcements
	const getAnnouncements = async () => {
		setPosts((posts = []));
		const announcementsRef = collection(db, "Announcements");
		await getDocs(announcementsRef).then((snapshot) => {
			snapshot.forEach((announcement) => {
				posts.push(announcement.data());
			});
		});
		setPosts((posts = [...posts]));
	};
	// Display posts on the screen
	const displayPosts = () => {
		return results.map((post, index) => {
			if (post === undefined) return;
			return (
				<AnnouncementPost
					key={index}
					id={index}
					buildings={buildings}
					announcementWindow={announcementWindow}
					setAnnouncementWindow={setAnnouncementWindow}
					toggleSendNoticeWindow={toggleAnnouncementWindow}
					setToggleAnnouncementWindow={setToggleAnnouncementWindow}
					getAnnouncements={getAnnouncements}
					popup={popup}
					setPopup={setPopup}
					togglePopup={togglePopup}
					setTogglePopup={setTogglePopup}
					posts={posts}
					setPosts={setPosts}
					data={post}
					setActionStatusBox={setActionStatusBox}
					setToggleActionStatusBox={setToggleActionStatusBox}
				/>
			);
		});
	};
	const magnifyingGlass =
		//prettier-ignore
		<svg className="search-icon" width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m16 16 3.5 3.5M5 11a6 6 0 1 0 12 0 6 6 0 0 0-12 0Z" stroke="#9D9D9D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const clearSearch =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" fill="#D2D2D2" /> <path d="m12 12 2.829 2.829m-5.657 0L12.001 12 9.171 14.83Zm5.657-5.657L12 12l2.829-2.828ZM12 12 9.173 9.172 12.001 12Z" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const plusIcon =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M12 12v6m-6-6h6-6Zm12 0h-6 6Zm-6 0V6v6Z" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const doubleArrow =
		//prettier-ignore
		<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M10.333 6.833 8 4.5 5.667 6.833M10.333 9.833 8 12.167 5.667 9.833" stroke="#0C6350" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const buildingIcon =
		//prettier-ignore
		<svg width={16} height={17} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M6 14.5h4m-4 0H4.667A2.667 2.667 0 0 1 2 11.833V7.638c0-.932.487-1.797 1.285-2.28l3.333-2.02a2.667 2.667 0 0 1 2.764 0l3.334 2.02A2.667 2.667 0 0 1 14 7.638v4.195a2.667 2.667 0 0 1-2.667 2.667H6Zm0 0v-2.667a2 2 0 1 1 4 0V14.5H6Z" stroke="#0C6350" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const calendarIcon =
		//prettier-ignore
		<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M10 2.667V1.334v1.333Zm0 0V4 2.667Zm0 0H7h3Zm-8 4v6C2 13.403 2.597 14 3.333 14h9.334c.736 0 1.333-.597 1.333-1.333v-6H2Z" stroke="#0C6350" strokeLinecap="round" strokeLinejoin="round" /> <path d="M2 6.667V4c0-.737.597-1.333 1.333-1.333h1.334M4.667 1.333V4M14 6.667V4c0-.737-.597-1.333-1.333-1.333h-.334" stroke="#4D4D4D" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	// Get announcement when the tab is selected
	useEffect(() => {
		getAnnouncements();
	}, []);
	// filter posts by query / time / building
	useEffect(() => {
		// filter by query / building
		setResults(
			(results = posts
				.map((post) => {
					if (filteredBuildings.includes(post.recipients[0])) {
						if (!post) return;
						if (query) {
							if (
								post.content.toLowerCase().includes(query.toLowerCase()) ||
								post.subject.toLowerCase().includes(query.toLowerCase())
							) {
								return post;
							}
							return;
						}
						return post;
					}
				})
				.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds))
		);
		// filter by time
		let currentDate = (Date.now() / 1000).toFixed(0);
		if (dateFilterOption === "all time") return;
		if (!results) return;
		setResults(
			(results = results.map((post) => {
				if (!post) return;
				if (dateFilterOption === "all time") return post;
				if (dateFilterOption === "past 24 hours") {
					if (currentDate - post.timestamp.seconds < 60 * 60 * 24) return post;
				}
				if (dateFilterOption === "past week") {
					if (currentDate - post.timestamp.seconds < 60 * 60 * 24 * 7)
						return post;
				}
				if (dateFilterOption === "past month") {
					if (currentDate - post.timestamp.seconds < 60 * 60 * 24 * 30)
						return post;
				}
				if (dateFilterOption === "") {
					if (
						dateFrom <= post.timestamp.seconds &&
						post.timestamp.seconds <= dateTo
					)
						return post;
				}
			}))
		);
	}, [
		dateFilterOption,
		dateFrom,
		dateTo,
		posts,
		query,
		buildingsCheckedList,
		filteredBuildings,
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
	// Create list of filtered buildings, only posts that came from the buildings in this list will be displayed
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
		<div className="announcements-page">
			<div className="searchBar">
				<h2>Announcements</h2>
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
				<button
					className="main approve-new"
					onClick={() => {
						setAnnouncementWindow(
							<AnnouncementWindow
								windowType="new"
								buildings={buildings}
								popup={popup}
								setPopup={setPopup}
								togglePopup={togglePopup}
								setTogglePopup={setTogglePopup}
								posts={posts}
								setPosts={setPosts}
								setToggleAnnouncementWindow={setToggleAnnouncementWindow}
								getAnnouncements={getAnnouncements}
								setActionStatusBox={setActionStatusBox}
								setToggleActionStatusBox={setToggleActionStatusBox}
							/>
						);
						setToggleAnnouncementWindow(true);
					}}>
					<span style={{ height: "1.5rem" }}>{plusIcon}</span>
					New announcement
				</button>
			</div>
			<div className="announcements-page-container">
				<div className="announcements-page-filters">
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
				<Masonry
					breakpointCols={breakpoints}
					className="announcement-posts-container"
					columnClassName="announcement-posts-container-column">
					{displayPosts()}
				</Masonry>
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
					<li className={dateFilterOption === "past 24 hours" ? "active" : ""}>
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
										setDateFrom((dateFrom = Date.parse(e.target.value) / 1000));
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
					display: toggleBuildingDropdown || toggleDateFilter ? "" : "none",
				}}
				onClick={() => {
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
			{toggleActionStatusBox ? actionStatusBox : null}
			{toggleAnnouncementWindow ? announcementWindow : ""}
			{togglePopup ? popup : ""}
		</div>
	);
};

export default AnnoucementsScreen;