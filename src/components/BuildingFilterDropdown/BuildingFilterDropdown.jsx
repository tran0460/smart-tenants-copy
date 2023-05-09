import React from "react";

const BuildingFilterDropdown = (props) => {
	/*
		Component for the building filter dropdown.
		Required props: 
		- toggleBuildingDropdown
		- buildingSearchQuery
		- setBuildingSearchQuery
		- timeout (for showing/hiding the scrollbar)
		-  buildingsCheckAllRef
		- buildingsCheckedList
	 */
	const magnifyingGlass =
		//prettier-ignore
		<svg className="search-icon" width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="m16 16 3.5 3.5M5 11a6 6 0 1 0 12 0 6 6 0 0 0-12 0Z" stroke="#9D9D9D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </svg>;
	return (
		<>
			{" "}
			<div
				className="list-dropdown"
				style={{ display: props.toggleBuildingDropdown ? "" : "none" }}>
				<div className="search">
					<input
						aria-label="search for buildings"
						className="search-input"
						name="search-input"
						id="search-input"
						type="text"
						placeholder="Search buildings"
						value={props.buildingsSearchQuery}
						onChange={(e) => {
							props.setBuildingsSearchQuery(e.target.value);
						}}
					/>
					<span>{magnifyingGlass}</span>
				</div>
				<div className="buildings-list-area">
					<ul
						onWheel={(e) => {
							e.currentTarget.className = "scroll-visible";
						}}
						onScroll={(e) => {
							window.clearTimeout(props.timeout);
							props.setTimeout(
								window.setTimeout(() => {
									e.target.className = "";
								}, 1000)
							);
						}}>
						<li>
							<div
								className={
									props.buildingsCheckAllRef.current
										? props.buildingsCheckAllRef.current.checked === true
											? "buildings-list-item-header active"
											: "buildings-list-item-header"
										: ""
								}>
								<label htmlFor="" className="label-container">
									<input
										type="checkbox"
										ref={props.buildingsCheckAllRef}
										checked={
											props.buildingsCheckedList.includes(false) ||
											props.buildingsCheckedList.includes(undefined) ||
											props.buildingsCheckedList.length === 0
												? false
												: true
										}
										onChange={() => {}}
										onClick={(e) => {
											props.handleBuildingsSelectAll(!e.target.checked);
										}}
									/>
									<span className="checkmark"></span>
								</label>
								<p>Select all</p>
							</div>
						</li>
						{props.buildings.map((building, index) => {
							if (
								props.buildingsSearchQuery &&
								building.buildingName
									.toLowerCase()
									.includes(props.buildingsSearchQuery.toLowerCase())
							) {
								return (
									<>
										<li>
											<div
												className={
													props.buildingsCheckedList[index] === true
														? "list-dropdown-list-item active"
														: "list-dropdown-list-item "
												}>
												<label htmlFor="" className="label-container">
													<input
														type="checkbox"
														onChange={() => {}}
														checked={props.buildingsCheckedList[index]}
														onClick={() => {
															props.buildingsCheckedList[index] =
																!props.buildingsCheckedList[index];
															props.setBuildingsCheckedList([
																...props.buildingsCheckedList,
															]);
														}}
													/>
													<span className="checkmark"></span>
												</label>
												<p>
													{building.buildingName
														? building.buildingName
														: "TBD"}
												</p>
											</div>
										</li>
									</>
								);
							}
							if (!props.buildingsSearchQuery) {
								return (
									<>
										<li>
											<div
												className={
													props.buildingsCheckedList[index] === true
														? "list-dropdown-list-item active"
														: "list-dropdown-list-item "
												}>
												<label htmlFor="" className="label-container">
													<input
														defaultChecked={false}
														type="checkbox"
														onChange={() => {}}
														checked={props.buildingsCheckedList[index]}
														onClick={() => {
															props.buildingsCheckedList[index] =
																!props.buildingsCheckedList[index];
															props.setBuildingsCheckedList([
																...props.buildingsCheckedList,
															]);
														}}
													/>
													<span className="checkmark"></span>
												</label>
												<p>
													{building.buildingName
														? building.buildingName
														: "TBD"}
												</p>
											</div>
										</li>
									</>
								);
							}
						})}
					</ul>
				</div>
			</div>
		</>
	);
};

export default BuildingFilterDropdown;
