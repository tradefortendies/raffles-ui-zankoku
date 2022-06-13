import {
	Box,
	Typography,
	createStyles,
	makeStyles,
	useMediaQuery,
	useTheme,
} from '@material-ui/core';
import { Colors, Fonts } from '../../utils/styles/DefaultTheme';

import React from 'react';
import { useRafflesStore } from '../../hooks/useRafflesStore';

const useStyle = makeStyles((theme) =>
	createStyles({
		lockTitle: {
			fontFamily: Fonts.ShareTechMono,
			color: '#FF0000',
			margin: theme.spacing(0, 1.2),
		},
		lockInfo: {
			fontFamily: Fonts.Bebas,
			fontSize: '1.25rem',
			color: '#FF0000',
			[theme.breakpoints.down('md')]: {
				fontSize: '1.1rem',
			},
		},
		claimRewardsCont: {
			display: 'flex',
			'& .grad-border': {
				border: '3px solid',
				borderImageSlice: 1,
				borderWidth: '3px',
				borderImageSource:
					'linear-gradient(93.09deg, #FF00C7 -30.79%, #00FFD1 42.53%, #FFF500 118.97%)',
				background: '#3F3F3F',
			},
			[theme.breakpoints.down('md')]: {
				// width: 'fit-content',
				margin: 0,
			},
		},
		claimTitle: {
			fontFamily: Fonts.ShareTech,
			fontSize: '1.25rem',
			color: Colors.SECONDARY,
			[theme.breakpoints.down('md')]: {
				fontSize: '1rem',
				whiteSpace: 'nowrap',
			},
		},
		claimHero: {
			fontFamily: Fonts.Bebas,
			color: Colors.Background,
			fontSize: '1.5rem',
			[theme.breakpoints.down('md')]: {
				fontSize: '1.2rem',
			},
		},
		claimGrad: {
			background:
				'linear-gradient(93.09deg, #FF00C7 -30.79%, #00FFD1 42.53%, #FFF500 118.97%)',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		},
		infoCont: {
			background: '#3F3F3F',
			padding: theme.spacing(1.5),
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			cursor: 'pointer',
			'& svg': {
				height: '20px',
				width: '20px',
				fontSize: '20px',
				opacity: 0.6,
			},
		},
		infoTitle: {
			fontFamily: Fonts.ShareTech,
			color: Colors.SECONDARY,
			fontSize: '1.25rem',
			marginLeft: theme.spacing(1),
			opacity: 0.6,
		},
	})
);

interface StakeRewardProps {}

export default function HomeReward(props: StakeRewardProps) {
	const classes = useStyle();
	const theme = useTheme();
	const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
	const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const { balance, usdcBalance } = useRafflesStore();
	const getWidth = () => {
		if (isLargeScreen) {
			return 'fit-content';
		} else if (isMobileScreen) {
			return '100%';
		}
		return 'fit-content';
	};

	console.log({ balance });

	return (
		<Box
			position={'relative'}
			top="-8px"
			right={0}
			display="flex"
			width={getWidth()}
			marginBottom={0}
			justifyContent={'flex-end'}
		>
			<Box width={getWidth()} className={classes.claimRewardsCont}>
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					style={{ background: '#3F3F3F' }}
					padding={1.5}
					width={isLargeScreen ? 'fit-content' : '50%'}
				>
					<Typography className={classes.claimTitle}>Balance : </Typography>
				</Box>
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					padding={isLargeScreen ? 1.5 : 1}
					className="grad-border"
					width={isLargeScreen ? 'fit-content' : '50%'}
				>
					<Typography
						style={{ color: Colors.SECONDARY, display: 'flex' }}
						className={classes.lockInfo}
					>
						${balance.toFixed(4)}{' '}
						<span
							style={{
								opacity: 0.6,
								display: 'inline-block',
								marginRight: '4%',
								marginLeft: '4%',
							}}
						>
							CRECK
						</span>
					</Typography>
				</Box>
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					padding={isLargeScreen ? 1.5 : 1}
					className="grad-border"
					width={isLargeScreen ? 'fit-content' : '50%'}
				>
					<Typography
						style={{ color: Colors.SECONDARY, display: 'flex' }}
						className={classes.lockInfo}
					>
						${usdcBalance.toFixed(4)}{' '}
						<span
							style={{
								opacity: 0.6,
								display: 'inline-block',
								marginRight: '4%',
								marginLeft: '4%',
							}}
						>
							USDC
						</span>
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}
