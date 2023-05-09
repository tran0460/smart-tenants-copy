import { useState, useRef } from "react";
import PasswordInput from "../../../components/PasswordInput/PasswordInput.jsx";
import "./Settings.css";

const Settings = () => {
	let [changePasswordMode, setChangePasswordMode] = useState(false);
	let [weakPassword, setWeakPassword] = useState(true);
	let [unmatchedPasswords, setUnmatchedPasswords] = useState(true);
	let [password, setPassword] = useState("");
	let [newPassword, setNewPassword] = useState("");
	const [avatar, setAvatar] = useState(
		require("../../../assets/avatar-placeholder.png")
	);
	const fileInputRef = useRef(null);
	const pencilIcon =
		//prettier-ignore
		<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m13.02 5.828 4.95 4.95m-4.95-4.95L15.85 3l4.95 4.95-2.829 2.828-4.95-4.95Zm0 0-9.606 9.607a1 1 0 0 0-.293.707v4.536h4.536a1 1 0 0 0 .707-.293l9.606-9.607-4.95-4.95Z" stroke="#0C6350" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	return (
		<div>
			<div className="searchBar">
				<h2>Settings</h2>
			</div>
			<div className="settings-page-container">
				<div className="settings-user-profile">
					<div className="settings-image-container">
						<img src={avatar} alt="avatar" />
						<span
							className="settings-image-edit-button"
							onClick={() => fileInputRef.current.click()}>
							{pencilIcon}
						</span>
						<input
							type="file"
							style={{ display: "none" }}
							accept=".png,.jpg,.jpeg"
							ref={fileInputRef}
							onChange={(e) => {
								setAvatar(URL.createObjectURL(e.target.files[0]));
							}}
						/>
					</div>
					<div className="settings-personal-information">
						<p className="header">Personal Information</p>
						<label htmlFor="">First Name</label>
						<input type="text" />
						<label htmlFor="">Last Name</label>
						<input type="text" />
						<label htmlFor="">Email</label>
						<input type="mail" className="disabled" disabled />
						<label htmlFor="">Phone number</label>
						<input type="tel" />
						<button>Save</button>
					</div>
					<div className="settings-security">
						<p className="header">Security</p>
						{changePasswordMode ? (
							<>
								<label>Current password</label>
								<PasswordInput
									password={password}
									setPassword={setPassword}
									placeholder="New Password"
								/>
								<label>New password</label>
								<PasswordInput
									password={password}
									setPassword={setPassword}
									placeholder="New Password"
								/>
								<small
									style={{
										display: weakPassword ? "unset" : "none",
									}}>
									Must be at least 6 characters
								</small>
								<label>Confirm new password</label>
								<PasswordInput
									password={newPassword}
									setPassword={setNewPassword}
									placeholder="Confirm Password"
								/>
								<small
									style={{
										display: unmatchedPasswords ? "unset" : "none",
									}}>
									Password must match
								</small>
							</>
						) : (
							""
						)}
						<button
							className="outline"
							onClick={() => setChangePasswordMode(!changePasswordMode)}>
							Change Password
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Settings;
