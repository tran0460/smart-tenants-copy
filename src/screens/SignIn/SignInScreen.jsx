import { useState, useEffect } from "react";
import { auth, db } from "../../firebase/firebase-config.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import "./SignInScreen.css";
import PasswordInput from "../../components/PasswordInput/PasswordInput.jsx";

const SignInScreen = () => {
	let [hidden, setHidden] = useState("none");
	const smartLivingLogo = require("../../assets/smart-living-logo.png");
	const logInLogo = require("../../assets/log-in.png");
	let [email, setEmail] = useState("");
	let [password, setPassword] = useState("");
	let [errorMessage, setErrorMessage] = useState("");
	let navigate = useNavigate();
	const warningIcon =
		//prettier-ignore
		<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M12 7.5V13.5" stroke="#FDCA40" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M12 17.51L12.01 17.4989" stroke="#FDCA40" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M12 22.5C17.5228 22.5 22 18.0228 22 12.5C22 6.97715 17.5228 2.5 12 2.5C6.47715 2.5 2 6.97715 2 12.5C2 18.0228 6.47715 22.5 12 22.5Z" stroke="#FDCA40" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>;
	const errorIcon =
		//prettier-ignore
		<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M12 7.5V13.5" stroke="#E71D36" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M12 17.51L12.01 17.4989" stroke="#E71D36" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M12 22.5C17.5228 22.5 22 18.0228 22 12.5C22 6.97715 17.5228 2.5 12 2.5C6.47715 2.5 2 6.97715 2 12.5C2 18.0228 6.47715 22.5 12 22.5Z" stroke="#E71D36" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>;
	// Handles login
	const handleLogin = (email, password) => {
		signInWithEmailAndPassword(auth, email, password)
			.then(async (res) => {
				// Check if the user is an admin, if they are, go to dashboard
				let isAdmin = await checkIsAdmin(res.user.uid);
				if (!isAdmin) {
					setErrorMessage("User not found");
					return;
				}
				navigate("/dashboard");
			})
			.catch((err) => {
				// Sets error message to display
				if (err.message.includes("internal-error") && !password) {
					return setErrorMessage("Password cannot be empty");
				}
				if (err.message.includes("user-not-found")) {
					return setErrorMessage("User not found");
				}
				if (err.message.includes("invalid-email")) {
					return setErrorMessage("Invalid email address");
				}
				if (err.message.includes("wrong-password")) {
					return setErrorMessage(
						"Incorrect email or password. Please, try again."
					);
				}
				if (err.message.includes("too-many-requests")) {
					return setErrorMessage(
						"Too many failed attempts, please try again later"
					);
				}
				setErrorMessage(err.message);
			});
	};

	// returns true if user is admin, false if not
	const checkIsAdmin = async (uid) => {
		const adminsData = collection(db, "Admins");
		const q = query(adminsData, where("id", "==", uid));
		const querySnapshot = await getDocs(q);
		if (!querySnapshot.empty) {
			return true;
		}
		return false;
	};
	// If user is logged in, take them to dashboard
	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) return navigate("/dashboard");
		});
	});
	setTimeout(() => {
		setHidden("");
	}, 600);
	return (
		<div className="container" style={{ display: hidden }}>
			<div className="left">
				<img
					className="smart-living-logo"
					src={smartLivingLogo}
					alt="smart living logo"
				/>
				<div className="image-container">
					<img src={logInLogo} alt="log in logo" className="login-logo" />
				</div>
			</div>
			<div className="right">
				<div className="form-container slide-in">
					<h1>Welcome</h1>
					<h3>Sign in to your admin account</h3>
					<form action="">
						<div
							className="error-box"
							style={{ display: errorMessage ? "" : "none" }}>
							<span>{errorIcon}</span>
							<p>{errorMessage}</p>
						</div>
						<div className="email-input">
							<label htmlFor="email">Email</label>
							<input
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								type="text"
								placeholder="placeholder@mail.com"
								name="email"
								onClick={() => setErrorMessage((errorMessage = ""))}
							/>
						</div>
						<div className="password-input">
							<label htmlFor="password">Password</label>
							<PasswordInput
								password={password}
								setPassword={setPassword}
								onClick={() => setErrorMessage("")}
							/>
						</div>
						<Link className="forgot-password-link" to="/reset-password">
							Forgot password?
						</Link>
						<button
							className="sign-in-button main"
							onClick={(e) => {
								e.preventDefault();
								// sign in with current value in the form fields
								handleLogin(email, password);
							}}>
							Sign In
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default SignInScreen;
