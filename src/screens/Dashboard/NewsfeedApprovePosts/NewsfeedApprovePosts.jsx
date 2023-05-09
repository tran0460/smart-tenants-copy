import { useState, useEffect, useRef } from "react";
import UnapprovedNewsfeedPost from "../../../components/UnapprovedNewsfeedPost/UnapprovedNewsfeedPost";
import Masonry from "react-masonry-css";
import { updateDoc, doc } from "firebase/firestore";
import { get, child, ref } from "firebase/database";
import { database } from "../../../firebase/firebase-config";
import { db } from "../../../firebase/firebase-config";
import { Link, useOutletContext, useNavigate } from "react-router-dom";
import "./NewsfeedApprovePosts.css";

const NewsfeedApprovePosts = () => {
	let [popup, setPopup] = useState();
	let [togglePopup, setTogglePopup] = useState(false);
	let [newsfeedPosts, unapprovedNewsfeedPosts, buildings] = useOutletContext();
	let [toggleDateFilter, setToggleDateFilter] = useState(false);
	let [results, setResults] = useState([]);
	let [posts, setPosts] = useState(unapprovedNewsfeedPosts);
	let [query, setQuery] = useState("");
	let [buildingsCheckedList, setBuildingsCheckedList] = useState([]);
	let [toggleBuildingDropdown, setToggleBuildingDropdown] = useState(false);
	let [buildingsSearchQuery, setBuildingsSearchQuery] = useState();
	let [filteredBuildings, setFilteredBuildings] = useState([]);
	let [timeout, setTimeout] = useState();
	let [dateFilterOption, setDateFilterOption] = useState("all time");
	let buildingsCheckAllRef = useRef(null);
	let [dateFrom, setDateFrom] = useState(0);
	let [keywords, setKeywords] = useState([]);
	let [dateTo, setDateTo] = useState(0);
	let dateFromRef = useRef(null);
	let dateToRef = useRef(null);
	let searchInputRef = useRef(null);
	let [showFlagged, setShowFlagged] = useState(false);
	let [flaggedPosts, setFlaggedPosts] = useState([]);
	let navigate = useNavigate();
	const magnifyingGlass =
		//prettier-ignore
		<svg className="search-icon" width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m16 16 3.5 3.5M5 11a6 6 0 1 0 12 0 6 6 0 0 0-12 0Z" stroke="#9D9D9D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const leftArrow =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m15 6-6 6 6 6" stroke="#4E4D4D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
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

	let displayPosts = () => {
		return results.map((post, index) => {
			if (post === undefined) return;
			if (showFlagged === true && flaggedPosts.includes(post.id))
				return (
					<UnapprovedNewsfeedPost
						key={index}
						id={index}
						popup={popup}
						setPopup={setPopup}
						togglePopup={togglePopup}
						setTogglePopup={setTogglePopup}
						posts={posts}
						setPosts={setPosts}
						data={post}
						approvePostById={approvePostById}
						keywords={keywords}
					/>
				);
			if (showFlagged === false)
				return (
					<UnapprovedNewsfeedPost
						key={index}
						id={index}
						popup={popup}
						setPopup={setPopup}
						togglePopup={togglePopup}
						setTogglePopup={setTogglePopup}
						posts={posts}
						setPosts={setPosts}
						data={post}
						approvePostById={approvePostById}
						keywords={keywords}
					/>
				);
		});
	};
	let approvePostById = (id) => {
		let docRef = doc(db, "Newsfeed", `${id}`);
		return updateDoc(docRef, { isNSFW: false });
	};
	const breakpoints = {
		default: 3,
		1728: 2,
	};
	const clearSearch =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" fill="#D2D2D2" /> <path d="m12 12 2.829 2.829m-5.657 0L12.001 12 9.171 14.83Zm5.657-5.657L12 12l2.829-2.828ZM12 12 9.173 9.172 12.001 12Z" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const plusIcon =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M12 12v6m-6-6h6-6Zm12 0h-6 6Zm-6 0V6v6Z" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const buildingIcon =
		//prettier-ignore
		<svg width={16} height={17} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M6 14.5h4m-4 0H4.667A2.667 2.667 0 0 1 2 11.833V7.638c0-.932.487-1.797 1.285-2.28l3.333-2.02a2.667 2.667 0 0 1 2.764 0l3.334 2.02A2.667 2.667 0 0 1 14 7.638v4.195a2.667 2.667 0 0 1-2.667 2.667H6Zm0 0v-2.667a2 2 0 1 1 4 0V14.5H6Z" stroke="#0C6350" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const doubleArrow =
		//prettier-ignore
		<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M10.333 6.833 8 4.5 5.667 6.833M10.333 9.833 8 12.167 5.667 9.833" stroke="#0C6350" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const calendarIcon =
		//prettier-ignore
		<svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M10 2.667V1.334v1.333Zm0 0V4 2.667Zm0 0H7h3Zm-8 4v6C2 13.403 2.597 14 3.333 14h9.334c.736 0 1.333-.597 1.333-1.333v-6H2Z" stroke="#0C6350" strokeLinecap="round" strokeLinejoin="round" /> <path d="M2 6.667V4c0-.737.597-1.333 1.333-1.333h1.334M4.667 1.333V4M14 6.667V4c0-.737-.597-1.333-1.333-1.333h-.334" stroke="#4D4D4D" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	useEffect(() => {
		if (unapprovedNewsfeedPosts.length === 0)
			return navigate("/dashboard/newsfeed");
		setPosts((posts = unapprovedNewsfeedPosts));
		// Filter by query
		setResults(
			(results = posts
				.map((post) => {
					if (filteredBuildings.includes(post.userBuildingName)) {
						if (!post) return;
						if (query) {
							if (
								post.postContent.toLowerCase().includes(query.toLowerCase()) ||
								post.userFirstName
									.toLowerCase()
									.includes(query.toLowerCase()) ||
								post.userLastName.toLowerCase().includes(query.toLowerCase())
							) {
								return post;
							}
							return;
						}
						return post;
					}
				})
				.sort((a, b) => b.timestamp - a.timestamp))
		);
	}, [
		newsfeedPosts,
		unapprovedNewsfeedPosts,
		query,
		filteredBuildings,
		dateFilterOption,
		dateFrom,
		dateTo,
	]);
	//Filter by date
	useEffect(() => {
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
	}, [dateFilterOption, dateFrom, dateTo, posts, query]);
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
						return building.buildingName;
				})
				.filter((item) => item != undefined))
		);
	}, [buildingsCheckedList]);
	useEffect(() => {
		//get keywords
		const dbRef = ref(database);
		get(child(dbRef, `/192gNa03sJSS0yFr8wEDj1pvRA-zTuLZ0OY9-gXyo1xQ/`))
			.then((snapshot) => {
				if (snapshot.exists()) {
					setKeywords((keywords = []));
					let obj = snapshot.val()["SLP keywords"];
					for (let key in obj) {
						keywords.push(obj[key].Keyword);
					}
				}
			})
			.catch((error) => {
				console.error(error);
			});
	}, [unapprovedNewsfeedPosts]);
	//Tag flagged posts
	useEffect(() => {
		if (!keywords) return;
		let IDs = [];
		keywords.map((keyword, index) => {
			let id;
			let list = results.map((post) => {
				if (post === undefined) return;
				if (
					post.postContent.includes(keyword.toLowerCase()) ||
					post.postContent.includes(keyword)
				) {
					return post.id;
				}
			});
			IDs = IDs.concat(list).filter((item) => item != undefined);
			return id;
		});
		IDs = IDs.filter((e) => e != undefined);
		setFlaggedPosts((flaggedPosts = [...IDs]));
	}, [keywords, posts, results]);
	return (
		<div className="newsfeed-page">
			<div className="searchBar">
				<Link className="back-to-newsfeed-button" to="/dashboard/newsfeed">
					<span>{leftArrow}</span>
					<h2>Approve new posts</h2>
				</Link>
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
			</div>
			<div className="newsfeed-page-container">
				<div className="newsfeed-page-filters">
					<button
						className={
							showFlagged ? "danger show-flagged active" : "danger show-flagged"
						}
						style={{
							display: flaggedPosts.length === 0 ? "none" : "",
						}}
						onClick={() => setShowFlagged(!showFlagged)}>
						{showFlagged ? "Showing flagged" : "Show flagged"}
						<span className="notification-number">
							{flaggedPosts ? flaggedPosts.length : 0}
						</span>
					</button>
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
					className="newsfeed-posts-container"
					columnClassName="newsfeed-posts-container-column">
					{displayPosts()}
				</Masonry>
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
											setDateTo((dateTo = Date.parse(e.target.value) / 1000));
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
						<ul
							onWheel={(e) => {
								e.currentTarget.className = "scroll-visible";
							}}
							onScroll={(e) => {
								window.clearTimeout(timeout);
								setTimeout(
									window.setTimeout(() => {
										e.target.className = "";
									}, 1000)
								);
							}}>
							<li>
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
							</li>
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
			</div>
			{togglePopup ? popup : ""}
		</div>
	);
};

export default NewsfeedApprovePosts;
