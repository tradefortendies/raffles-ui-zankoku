import {
	Box,
	IconButton,
	Typography,
	createStyles,
	makeStyles,
	useMediaQuery,
	useTheme,
} from '@material-ui/core';
import { Colors, Fonts } from '../../utils/styles/DefaultTheme';
import React, { useEffect, useMemo } from 'react';

import { ReactComponent as DiscordIcon } from '../../assets/images/discord.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HomeBodyCardType } from './HomeBodyCard';
import creck from '../../assets/images/creck.svg';
import entries from '../../assets/images/entries.svg';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { useRafflesStore } from '../../hooks/useRafflesStore';
import wallet from '../../assets/images/wallet.svg';

const useStyle = makeStyles((theme) =>
	createStyles({
		title: {
			fontFamily: Fonts.Bebas,
			fontSize: '2.25rem',
			color: Colors.black,
			[theme.breakpoints.down('sm')]: {
				fontSize: '2rem',
			},
		},
		iconContainer: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			'& svg': {
				width: '32px',
				height: '32px',
				color: Colors.black,
			},
			'& > *': {
				marginRight: theme.spacing(3.5),
				cursor: 'pointer',
			},
			[theme.breakpoints.down('sm')]: {
				'& svg': {
					width: '20px',
					height: '20px',
					color: Colors.black,
				},
				'& > *': {
					marginRight: theme.spacing(1.8),
					cursor: 'pointer',
				},
			},
		},
		info: {
			fontFamily: Fonts.ShareTech,
			fontSize: '0.875rem',
			color: Colors.black,
			opacity: 0.6,
			marginBottom: theme.spacing(2.5),
		},
		displayCont: {
			display: 'flex',
			marginBottom: theme.spacing(1.6),
			paddingBottom: theme.spacing(1),
			position: 'relative',
			'&:after': {
				position: 'absolute',
				content: '""',
				bottom: 0,
				left: 0,
				width: '100%',
				height: '1px',
				background: Colors.black,
				opacity: 0.1,
			},
			'& img': {
				height: '27px',
				width: '27px',
				marginRight: theme.spacing(2),
			},
		},
		displayTitle: {
			fontFamily: Fonts.ShareTech,
			fontSize: '1.125rem',
			color: Colors.black,
		},
	})
);

interface RaffleSectionAProps {
	card: HomeBodyCardType;
	setIsSoldout: (val: boolean) => void;
}

export default function RaffleSectionA({
	card: cardFromProps,
	setIsSoldout,
}: RaffleSectionAProps) {
	const theme = useTheme();
	const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const classes = useStyle();
	const { raffles } = useRafflesStore();
	const raffle = useMemo(
		() => raffles.get(cardFromProps.raffle.publicKey.toBase58()),
		[cardFromProps, raffles]
	);

	// console.log({ prizes: raffle?.prizes?.map((x) => x.address.toBase58()) });

	useEffect(() => {
		if (raffle.totalTickets === cardFromProps.total) {
			setIsSoldout(true);
		}
	}, [cardFromProps.total, raffle?.totalTickets, setIsSoldout]);

	return (
		<Box
			style={{
				padding: isMobileScreen ? theme.spacing(2.5) : theme.spacing(2.5, 5),
				background: Colors.SECONDARY,
			}}
		>
			{/* title */}
			<Box
				width="100%"
				display={'flex'}
				justifyContent="space-between"
				alignItems={'center'}
				marginBottom={0.5}
			>
				<Box>
					<Typography className={classes.title}>
						{cardFromProps.title}
					</Typography>
				</Box>
				<Box className={classes.iconContainer}>
					<IconButton
						href={cardFromProps?.raffle?.metadata?.discord}
						target="_blank"
						rel="noopener noreferrer"
					>
						<DiscordIcon />
					</IconButton>
					<IconButton
						href={cardFromProps?.raffle?.metadata?.twitter}
						target="_blank"
						rel="noopener noreferrer"
						style={{ margin: 0 }}
					>
						<FontAwesomeIcon icon={faTwitter} />
					</IconButton>
				</Box>
			</Box>
			{/* info */}
			<Typography className={classes.info}>
				{cardFromProps.description ??
					'Winner will recieve this degod! Good lucK!'}
			</Typography>
			{/* display */}
			<Box className={classes.displayCont}>
				<img src={entries} alt="entries" />
				<Typography className={classes.displayTitle}>
					<span style={{ opacity: 0.6 }}>Entries : </span>
					{raffle.totalTickets}/{cardFromProps.total}
				</Typography>
			</Box>
			<Box className={classes.displayCont}>
				<img src={wallet} alt="wallet" />
				<Typography className={classes.displayTitle}>
					<span style={{ opacity: 0.6 }}>Unique wallets: </span>
					{raffle.entrants.size}
				</Typography>
			</Box>
			<Box className={classes.displayCont}>
				<img src={creck} alt="creck" />
				<Typography className={classes.displayTitle}>
					<span style={{ opacity: 0.6 }}>
						{raffle.proceeds.mint.symbol}{' '}
						{raffle?.proceeds?.mint?.symbol === '$CRECK' ||
						raffle?.proceeds?.mint?.symbol === '$TCRECK'
							? 'burned'
							: 'collected'}
						:{' '}
					</span>
					{(raffle.totalTickets * raffle.proceeds.ticketPrice.toNumber()) /
						10 ** raffle.proceeds.mint.decimals}
				</Typography>
			</Box>
		</Box>
	);
}
