import { Box, createStyles, makeStyles } from '@material-ui/core';
import { Colors, Fonts } from '../../utils/styles/DefaultTheme';
import React, { useContext } from 'react';

import { CardContext } from '../../context/cardContext';
import HomeTitleContainer from '../home/HomeTitleContainer';
import Layout from '../layout/Layout';
import { Navigate } from 'react-router-dom';
import { RunningRaffle } from '../home/RunningRaffle';

const useStyle = makeStyles((theme) =>
	createStyles({
		container: {
			marginTop: theme.spacing(12),
			width: '100%',
			[theme.breakpoints.down('sm')]: {
				marginTop: theme.spacing(2.5),
			},
		},
		bodyContainer: {
			width: '100%',
			marginTop: theme.spacing(2.5),
		},
		raffleImgContainer: {
			// width: '40%',
			// height: 'fit-content',
			background: Colors.SECONDARY,
			padding: theme.spacing(1.25),
			position: 'relative',
			'& img': {
				width: '100%',
				height: 'auto',
			},
			[theme.breakpoints.down('sm')]: {
				width: '100%',
				margin: 0,
				boxSizing: 'border-box',
			},
		},
		badge: {
			position: 'absolute',
			top: 0,
			left: '6%',
			padding: theme.spacing(0.75, 1.5),
			background:
				'linear-gradient(93.09deg, #FF00C7 -30.79%, #00FFD1 42.53%, #FFF500 118.97%)',
		},
		badgeTitle: {
			fontFamily: Fonts.Bebas,
			fontSize: '1.25rem',
			color: Colors.black,
			textTransform: 'uppercase',
		},
		raffleContentContainer: {
			// width: '60%',
			height: '100%',
			minHeight: '480px',
			background: Colors.SECONDARY,
			[theme.breakpoints.down('sm')]: {
				width: '100%',
				margin: 0,
				boxSizing: 'border-box',
				minHeight: '600px',
			},
			[theme.breakpoints.down('xs')]: {
				minHeight: '600px',
			},
			position: 'relative',
		},
		claimBtn: {
			border: `2px solid ${Colors.black}`,
			background: Colors.SECONDARY,
			fontFamily: Fonts.Bebas,
			fontSize: '1rem',
			color: Colors.black,
			padding: theme.spacing(0.5, 1),
			cursor: 'pointer',
		},
		claimed: {
			background: '#CCFFC9',
			fontFamily: Fonts.Bebas,
			fontSize: '1rem',
			color: '#16C60C',
			padding: theme.spacing(0.5, 1),
			textTransform: 'uppercase',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			border: 0,
			'& svg': {
				marginRight: theme.spacing(0.75),
			},
		},
	})
);

export default function RafflePage() {
	const classes = useStyle();
	const [card] = useContext(CardContext);

	if (card) {
		return (
			<Layout>
				<Box className={classes.container}>
					<HomeTitleContainer />
					<Box className={classes.bodyContainer}>
						<RunningRaffle classes={classes} cardFromProps={card} />
					</Box>
				</Box>
			</Layout>
		);
	} else {
		return <Navigate replace to="/raffle" />;
	}
}
