import React, { createContext, FC, useMemo } from 'react';
import { Program } from '@project-serum/anchor';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { customProviderFactory } from '../lib/anchorUtils';
import { AnchorTypes } from '@saberhq/anchor-contrib';

import { Draffle as DraffleIdl } from '../lib/idl/draffle';
import DraffleJson from '../lib/idl/draffle.json';
import { RAFFLE_PROGRAM_ID } from '../config/programIds';

//@ts-ignore
export const ProgramApisContext = createContext<{
	draffleClient: DraffleProgram;
}>();

export type DraffleTypes = AnchorTypes<
	DraffleIdl,
	{
		raffle: RaffleDataRaw;
		entrants: EntrantsDataRaw;
	}
>;

type DraffleAccounts = DraffleTypes['Accounts'];
export type RaffleDataRaw = DraffleAccounts['raffle'];
export type EntrantsDataRaw = DraffleAccounts['entrants'];
export type DraffleProgram = DraffleTypes['Program'];

const ProgramApisProvider: FC = ({ children }) => {
	const { connection } = useConnection();
	const anchorWallet = useAnchorWallet();

	const { draffleClient } = useMemo(() => {
		const draffleClient = new Program(
			DraffleJson as DraffleIdl,
			RAFFLE_PROGRAM_ID,
			customProviderFactory(connection, anchorWallet)
		) as DraffleProgram;
		return {
			draffleClient,
		};
	}, [connection, anchorWallet]);

	return (
		<ProgramApisContext.Provider value={{ draffleClient }}>
			{children}
		</ProgramApisContext.Provider>
	);
};

export default ProgramApisProvider;
