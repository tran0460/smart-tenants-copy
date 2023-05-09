import { useState, useEffect } from "react";
import {
	verifyPasswordResetCode,
	confirmPasswordReset,
	getAuth,
} from "firebase/auth";
import { useSearchParams, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/PasswordInput/PasswordInput.jsx";
import "./CreateNewPasswordScreen.css";

const CreateNewPasswordScreen = () => {
	let [hidden, setHidden] = useState("none");
	let [passwordRef, setPasswordRef] = useState();
	let [newPasswordRef, setNewPasswordRef] = useState();

	const smartLivingLogo = require("../../assets/smart-living-logo.png");
	const newPasswordImage = require("../../assets/new-password.png");
	const successIcon =
		//prettier-ignore
		<svg width={24} height={25} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="m7 13 3 3 7-7" stroke="#51DC6B" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> <path d="M12 22.5c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10Z" stroke="#51DC6B" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const warningIcon =
		//prettier-ignore
		<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M12 7.5V13.5" stroke="#FDCA40" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> <path d="M12 17.51L12.01 17.4989" stroke="#FDCA40" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> <path d="M12 22.5C17.5228 22.5 22 18.0228 22 12.5C22 6.97715 17.5228 2.5 12 2.5C6.47715 2.5 2 6.97715 2 12.5C2 18.0228 6.47715 22.5 12 22.5Z" stroke="#FDCA40" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>;
	const errorIcon =
		//prettier-ignore
		<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M12 7.5V13.5" stroke="#E71D36" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> <path d="M12 17.51L12.01 17.4989" stroke="#E71D36" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> <path d="M12 22.5C17.5228 22.5 22 18.0228 22 12.5C22 6.97715 17.5228 2.5 12 2.5C6.47715 2.5 2 6.97715 2 12.5C2 18.0228 6.47715 22.5 12 22.5Z" stroke="#E71D36" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>;

	const auth = getAuth();
	const navigate = useNavigate();
	//prettier-ignore
	let [searchParams, ] = useSearchParams();
	// Error message for form validation, displays corresponding warning
	let [weakPassword, setWeakPassword] = useState(false);
	let [unmatchedPasswords, setUnmatchedPasswords] = useState(false);
	//
	let [password, setPassword] = useState("");
	let [newPassword, setNewPassword] = useState("");

	// Get the action to complete.
	// const mode = searchParams.get("mode");
	// Get the one-time code from the query parameter.
	const actionCode = searchParams.get("oobCode");
	// (Optional) Get the continue URL from the query parameter if available.
	const continueUrl = searchParams.get("continueUrl");
	// (Optional) Get the language code if available.
	const lang = searchParams.get("lang") || "en";
	const formCheck = () => {
		setPassword(
			passwordRef
				? (password = passwordRef.current.value)
				: (password = password)
		);
		setNewPassword(
			newPasswordRef
				? (newPassword = newPasswordRef.current.value)
				: (newPassword = newPassword)
		);
		if (password !== newPassword) {
			setUnmatchedPasswords(true);
		} else {
			setUnmatchedPasswords(false);
		}
		if (password.length < 6) {
			setWeakPassword(true);
		} else {
			setWeakPassword(false);
		}
	};
	function handleResetPassword(auth, actionCode, continueUrl, lang) {
		verifyPasswordResetCode(auth, actionCode)
			.then(() => {
				// Save the new password.
				confirmPasswordReset(auth, actionCode, newPassword)
					.then(() => {
						console.log("Password reset successful");
					})
					.catch((error) => {});
			})
			.catch((error) => {});
	}

	const validateForm = async () => {
		/* If conditions pass, send the request */
		if (!unmatchedPasswords && !weakPassword) {
			await handleResetPassword(auth, actionCode, continueUrl, lang);
			return navigate("/");
		}
	};
	return (
		<div className="container new-password">
			<div className="left">
				<img
					className="smart-living-logo"
					src={smartLivingLogo}
					alt="smart living logo"
				/>
				<div className="image-container">
					<img src={newPasswordImage} alt="new password image" />
				</div>
			</div>
			<div className="right">
				<div className="form-container slide-in">
					<h1>New Password</h1>
					<h3>Create new password to your account</h3>
					<form action="">
						<div className="password-input">
							<label>New password</label>
							<PasswordInput
								password={password}
								setPassword={setPassword}
								placeholder="New Password"
								setPasswordRef={setPasswordRef}
								formCheck={formCheck}
								className={
									passwordRef
										? passwordRef.current.value === ""
											? ""
											: weakPassword
											? "input-error"
											: ""
										: ""
								}
							/>
							<span
								style={{
									display: passwordRef
										? passwordRef.current.value === ""
											? "none"
											: ""
										: "",
								}}>
								{" "}
								{passwordRef
									? passwordRef.current.value === ""
										? ""
										: weakPassword
										? errorIcon
										: successIcon
									: ""}{" "}
							</span>
							<small
								style={{
									color: passwordRef
										? passwordRef.current.value === ""
											? ""
											: weakPassword
											? "#E71D36"
											: ""
										: "",
								}}>
								Must be at least 6 characters
							</small>
						</div>
						<div className="password-input">
							<label>Confirm new password</label>
							<PasswordInput
								password={newPassword}
								setPassword={setNewPassword}
								placeholder="Confirm Password"
								setPasswordRef={setNewPasswordRef}
								formCheck={formCheck}
								className={
									newPasswordRef
										? newPasswordRef.current.value === ""
											? ""
											: unmatchedPasswords
											? "input-error"
											: ""
										: ""
								}
							/>
							<span>
								{" "}
								{newPassword === ""
									? ""
									: unmatchedPasswords
									? errorIcon
									: successIcon}{" "}
							</span>
							<small
								style={{
									color: newPasswordRef
										? newPasswordRef.current.value === ""
											? ""
											: unmatchedPasswords
											? "#E71D36"
											: ""
										: "",
								}}>
								Password must match
							</small>
						</div>
						<button
							style={{ marginTop: "3rem" }}
							className="main"
							onClick={(e) => {
								e.preventDefault();
								validateForm();
							}}>
							Save Password
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default CreateNewPasswordScreen;
