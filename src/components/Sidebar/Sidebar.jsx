import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = (props) => {
	// The sidebar component location on the left side of the screen
	let [dropdownVisible, setDropdownVisible] = useState(false);
	let navigate = useNavigate();
	const smartLivingLogo = require("../../assets/smart-living-logo.png");
	let pathname = useLocation().pathname;
	return (
		<div>
			<div className="sidebar" tabIndex={0} aria-label="sidebar">
				<div
					className="logo-container"
					tabIndex={0}
					aria-label="smart living logo">
					<img
						src={smartLivingLogo}
						alt="smart living logo"
						onClick={() => navigate("/dashboard/tenants")}
					/>
				</div>
				<div className="nav-list">
					<ul>
						<li>
							<Link
								aria-label="tenants"
								className={
									pathname.includes("tenants") || pathname === "/dashboard"
										? "link active"
										: "link"
								}
								to="tenants">
								{pathname.includes("tenants") || pathname === "/dashboard" ? (
									//prettier-ignore
									<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M1 20v-1a7 7 0 1 1 14 0v1" stroke="#0C6350" strokeWidth={1.5} strokeLinecap="round" /> <path d="M13 14a5 5 0 0 1 10 0v.5" stroke="#0C6350" strokeWidth={1.5} strokeLinecap="round" /> <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="#0C6350" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>
								) : (
									//prettier-ignore
									<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M1 20v-1a7 7 0 1 1 14 0v1" stroke="#393939" strokeWidth={1.5} strokeLinecap="round" /> <path d="M13 14a5 5 0 0 1 10 0v.5" stroke="#393939" strokeWidth={1.5} strokeLinecap="round" /> <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="#393939" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>
								)}
								<span>Tenants</span>
								<span
									className="notification-number"
									style={{
										display: props.tenantNotificationCount === 0 ? "none" : "",
									}}>
									<p>{props.tenantNotificationCount}</p>
								</span>
							</Link>
						</li>
						<li>
							{/* using p tag because a tags cannot be used without href */}
							<div
								tabIndex={0}
								onKeyDown={(e) => {
									if (e.key === "Enter") setDropdownVisible(!dropdownVisible);
								}}
								aria-label="communication"
								onClick={() => setDropdownVisible(!dropdownVisible)}
								style={{ cursor: "pointer" }}
								className={
									pathname.includes("notices") ||
									pathname.includes("announcements")
										? "link active"
										: "link"
								}>
								{/* prettier-ignore */}
								{pathname.includes("notices") ||
								pathname.includes("announcements") ? (
									//prettier-ignore
									<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M14 14H7a4 4 0 0 1 0-8h7m0 8V6v8Zm0 0 6.102 3.487a.6.6 0 0 0 .898-.52V3.033a.6.6 0 0 0-.898-.521L14 6v8ZM7.757 19.3 7 14h4l.677 4.74a1.98 1.98 0 0 1-3.92.56Z" stroke="#0c6350" strokeWidth={1.5} /> </svg>
								) : (
									//prettier-ignore
									<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M14 14H7a4 4 0 0 1 0-8h7m0 8V6v8Zm0 0 6.102 3.487a.6.6 0 0 0 .898-.52V3.033a.6.6 0 0 0-.898-.521L14 6v8ZM7.757 19.3 7 14h4l.677 4.74a1.98 1.98 0 0 1-3.92.56Z" stroke="#393939" strokeWidth={1.5} /> </svg>
								)}
								<span>Communication</span>
								{
									/* prettier-ignore */
									dropdownVisible 
                                    //up arrow
                                    ? <svg className="arrow" width={10} height={6} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M9 5 5 1 1 5" stroke="#4d4d4d" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>
                                    //down arrow
                                    : <svg className="arrow" width={10} height={6} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m1 1 4 4 4-4" stroke="#4d4d4d" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>
								}
							</div>
							<div
								className={"dropdown"}
								style={{ display: dropdownVisible ? "" : "none" }}>
								<ul>
									<li>
										<Link
											aria-label="notices"
											className="link"
											to="notices"
											onClick={() => setDropdownVisible(false)}>
											Notices
										</Link>
									</li>
									<li>
										<Link
											aria-label="announcements"
											className="link"
											to="announcements"
											onClick={() => setDropdownVisible(false)}>
											Announcements
										</Link>
									</li>
								</ul>
							</div>
						</li>
						<li>
							<Link
								aria-label="newsfeed"
								className={
									pathname.includes("newsfeed") ? "link active" : "link"
								}
								to="newsfeed">
								{/* prettier-ignore */}
								{pathname.includes("newsfeed") ? (
									//prettier-ignore
									<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M16.472 20H4.1a.6.6 0 0 1-.6-.6V9.6a.6.6 0 0 1 .6-.6h2.768a2 2 0 0 0 1.715-.971l2.71-4.517a1.631 1.631 0 0 1 2.961 1.308l-1.022 3.408a.6.6 0 0 0 .574.772h4.575a2 2 0 0 1 1.93 2.526l-1.91 7A2 2 0 0 1 16.473 20Z" stroke="#0c6350" strokeWidth={1.5} strokeLinecap="round" /> <path d="M7 20V9" stroke="#0c6350" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>
								) : (
									//prettier-ignore
									<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M16.472 20H4.1a.6.6 0 0 1-.6-.6V9.6a.6.6 0 0 1 .6-.6h2.768a2 2 0 0 0 1.715-.971l2.71-4.517a1.631 1.631 0 0 1 2.961 1.308l-1.022 3.408a.6.6 0 0 0 .574.772h4.575a2 2 0 0 1 1.93 2.526l-1.91 7A2 2 0 0 1 16.473 20Z" stroke="#393939" strokeWidth={1.5} strokeLinecap="round" /> <path d="M7 20V9" stroke="#393939" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>
								)}
								<span>Newsfeed</span>
								<span
									className="notification-number"
									style={{
										display: props.newsfeedNotificationCount ? "" : "none",
									}}>
									<p>{props.newsfeedNotificationCount}</p>
								</span>
							</Link>
						</li>
						<li>
							<Link
								aria-label="marketplace"
								className={
									pathname.includes("marketplace") ? "link active" : "link"
								}
								to="marketplace">
								{pathname.includes("marketplace") ? (
									//prettier-ignore
									<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="m21.818 9.364-1.694-5.929A.6.6 0 0 0 19.547 3H15.5l.475 5.704a.578.578 0 0 0 .278.45c.39.233 1.152.663 1.747.846 1.016.313 2.5.2 3.346.096a.57.57 0 0 0 .472-.732Z" stroke="#0c6350" strokeWidth={1.5} /> <path d="M14 10c.568-.175 1.288-.574 1.69-.812a.578.578 0 0 0 .28-.549L15.5 3h-7l-.47 5.639a.578.578 0 0 0 .28.55c.402.237 1.122.636 1.69.811 1.493.46 2.507.46 4 0Z" stroke="#0c6350" strokeWidth={1.5} /> <path d="m3.876 3.435-1.694 5.93a.57.57 0 0 0 .472.73c.845.105 2.33.217 3.346-.095.595-.183 1.358-.613 1.747-.845a.578.578 0 0 0 .278-.451L8.5 3H4.453a.6.6 0 0 0-.577.435Z" stroke="#0c6350" strokeWidth={1.5} /> <path d="M3 10v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9" stroke="#0c6350" strokeWidth={1.5} /> </svg>
								) : (
									//prettier-ignore
									<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="m21.818 9.364-1.694-5.929A.6.6 0 0 0 19.547 3H15.5l.475 5.704a.578.578 0 0 0 .278.45c.39.233 1.152.663 1.747.846 1.016.313 2.5.2 3.346.096a.57.57 0 0 0 .472-.732Z" stroke="#393939" strokeWidth={1.5} /> <path d="M14 10c.568-.175 1.288-.574 1.69-.812a.578.578 0 0 0 .28-.549L15.5 3h-7l-.47 5.639a.578.578 0 0 0 .28.55c.402.237 1.122.636 1.69.811 1.493.46 2.507.46 4 0Z" stroke="#393939" strokeWidth={1.5} /> <path d="m3.876 3.435-1.694 5.93a.57.57 0 0 0 .472.73c.845.105 2.33.217 3.346-.095.595-.183 1.358-.613 1.747-.845a.578.578 0 0 0 .278-.451L8.5 3H4.453a.6.6 0 0 0-.577.435Z" stroke="#393939" strokeWidth={1.5} /> <path d="M3 10v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9" stroke="#393939" strokeWidth={1.5} /> </svg>
								)}
								<span>Marketplace</span>
								<span
									className="notification-number"
									style={{
										display:
											props.marketplaceNotificationCount === 0 ? "none" : "",
									}}>
									<p>{props.marketplaceNotificationCount}</p>
								</span>
							</Link>
						</li>
						<li>
							<Link
								aria-label="buildings"
								className={
									pathname.includes("buildings") ? "link active" : "link"
								}
								to="buildings">
								{pathname.includes("buildings") ? (
									//prettier-ignore
									<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M9 21h6m-6 0H7a4 4 0 0 1-4-4v-6.292a4 4 0 0 1 1.927-3.421l5-3.03a4 4 0 0 1 4.146 0l5 3.03A4 4 0 0 1 21 10.707V17a4 4 0 0 1-4 4H9Zm0 0v-4a3 3 0 1 1 6 0v4H9Z" stroke="#0c6350" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>
								) : (
									//prettier-ignore
									<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M9 21h6m-6 0H7a4 4 0 0 1-4-4v-6.292a4 4 0 0 1 1.927-3.421l5-3.03a4 4 0 0 1 4.146 0l5 3.03A4 4 0 0 1 21 10.707V17a4 4 0 0 1-4 4H9Zm0 0v-4a3 3 0 1 1 6 0v4H9Z" stroke="#393939" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>
								)}
								<span>Buildings</span>
							</Link>
						</li>
						<li>
							<Link
								aria-label="team"
								className={pathname.includes("team") ? "link active" : "link"}
								to="team">
								{pathname.includes("team") ? (
									//prettier-ignore
									<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M5 20v-1a7 7 0 1 1 14 0v1" stroke="#0c6350" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="#0c6350" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>
								) : (
									//prettier-ignore
									<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M5 20v-1a7 7 0 1 1 14 0v1" stroke="#393939" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="#393939" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>
								)}
								<span>Team</span>
							</Link>
						</li>
					</ul>
				</div>
				<div className="dac-logo">
					<p>Designed and developed by</p>
					<img
						src={require("../../assets/DAC_RGB-GREEN-Locked-Horizontal.png")}
						alt=""
					/>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
