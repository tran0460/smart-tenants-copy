import { useState, useRef, useEffect } from "react";
import "./PasswordInput.css";

/* 
HOW TO USE
- Pass in password/setPassword as props (required) so this component can return data up to the parent component
- Optional placeholder prop, if nothing is passed in "Password" will be default placeholder
*/

const PasswordInput = (props) => {
	let [passwordHidden, setPasswordHidden] = useState(true);
	let passwordRef = useRef(null);
	useEffect(() => {
		if (props.setPasswordRef) {
			props.setPasswordRef(passwordRef);
		}
	});
	return (
		<div className="password-input-container">
			{/* prettier-ignore */}
			<i>
				{/* switch back and forth between closed eye / opened eye */}
				{
					passwordHidden 
					// closed eye icon
					? <svg onClick={() => setPasswordHidden(!passwordHidden)}	width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M4.5 8c3 6.5 12 6.5 15 0M16.816 11.318 19.5 15M12 12.875V16.5M7.184 11.318 4.5 15" stroke="#B8B8B8" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>
					// opened eye icon
					: <svg onClick={() => setPasswordHidden(!passwordHidden)}	width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="#B8B8B8" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> <path d="M21 12c-1.889 2.991-5.282 6-9 6s-7.111-3.009-9-6c2.299-2.842 4.992-6 9-6s6.701 3.158 9 6Z" stroke="#B8B8B8" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>
				}
			</i>
			<input
				ref={passwordRef}
				value={props.password}
				onChange={(e) => {
					props.setPassword(e.target.value);
					if (props.formCheck) props.formCheck();
				}}
				type={passwordHidden ? "password" : "text"}
				placeholder={props.placeholder ? props.placeholder : "Password"}
				className={props.className}
				onClick={props.onClick}
				autoComplete
			/>
		</div>
	);
};

export default PasswordInput;
