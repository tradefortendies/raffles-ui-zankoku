import {
	Box,
	Typography,
	createStyles,
	makeStyles,
	useTheme,
} from '@material-ui/core';
import { Colors, Fonts } from '../../utils/styles/DefaultTheme';
import React, { useMemo } from 'react';

import { Raffle } from '../../lib/types';
import { useRafflesStore } from '../../hooks/useRafflesStore';
import { useWallet } from '@solana/wallet-adapter-react';

const useStyle = makeStyles((theme) =>
	createStyles({
		userInfo: {
			fontFamily: Fonts.ShareTech,
			fontSize: '1.25rem',
			color: Colors.SECONDARY,
		},
	})
);

interface RaffleSectionCProps {
	raffle: Raffle;
	isOngoing: boolean;
}

export default function RaffleSectionC({
	raffle: initialRaffle,
	isOngoing,
}: RaffleSectionCProps) {
	const theme = useTheme();
	const classes = useStyle();
	const { publicKey } = useWallet();

	const { raffles } = useRafflesStore();
	const raffle = useMemo(
		() => raffles.get(initialRaffle.publicKey.toBase58()),
		[initialRaffle, raffles]
	);

	return (
		<>
			{raffle.entrants?.get(publicKey?.toBase58())?.tickets &&
				raffle.entrants?.get(publicKey?.toBase58())?.tickets.length > 0 &&
				isOngoing && (
					<Box
						display={'flex'}
						alignItems={'center'}
						position="absolute"
						left={0}
						width="100%"
						bottom="-73px"
						style={{
							background: '#0B0B0B',
							border: '2px solid #FFFFFF',
							padding: theme.spacing(2.5, 5),
							boxSizing: 'border-box',
						}}
					>
						<Typography className={classes.userInfo}>
							<span style={{ opacity: 0.6 }}>You already have</span>{' '}
							{raffle.entrants?.get(publicKey?.toBase58())?.tickets?.length ||
								0}{' '}
							ticket(s)!
						</Typography>
					</Box>
				)}
		</>
	);
}
