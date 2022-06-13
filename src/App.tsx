import * as anchor from '@project-serum/anchor';

import {
	ConnectionProvider,
	WalletProvider,
} from '@solana/wallet-adapter-react';
import {
	getPhantomWallet,
	getSlopeWallet,
	getSolflareWallet,
	getSolletExtensionWallet,
	getSolletWallet,
} from '@solana/wallet-adapter-wallets';

import AppRouter from './routes/AppRouter';
import { CardContextProvider } from './context/cardContext';
import DefaultTheme from './utils/styles/DefaultTheme';
import ProgramApisProvider from './providers/ProgramApisProvider';
import RafflesStoreProvider from './providers/RafflesStoreProvider';
import { ThemeProvider } from '@material-ui/core';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletDialogProvider } from '@solana/wallet-adapter-material-ui';
import { useMemo } from 'react';

const network = process.env.REACT_APP_SOLANA_NETWORK as WalletAdapterNetwork;
const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST!;
const connection = new anchor.web3.Connection(
	rpcHost ? rpcHost : anchor.web3.clusterApiUrl('devnet')
);

const App = () => {
	const endpoint = process.env.REACT_APP_SOLANA_RPC_HOST!;

	const wallets = useMemo(
		() => [
			getPhantomWallet(),
			getSolflareWallet(),
			getSlopeWallet(),
			getSolletWallet({ network }),
			getSolletExtensionWallet({ network }),
		],
		[]
	);

	return (
		<ThemeProvider theme={DefaultTheme}>
			<ConnectionProvider endpoint={endpoint}>
				<WalletProvider wallets={wallets} autoConnect>
					<WalletDialogProvider>
						<ProgramApisProvider>
							<RafflesStoreProvider>
								<CardContextProvider>
									<AppRouter connection={connection} />
								</CardContextProvider>
							</RafflesStoreProvider>
						</ProgramApisProvider>
					</WalletDialogProvider>
				</WalletProvider>
			</ConnectionProvider>
		</ThemeProvider>
	);
};

export default App;
