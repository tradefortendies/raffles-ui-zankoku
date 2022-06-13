import {
	Box,
	Grid,
	Typography,
	useMediaQuery,
	useTheme,
} from '@material-ui/core';
import React, { useState } from 'react';

import { Colors } from '../../utils/styles/DefaultTheme';
import RaffleSEctionB from './RaffleSEctionB';
import RaffleSectionA from './RaffleSectionA';
import RaffleSectionC from './RaffleSectionC';

export const RunningRaffle = ({
	classes,
	cardFromProps,
	isTimeEnded = false,
}) => {
	const [isOngoing, setIsOngoing] = useState(true);
	const [isSoldout, setIsSoldout] = useState(false);
	const theme = useTheme();
	const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));

	return (
		<Grid container spacing={isMobileScreen ? 0 : 3}>
			<Grid item md={4} sm={12} xs={12}>
				<Box className={classes.raffleImgContainer}>
					<img src={cardFromProps.image} alt="nft" />
					<Box
						style={{
							background: isOngoing
								? 'linear-gradient(93.09deg, #FF00C7 -30.79%, #00FFD1 42.53%, #FFF500 118.97%)'
								: Colors.SECONDARY,
						}}
						className={classes.badge}
					>
						<Typography
							style={{
								color: isOngoing ? Colors.black : '#FF1111',
							}}
							className={classes.badgeTitle}
						>
							{isOngoing ? 'ongoing RAFFLE' : 'RAFFLE ENDED'}
						</Typography>
					</Box>
				</Box>
			</Grid>
			<Grid item md={8} sm={12} xs={12}>
				<Box className={classes.raffleContentContainer}>
					{/* white area */}
					<RaffleSectionA setIsSoldout={setIsSoldout} card={cardFromProps} />
					{/* grey area */}
					{cardFromProps.time && (
						<RaffleSEctionB
							time={cardFromProps.time}
							ticketPrice={cardFromProps.ticketPrice}
							raffle={cardFromProps.raffle}
							isTimeEnded={isTimeEnded}
							setIsOngoing={setIsOngoing}
							isOngoing={isOngoing}
							isSoldout={isSoldout}
						/>
					)}
					{/* user ticket section */}
					<RaffleSectionC isOngoing={isOngoing} raffle={cardFromProps.raffle} />
				</Box>
			</Grid>
		</Grid>
		// <Box
		// 	width="100%"
		// 	display={'flex'}
		// 	flexDirection={!isMobileScreen ? 'row' : 'column'}
		// >

		// </Box>
	);
};
