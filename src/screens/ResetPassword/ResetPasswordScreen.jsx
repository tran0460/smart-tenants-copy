import { useState, useEffect, useRef } from "react";
import "./ResetPasswordScreen.css";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { db } from "../../firebase/firebase-config";

const ResetPasswordScreen = () => {
	let [hidden, setHidden] = useState("none");
	const smartLivingLogo = require("../../assets/smart-living-logo.png");
	const passwordImage = require("../../assets/password.png");
	const emailSentImage = require("../../assets/email-sent.png");
	const auth = getAuth();
	const navigate = useNavigate();
	let [email, setEmail] = useState("");
	let [linkSent, setLinkSent] = useState(false);
	let [errorMessage, setErrorMessage] = useState("");
	let containerRef = useRef(null);
	/* 
	Quick note: The reset password email may end up in Junk
	*/
	const errorIcon =
		//prettier-ignore
		<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M12 7.5V13.5" stroke="#E71D36" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M12 17.51L12.01 17.4989" stroke="#E71D36" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M12 22.5C17.5228 22.5 22 18.0228 22 12.5C22 6.97715 17.5228 2.5 12 2.5C6.47715 2.5 2 6.97715 2 12.5C2 18.0228 6.47715 22.5 12 22.5Z" stroke="#E71D36" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>;
	// Handle sending the reset link
	const sendResetLink = (auth, email) => {
		sendPasswordResetEmail(auth, email)
			.then(() => {
				setLinkSent(true);
			})
			.catch((err) => {
				if (
					err.message.includes("internal-error") ||
					err.message.includes("user-not-found")
				) {
					return setErrorMessage("User not found");
				}
				if (err.message.includes("invalid-email")) {
					return setErrorMessage("Invalid email address");
				}
				if (err.message.includes("too-many-requests")) {
					return setErrorMessage("Too many attempts, please try again later");
				}
				return setErrorMessage(err.message);
			});
	};
	// Check if email is valid
	const validateEmail = (email) => {
		const re =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	};
	// Check if the account associated with the email is an admin account
	const checkIsAdmin = async (email) => {
		if (validateEmail(email) === false) {
			setErrorMessage("Invalid email");
			return;
		}
		const adminsData = collection(db, "Admins");
		const q = query(adminsData, where("email", "==", email));
		const querySnapshot = await getDocs(q);
		if (!querySnapshot.empty) {
			sendResetLink(auth, email);
			return;
		}
		return setErrorMessage("User not found");
	};
	// If user is logged in, go to dashboard
	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) return navigate("/dashboard");
		});
	});
	// After the link is sent successfully, add animation to message
	useEffect(() => {
		containerRef.current.className = "form-container slide-in";
	}, [linkSent]);
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
					{linkSent ? (
						<img src={emailSentImage} alt="email sent image" />
					) : (
						<img src={passwordImage} alt="password image" />
					)}
				</div>
			</div>
			<div className="right">
				{/* prettier-ignore */}
				<div onAnimationEnd={(e) => {e.target.className = "form-container"}} className="form-container slide-in" ref={containerRef}>
					{/* 
						change the content on the screen depending on whether if the email
						reset request is successful or not
					*/}
					{linkSent ? (
						<>
							<h1>Reset link sent</h1>
							<h3>Click the link sent to your email address to reset the password</h3>
							<form action="">
								<button
									className="outline"
									onClick={(e) => {
										e.preventDefault();
										navigate("/");
									}}>
									Back to Sign In
								</button>
							</form>
						</>
					) : (
						<>
							<h1>Forgot password?</h1>
							<h3>Enter your email address to receive a password reset link</h3>
							<form action="">
							<div
								className="error-box"
								style={{ display: errorMessage ? "" : "none" }}>
								<span>{errorIcon}</span>
								<p>{errorMessage}</p>
							</div>
								<div className="email-input" style={{marginBottom: '3rem'}}>
							<label htmlFor="email">Email</label>
									<input
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										onClick={() => setErrorMessage(errorMessage = "")}
										type="email"
										name='email'
										placeholder="example@mail.com"
									/>
								</div>
								<button
									className="main"
									onClick={async (e) => {
										e.preventDefault();
										checkIsAdmin(email);
									}}>
									Send
								</button>
								<button
								style={{ marginTop: "1.5rem"}}
								className="outline"
								onClick={(e) => {
									e.preventDefault();
									navigate("/");
								}}>
								Back to Sign In
							</button>
							</form>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default ResetPasswordScreen;
