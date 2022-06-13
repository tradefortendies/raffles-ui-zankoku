import {
	Box,
	Typography,
	createStyles,
	makeStyles,
	useMediaQuery,
	useTheme,
} from '@material-ui/core';
import { Colors, Fonts } from '../../utils/styles/DefaultTheme';
import React, { useContext } from 'react';

import { CardContext } from '../../context/cardContext';
import HomeReward from './HomeReward';
import { useNavigate } from 'react-router-dom';

const useStyle = makeStyles((theme) =>
	createStyles({
		container: {
			width: '100%',
			display: 'flex',
			justifyContent: 'space-between',
			position: 'relative',
			paddingBottom: theme.spacing(1.75),
			'&:after': {
				position: 'absolute',
				bottom: 0,
				left: 0,
				width: '100%',
				content: '""',
				height: '3px',
				background: Colors.SECONDARY,
			},
		},
		homeTitle: {
			fontFamily: Fonts.Bebas,
			fontSize: '1.5rem',
			color: Colors.SECONDARY,
			textTransform: 'uppercase',
			whiteSpace: 'nowrap',
			marginRight: theme.spacing(2.75),
		},
	})
);

interface HomeTitleContainerProps {}

export default function HomeTitleContainer(props: HomeTitleContainerProps) {
	const classes = useStyle();
	const theme = useTheme();
	const [card, setCard] = useContext(CardContext);
	const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const navigate = useNavigate();

	const onClickRaffle = () => {
		navigate('/raffle');
		setCard(null);
	};

	return (
		<Box className={classes.container}>
			<Box display={'flex'} justifyContent="center" alignItems={'flex-end'}>
				<Typography
					onClick={onClickRaffle}
					style={{ cursor: 'pointer' }}
					className={classes.homeTitle}
				>
					Raffles
				</Typography>
				{card && (
					<>
						<Typography className={classes.homeTitle}>{'>'}</Typography>
						<Typography className={classes.homeTitle}>{card.title}</Typography>
					</>
				)}
			</Box>
			{!isMobileScreen && <HomeReward />}
		</Box>
	);
}
