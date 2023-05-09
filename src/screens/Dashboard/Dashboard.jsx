import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Profilebar from "../../components/Profilebar/Profilebar";
import Sidebar from "../../components/Sidebar/Sidebar";
import { auth } from "../../firebase/firebase-config";
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase-config";
import { onSnapshot, collection, getDocs } from "firebase/firestore";

import "./Dashboard.css";

const Dashboard = () => {
	let [hidden, setHidden] = useState("none");
	let [tenants, setTenants] = useState([]);
	let [unapprovedTenants, setUnapprovedTenants] = useState([]);
	let [buildings, setBuildings] = useState([]);
	let [newsfeedPosts, setNewsfeedPosts] = useState([]);
	let [unapprovedNewsfeedPosts, setUnapprovedNewsfeedPosts] = useState([]);
	let [marketplacePosts, setMarketplacePosts] = useState([]);
	let [unapprovedMarketplacePosts, setUnapprovedMarketplacePosts] = useState(
		[]
	);
	let pathname = useLocation().pathname;
	let navigate = useNavigate();
	// Get building data
	const getBuildings = () => {
		const buildingsRef = collection(db, "Buildings");
		getDocs(buildingsRef).then((snapshot) => {
			snapshot.forEach((building) => {
				let index = buildings.findIndex(
					(e) => e.buildingAddress === building.buildingAddress
				);
				if (index !== -1) return;
				buildings.push(building.data());
			});
			setBuildings((buildings = [...buildings]));
		});
	};

	// If pathname is just /dashboard, direct to /dashboard/tenants
	if (pathname === "/dashboard") navigate("/dashboard/tenants");
	// Check login status, if user is not logged in take them back to login
	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) return;
			navigate("/");
		});
	}, []);
	// Tenants data listener
	useEffect(() => {
		const tenantsRef = collection(db, "Tenants");
		setUnapprovedTenants((unapprovedTenants = []));
		let cleanup = onSnapshot(
			tenantsRef,
			{ includeMetadataChanges: true },
			async (snapshot) => {
				snapshot.docChanges().forEach((change) => {
					let tenantData = change.doc.data();
					if (
						tenantData.tenantAuthorized === false &&
						unapprovedTenants.findIndex(
							(e) => e.userID === tenantData.userID
						) === -1
					) {
						unapprovedTenants.push(tenantData);
					}
					let index = tenants.findIndex((e) => e.userID === tenantData.userID);
					if (change.type === "added") {
						if (tenantData.tenantAuthorized === false) return;
						// If tenant is already in the tenant list, don't add
						// Else, add
						if (index !== -1) {
							setTenants([...tenants]);
							return;
						}
						tenants.push(tenantData);
					}
					if (change.type === "removed") {
						if (index != -1) {
							return tenants.splice(
								tenants.findIndex((e) => e.userID === tenantData.userID),
								1
							);
						}
						unapprovedTenants.splice(
							unapprovedTenants.findIndex(
								(e) => e.userID === tenantData.userID
							),
							1
						);
					}
					if (change.type === "modified") {
						if (tenantData.tenantAuthorized === true) {
							if (
								unapprovedTenants.findIndex(
									(e) => e.userID === tenantData.userID
								) != -1
							) {
								unapprovedTenants.splice(
									unapprovedTenants.findIndex(
										(e) => e.userID === tenantData.userID
									),
									1
								);
							}
							if (index != -1) {
								tenants[index] = tenantData;
								return;
							}
							tenants.push(tenantData);
							return;
						}
						if (tenantData.tenantAuthorized === false) {
							tenants.splice(index, 1);
							return;
						}
						tenants.push(tenantData);
					}
				});
				await setUnapprovedTenants([...unapprovedTenants]);
				await setTenants([...tenants]);
			}
		);
		return () => {
			cleanup();
		};
	}, []);
	// Newsfeed data listener
	useEffect(() => {
		let newsfeedRef = collection(db, "Newsfeed");
		setNewsfeedPosts((newsfeedPosts = []));
		let cleanup = onSnapshot(
			newsfeedRef,
			{ includeMetadataChanges: true },
			async (snapshot) => {
				snapshot.docChanges().forEach((change) => {
					let postData = change.doc.data();
					let index = newsfeedPosts.findIndex((e) => e.id === postData.id);
					if (
						postData.isNSFW === true &&
						unapprovedNewsfeedPosts.findIndex((e) => e.id === postData.id) ===
							-1
					) {
						unapprovedNewsfeedPosts.push(postData);
					}
					if (change.type === "added") {
						if (postData.isNSFW === true) return;
						// If tenant is already in the tenant list, don't add
						// Else, add
						if (index !== -1) {
							setNewsfeedPosts([...newsfeedPosts]);
							return;
						}
						newsfeedPosts.push(postData);
					}
					if (change.type === "removed") {
						if (index != -1) {
							return newsfeedPosts.splice(index, 1);
						}
						unapprovedNewsfeedPosts.splice(
							unapprovedNewsfeedPosts.findIndex((e) => e.id === postData.id),
							1
						);
					}
					if (change.type === "modified") {
						if (postData.isNSFW === false) {
							if (
								unapprovedNewsfeedPosts.findIndex(
									(e) => e.id === postData.id
								) != -1
							) {
								unapprovedNewsfeedPosts.splice(
									unapprovedNewsfeedPosts.findIndex(
										(e) => e.id === postData.id
									),
									1
								);
							}
							if (index != -1) {
								newsfeedPosts[index] = postData;
								return;
							}
							newsfeedPosts.push(postData);
							return;
						}
						if (newsfeedPosts.isNSFW === true) {
							newsfeedPosts.splice(index, 1);
							return;
						}
						newsfeedPosts.push(postData);
					}
				});
				await setUnapprovedNewsfeedPosts([...unapprovedNewsfeedPosts]);
				await setNewsfeedPosts([...newsfeedPosts]);
			}
		);
		return () => {
			cleanup();
		};
	}, []);
	// Get building data
	useEffect(() => {
		getBuildings();
	}, []);
	// Marketplace data listener
	useEffect(() => {
		let marketplaceRef = collection(db, "Marketplace");
		setMarketplacePosts((marketplacePosts = []));
		setUnapprovedMarketplacePosts((unapprovedMarketplacePosts = []));
		let cleanup = onSnapshot(
			marketplaceRef,
			{ includeMetadataChanges: true },
			async (snapshot) => {
				snapshot.docChanges().forEach((change) => {
					let postData = change.doc.data();
					let index = marketplacePosts.findIndex((e) => e.id === postData.id);
					if (
						postData.isNSFW === true &&
						unapprovedMarketplacePosts.findIndex(
							(e) => e.id === postData.id
						) === -1
					) {
						unapprovedMarketplacePosts.push(postData);
					}
					if (change.type === "added") {
						if (postData.isNSFW === true) return;
						// If post is already in the post list, don't add
						// Else, add
						if (index !== -1) {
							setMarketplacePosts([...marketplacePosts]);
							return;
						}
						marketplacePosts.push(postData);
					}
					if (change.type === "removed") {
						if (index != -1) {
							return marketplacePosts.splice(index, 1);
						}
						unapprovedMarketplacePosts.splice(
							unapprovedMarketplacePosts.findIndex((e) => e.id === postData.id),
							1
						);
					}
					if (change.type === "modified") {
						if (postData.isNSFW === false) {
							if (
								unapprovedMarketplacePosts.findIndex(
									(e) => e.id === postData.id
								) != -1
							) {
								unapprovedMarketplacePosts.splice(
									unapprovedMarketplacePosts.findIndex(
										(e) => e.id === postData.id
									),
									1
								);
							}
							if (index != -1) {
								marketplacePosts[index] = postData;
								return;
							}
							marketplacePosts.push(postData);
							return;
						}
						if (marketplacePosts.isNSFW === true) {
							marketplacePosts.splice(index, 1);
							return;
						}
						marketplacePosts.push(postData);
					}
				});
				await setUnapprovedMarketplacePosts([...unapprovedMarketplacePosts]);
				await setMarketplacePosts([...marketplacePosts]);
			}
		);
		return () => {
			cleanup();
		};
	}, []);
	// Hide the page for 0.6 seconds
	setTimeout(() => {
		setHidden("");
	}, 600);
	return (
		<div style={{ display: hidden }}>
			<Sidebar
				tenantNotificationCount={unapprovedTenants.length}
				newsfeedNotificationCount={unapprovedNewsfeedPosts.length}
				marketplaceNotificationCount={unapprovedMarketplacePosts.length}
			/>
			<Profilebar />
			<div className="pages-container">
				<Outlet
					context={
						// Determine which data to pass down to which component (screen), works just like a switch case
						{
							"/dashboard/tenants": [
								tenants,
								setTenants,
								unapprovedTenants,
								setUnapprovedTenants,
								buildings,
							],
							"/dashboard/new-tenants": [
								tenants,
								setTenants,
								unapprovedTenants,
								setUnapprovedTenants,
								buildings,
							],
							"/dashboard/newsfeed": [
								newsfeedPosts,
								unapprovedNewsfeedPosts,
								buildings,
							],
							"/dashboard/approve-newsfeed-posts": [
								newsfeedPosts,
								unapprovedNewsfeedPosts,
								buildings,
							],
							"/dashboard/marketplace": [
								marketplacePosts,
								unapprovedMarketplacePosts,
								buildings,
							],
							"/dashboard/approve-marketplace-posts": [
								marketplacePosts,
								unapprovedMarketplacePosts,
								buildings,
							],
							"/dashboard/announcements": [buildings],
							"/dashboard/notices": [tenants, buildings],
						}[pathname]
					}
				/>
			</div>
		</div>
	);
};

export default Dashboard;
