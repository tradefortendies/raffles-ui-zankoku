import * as anchor from '@project-serum/anchor';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import HomePage from '../component/pages/HomePage';
// import LandingPage from '../component/pages/LandingPage';
// import RafflePage from '../component/pages/RafflePage';
// import RaffleTablePage from '../component/pages/RaffleTablePage';
import React from 'react';

interface AppRouterProps {
	connection: anchor.web3.Connection;
}

export default function AppRouter({ connection }: AppRouterProps) {
	// @ts-ignore
	return (
		<Router>
			<Routes>
				<Route path={'/'} element={<HomePage />} />
				{/* <Route path={'/raffle'} element={<HomePage />} />
				<Route path="/raffle-buy" element={<RafflePage />} />
				<Route path="/raffle-table" element={<RaffleTablePage />} /> */}
			</Routes>
		</Router>
	);
}
