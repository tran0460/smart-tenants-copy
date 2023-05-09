import "./App.css";
import { Routes, Route } from "react-router-dom";
import SignInScreen from "./screens/SignIn/SignInScreen";
import ResetPasswordScreen from "./screens/ResetPassword/ResetPasswordScreen";
import CreateNewPasswordScreen from "./screens/CreateNewPassword/CreateNewPasswordScreen";
import Dashboard from "./screens/Dashboard/Dashboard";
import TenantsScreen from "./screens/Dashboard/Tenants/TenantsScreen";
import NoticesScreen from "./screens/Dashboard/Communication/Notices/NoticesScreen";
import AnnouncementsScreen from "./screens/Dashboard/Communication/Announcements/AnnoucementsScreen";
import NewsfeedScreen from "./screens/Dashboard/Newsfeed/NewsfeedScreen";
import MarketplaceScreen from "./screens/Dashboard/Marketplace/MarketplaceScreen";
import BuildingsScreen from "./screens/Dashboard/Buildings/BuildingsScreen";
import TeamScreen from "./screens/Dashboard/Team/TeamScreen";
import NewTenantsScreen from "./screens/Dashboard/NewTenants/NewTenantsScreen";
import NewsfeedApprovePosts from "./screens/Dashboard/NewsfeedApprovePosts/NewsfeedApprovePosts";
import MarketplaceApprovePost from "./screens/Dashboard/MarketplaceApprovePost/MaketplaceApprovePost";
import Settings from "./screens/Dashboard/Settings/Settings";

function App() {
	document.title = "Smart Tenant Admin Portal";
	return (
		<>
			<Routes>
				<Route path="/" element={<SignInScreen />} />
				<Route path="/reset-password" element={<ResetPasswordScreen />} />
				<Route
					path="/create-new-password"
					element={<CreateNewPasswordScreen />}
				/>
				<Route path="/dashboard" element={<Dashboard />}>
					<Route path="tenants" element={<TenantsScreen />}>
						{/* Not yet implemented */}
						{/* <Route path=":userID" /> */}
					</Route>
					<Route path="new-tenants" element={<NewTenantsScreen />} />
					<Route path="notices" element={<NoticesScreen />} />
					<Route path="announcements" element={<AnnouncementsScreen />} />
					<Route path="newsfeed" element={<NewsfeedScreen />} />
					<Route
						path="approve-newsfeed-posts"
						element={<NewsfeedApprovePosts />}
					/>
					<Route path="marketplace" element={<MarketplaceScreen />} />
					<Route
						path="approve-marketplace-posts"
						element={<MarketplaceApprovePost />}
					/>
					<Route path="buildings" element={<BuildingsScreen />} />
					<Route path="team" element={<TeamScreen />} />
					<Route path="settings" element={<Settings />} />
				</Route>
			</Routes>
		</>
	);
}

export default App;
