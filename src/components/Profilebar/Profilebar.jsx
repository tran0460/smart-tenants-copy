import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase-config";

import "./Profilebar.css";

const Profilebar = () => {
	// The profile bar on top of the screen
	const avatar = require("../../assets/avatar-placeholder.png");
	const navigate = useNavigate();
	let [dropdownVisible, setDropdownVisible] = useState(false);
	return (
		<div className="profilebar-container">
			<div
				tabIndex={0}
				aria-label="my profile"
				className="profile"
				onKeyDown={(e) => {
					if (e.key === "Enter") setDropdownVisible(!dropdownVisible);
				}}
				onClick={() => setDropdownVisible(!dropdownVisible)}>
				<div className="profile-image-container">
					<img src={avatar} alt="avatar" />
				</div>
				<span>John Doe</span>
				{
					/* prettier-ignore */
					dropdownVisible 
                    //down arrow
                    ? <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="m6 15 6-6 6 6" stroke="#4D4D4D" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>
                    //up arrow
                    : <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="m6 9 6 6 6-6" stroke="#4D4D4D" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>
				}
			</div>
			<div
				className="invisible-bg"
				style={{
					display: dropdownVisible ? "" : "none",
					width: "100vw",
					height: "100vh",
				}}
				onClick={() => {
					setDropdownVisible(false);
				}}></div>
			<div
				className="profile-dropdown"
				style={{ display: dropdownVisible ? "" : "none" }}>
				<ul>
					<li>
						<Link
							aria-label="settings"
							onClick={() => setDropdownVisible(false)}
							to="/dashboard/settings"
							className="dropdown-link border-bottom">
							{/* prettier-ignore */}
							<span>
								<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="#4E4D4D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> <path d="m19.622 10.395-1.097-2.65L20 6l-2-2-1.735 1.483-2.707-1.113L12.935 2h-1.954l-.632 2.401-2.645 1.115L6 4 4 6l1.453 1.789-1.08 2.657L2 11v2l2.401.655L5.516 16.3 4 18l2 2 1.791-1.46 2.606 1.072L11 22h2l.604-2.387 2.651-1.098C16.697 18.831 18 20 18 20l2-2-1.484-1.75 1.098-2.652 2.386-.62V11l-2.378-.605Z" stroke="#4E4D4D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>
							</span>
							Settings
						</Link>
					</li>
					<li>
						<Link
							aria-label="sign out"
							className="dropdown-link"
							to=""
							onClick={async () => {
								await auth.signOut().catch((error) => {
									console.log(error);
								});
								navigate("/");
							}}>
							{/* prettier-ignore */}
							<span>
								<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m19 12-3-3m-4 3h7-7Zm7 0-3 3 3-3ZM19 6V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1" stroke="#4E4D4D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>
							</span>
							Sign Out
						</Link>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Profilebar;
