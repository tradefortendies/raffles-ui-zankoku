import { Connection, PublicKey } from '@solana/web3.js';
import {
	DraffleProgram,
	EntrantsDataRaw,
	RaffleDataRaw,
} from './ProgramApisProvider';
import { Entrant, Raffle, RaffleMetaData } from '../lib/types';
import { ProgramAccount, web3 } from '@project-serum/anchor';
import React, {
	FC,
	createContext,
	useCallback,
	useEffect,
	useState,
} from 'react';
import {
	fetchPrizes,
	fetchProceedsAccount,
	getRaffleProgramAccounts,
	toEntrantsProcessed,
} from '../lib/store';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { RAFFLES_WHITELIST } from '../config/raffleWhitelist';
import { areEqualObjects } from '../lib/utils';
import { cloneDeep } from 'lodash';
import { useProgramApis } from '../hooks/useProgramApis';

export interface RafflesStore {
	raffles: Map<string, Raffle>;
	fetchAllRaffles: (includeEmpty?: boolean) => void;
	updateRaffleById: (raffleId: string) => void;
	fetching: boolean;
	balance: number;
	usdcBalance: number;
}

// @ts-ignore
export const RafflesStoreContext = createContext<RafflesStore>();

const RafflesStoreProvider: FC = ({ children = null as any }) => {
	const { connection } = useConnection();
	const { publicKey } = useWallet();
	const { draffleClient } = useProgramApis();

	const [fetching, setFetching] = useState<boolean>(true); // prevents messy first render, but probably not optimal
	const [raffles, setRaffles] = useState<Map<string, Raffle>>(
		new Map<string, Raffle>()
	);

	const [balance, setBalance] = useState<number>(0);
	const [usdcBalance, setUsdcBalance] = useState<number>(0);

	const getAssociatedRaffleData = async (
		raffleRaw: ProgramAccount<RaffleDataRaw>,
		raffleMetaData: RaffleMetaData,
		draffleClient: DraffleProgram,
		connection: Connection,
		entrantsDataRaw?: EntrantsDataRaw
	): Promise<Raffle> => {
		const proceedsAccount = await fetchProceedsAccount(
			raffleRaw.publicKey,
			draffleClient,
			connection
		);

		let entrants = new Map<string, Entrant>();
		if (!entrantsDataRaw) {
			try {
				entrantsDataRaw = await draffleClient.account.entrants.fetch(
					raffleRaw.account.entrants
				);
			} catch {
				// TODO: Merge ended raffle data stored off-chain here
				console.log(`Raffle ${raffleRaw.publicKey} entrants account is closed`);

				entrantsDataRaw = {
					entrants: [],
					max: 0,
					total: 0,
				};
			}
		}

		entrants = toEntrantsProcessed(entrantsDataRaw);

		const prizes = await fetchPrizes(
			raffleRaw.publicKey,
			draffleClient,
			raffleRaw.account.totalPrizes
		);

		const endTimestamp = new Date(
			raffleRaw.account.endTimestamp.toNumber() * 1000
		);

		// const endTimestamp = new Date(
		// 	'Saturday, 10 April 2022 8:47:35 PM GMT+05:30'
		// );

		return {
			publicKey: raffleRaw.publicKey,
			metadata: raffleMetaData,
			endTimestamp,
			entrantsCap: entrantsDataRaw.max,
			entrants,
			entrantsRaw: entrantsDataRaw.entrants,
			totalTickets: entrantsDataRaw.total,
			entrantsAccountAddress: raffleRaw.account.entrants,
			randomness: raffleRaw.account.randomness as number[],
			prizes,
			proceeds: {
				address: proceedsAccount.address,
				ticketPrice: raffleRaw.account.ticketPrice,
				mint: proceedsAccount.mintInfo,
			},
			isEnded: endTimestamp < new Date(),
		};
	};

	const fetchAllRaffles = useCallback(
		async (includeEmpty: boolean = false) => {
			setFetching(true);
			let raffleDataRawProgramAccounts: ProgramAccount<RaffleDataRaw>[] = [];
			let entrantsDataRawProgramAccounts: ProgramAccount<EntrantsDataRaw>[] =
				[];
			try {
				[raffleDataRawProgramAccounts, entrantsDataRawProgramAccounts] =
					await getRaffleProgramAccounts(draffleClient);
			} catch (e) {
				console.log(e);
			}

			raffleDataRawProgramAccounts = raffleDataRawProgramAccounts.filter(
				({ publicKey }) => {
					return includeEmpty || RAFFLES_WHITELIST.has(publicKey.toBase58());
				}
			);

			const newRaffles = (
				await Promise.all(
					raffleDataRawProgramAccounts.map(async (raffleRaw) =>
						getAssociatedRaffleData(
							raffleRaw,
							RAFFLES_WHITELIST.get(raffleRaw.publicKey.toString()) || {
								name: 'Unnamed Raffle',
								alternatePurchaseMints: [],
							},
							draffleClient,
							connection,
							entrantsDataRawProgramAccounts.find(({ publicKey }) =>
								publicKey.equals(raffleRaw.account.entrants)
							)?.account
						)
					)
				)
			).reduce<Map<string, Raffle>>((acc, raffle) => {
				acc.set(raffle.publicKey.toString(), raffle);
				return acc;
			}, new Map<string, Raffle>());
			setRaffles(newRaffles);
			setFetching(false);
		},
		[connection, draffleClient]
	);

	const fetchBalance = useCallback(async () => {
		console.log('fetching balance');
		if (publicKey) {
			const tokenAccountAddress = await getATokenAddrFungible(
				connection,
				publicKey,
				new PublicKey(process.env.REACT_APP_TOKEN_MINT!)
			);
			const tokenBalance = tokenAccountAddress
				? await getTokenBalance(connection, tokenAccountAddress, false)
				: 0;
			setBalance(tokenBalance);
		}
	}, [connection, publicKey]);

	const fetchUSDCBalance = useCallback(async () => {
		console.log('fetching usdc balance');
		if (publicKey) {
			const tokenAccountAddress = await getATokenAddrFungible(
				connection,
				publicKey,
				new PublicKey(process.env.REACT_APP_USDC_MINT!)
			);
			const tokenBalance = tokenAccountAddress
				? await getTokenBalance(connection, tokenAccountAddress, false)
				: 0;
			setUsdcBalance(tokenBalance);
		}
	}, [connection, publicKey]);

	const updateRaffleById = useCallback(
		async (raffleId: string) => {
			if (!raffles.has(raffleId.toString()) || !RAFFLES_WHITELIST.has(raffleId))
				return;
			setFetching(true);
			const updatedRaffleRaw = await draffleClient.account.raffle.fetch(
				new PublicKey(raffleId)
			);
			console.log({ updatedRaffleRaw });
			const updatedRaffle = await getAssociatedRaffleData(
				{ publicKey: new PublicKey(raffleId), account: updatedRaffleRaw },
				RAFFLES_WHITELIST.get(raffleId)!,
				draffleClient,
				connection
			);
			console.log({ updatedRaffle });
			if (!areEqualObjects(raffles.get(raffleId.toString()), updatedRaffle)) {
				setRaffles((currentRaffles) => {
					let newRaffles = cloneDeep(currentRaffles);
					newRaffles = newRaffles.set(raffleId, updatedRaffle);
					return newRaffles;
				});
			}
			setFetching(false);
			fetchBalance();
			fetchUSDCBalance();
		},
		[
			connection,
			draffleClient,
			raffles,
			setRaffles,
			fetchBalance,
			fetchUSDCBalance,
		]
	);

	useEffect(() => {
		fetchAllRaffles();
	}, [fetchAllRaffles]);

	useEffect(() => {
		fetchBalance();
		fetchUSDCBalance();
	}, [fetchBalance, fetchUSDCBalance]);

	return (
		<RafflesStoreContext.Provider
			value={{
				raffles,
				fetchAllRaffles,
				updateRaffleById,
				fetching,
				balance,
				usdcBalance,
			}}
		>
			{children}
		</RafflesStoreContext.Provider>
	);
};

export default RafflesStoreProvider;

export const getTokenBalance = async (
	connection,
	pubkey: web3.PublicKey,
	verbose: boolean = true
) => {
	const token = await connection.getTokenAccountBalance(pubkey);
	const tokenAmount = token.value.uiAmount;
	if (verbose) {
		console.log(`${pubkey.toBase58()} has ${tokenAmount} Tokens`);
	}
	return tokenAmount;
};

export const getATokenAddrFungible = async (
	connection: Connection,
	walletKey: PublicKey,
	mint: PublicKey
) => {
	const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
		walletKey,
		{ mint }
	);

	if (tokenAccounts.value.length < 1) {
		return undefined;
	}

	let tokenAccount = null;
	for (var i = 0; i < tokenAccounts.value.length; i++) {
		const clientTokenAccountTokenAmount =
			tokenAccounts.value[i].account.data.parsed.info.tokenAmount.uiAmount;
		console.log('account/tokenAmount:', i, clientTokenAccountTokenAmount);
		if (clientTokenAccountTokenAmount < 0.01) {
			continue;
		}
		tokenAccount = tokenAccounts.value[i];
	}
	if (tokenAccount === null) {
		return undefined;
	}
	return tokenAccount.pubkey;
};
