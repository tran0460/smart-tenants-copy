import { useState, useEffect } from "react";
import "./AttachmentBox.css";
const AttachmentBox = (props) => {
	// Get the file name
	let [name, setName] = useState("");
	const xmark =
		//prettier-ignore
		<svg width={8} height={8} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m4 4 3.496 3.495m-6.99 0L4 4 .505 7.495Zm6.99-6.99L4 4 7.496.505ZM4 4 .505.505 4.001 4Z" stroke="#4E4D4D" strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	const paperClipGrey =
		//prettier-ignore
		<svg width={22} height={23} fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="m20.438 11.162-9.19 9.19a6.003 6.003 0 1 1-8.49-8.49l9.19-9.19a4.002 4.002 0 0 1 5.66 5.66l-9.2 9.19a2.001 2.001 0 1 1-2.83-2.83l8.49-8.48" stroke="#4E4D4D" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	useEffect(() => {
		//Extract the file name from the url
		setName(
			(name =
				typeof props.currentFile === "string"
					? props.currentFile.match(/%2..*%2F(.*?)\?/g)[0].slice(52)
					: props.currentFile.name)
		);
		if (name.includes("%20")) setName((name = name.replace("%20", " ")));
	}, [name]);
	return (
		<div className="attachmentBox">
			<span>{paperClipGrey}</span>
			<p
				onClick={() => {
					if (typeof props.currentFile === "string") {
						return window.open(props.currentFile, "_blank");
					}
					let fileURL = URL.createObjectURL(props.currentFile);
					window.open(fileURL, "_blank");
				}}>
				{name}
			</p>
			<span
				style={{ display: props.viewOnly ? "none" : "" }}
				onClick={() => {
					props.files.splice(props.id, 1);
					props.setFiles([...props.files]);
				}}>
				{xmark}
			</span>
		</div>
	);
};

export default AttachmentBox;
