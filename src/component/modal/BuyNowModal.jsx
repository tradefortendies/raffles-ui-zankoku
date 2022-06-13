import {
	Box,
	IconButton,
	Typography,
	createStyles,
	makeStyles,
} from '@material-ui/core';
import { Colors, Fonts, Transition } from '../../utils/styles/DefaultTheme';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import entries from '../../assets/images/entries.svg';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import fire from '../../assets/images/fire.svg';

const useStyle = makeStyles((theme) =>
	createStyles({
		'@global': {
			'@keyframes gradient': {
				'0%': {
					backgroundPosition: '0% 50%',
				},
				'50%': {
					backgroundPosition: '100% 50%',
				},
				'100%': {
					backgroundPosition: '0% 50%',
				},
			},
		},
		container: {
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			width: 420,
			background: 'transparent',
		},
		title: {
			fontFamily: Fonts.Bebas,
			fontSize: '2.25rem',
			color: Colors.SECONDARY,
			textTransform: 'uppercase',
		},
		icon: {
			'& svg': {
				color: Colors.SECONDARY,
			},
		},
		bodyContainer: {
			width: '100%',
			background: Colors.SECONDARY,
			padding: theme.spacing(5, 2.5, 0.125, 2.5),
			overflow: 'scroll',
		},
		bodyTitle: {
			fontFamily: Fonts.Bebas,
			fontSize: '2.25rem',
			color: Colors.Background,
			textTransform: 'uppercase',
			marginBottom: theme.spacing(5),
			display: 'flex',
			alignItems: 'center',
			'& img': {
				width: '68px',
				height: '68px',
				marginRight: theme.spacing(3.75),
			},
		},
		bodyInfo: {
			fontFamily: Fonts.ShareTech,
			fontSize: '1.5rem',
			color: Colors.black,
		},
		info: {
			fontFamily: Fonts.Bebas,
			fontSize: '1.5rem',
			color: Colors.Background,
			whiteSpace: 'nowrap',
			opacity: 0.4,
		},
		stakeBtn: {
			width: '100%',
			padding: theme.spacing(1.2),
			background:
				'linear-gradient(93.09deg, #FF00C7 -30.79%, #00FFD1 42.53%, #FFF500 118.97%)',
			fontFamily: Fonts.Bebas,
			color: Colors.Background,
			fontSize: '2rem',
			textTransform: 'uppercase',
			border: 0,
			cursor: 'pointer',
		},
		stakeAnimation: {
			width: '100%',
			padding: theme.spacing(1.2),
			background:
				'linear-gradient(93.09deg, #FF00C7 -30.79%, #00FFD1 42.53%, #FFF500 118.97%)',
			fontFamily: Fonts.Bebas,
			color: Colors.Background,
			fontSize: '2rem',
			textTransform: 'uppercase',
			border: 0,
			cursor: 'pointer',
			transition: Transition.Default,
			animation: 'gradient 5s ease infinite',
			backgroundSize: '400% 400%',
		},
	})
);

export default function BuyNowModal({
	handleClose,
	transactionOnGoing,
	onClickBuyTickets = () => {},
	claimAction = () => {},
	tickets = 1,
	ticketPrice = 1,
	claim = false,
	title = '',
	raffle,
}) {
	const classes = useStyle();
	// nfts.map((val) => (rewards = rewards + Number.parseFloat(val.reward)));
	const onClickBuy = async () => {
		// call action from props
		await onClickBuyTickets();
	};

	const onClickClaim = async () => {
		await claimAction();
	};

	const getBodyTitle = () => {
		if (claim) {
			return (
				<>
					<span>
						<img src={fire} alt="fire" />
					</span>
					<span>claim it u lucky cet!!!</span>
				</>
			);
		} else {
			return (
				<>
					<span>
						<img src={entries} alt="entries" />
					</span>
					<span>buy raffle tickets</span>
				</>
			);
		}
	};

	const getBodyInfo = () => {
		if (claim) {
			return (
				<Box width="100%" paddingBottom={2.5}>
					<Box
						marginBottom={1.5}
						display={'flex'}
						width="100%"
						justifyContent={'space-between'}
					>
						<Typography style={{ opacity: 0.6 }} className={classes.bodyInfo}>
							Item:
						</Typography>
						<Typography className={classes.bodyInfo}>{title}</Typography>
					</Box>
				</Box>
			);
		} else {
			return (
				<Box width="100%" paddingBottom={2.5}>
					<Box
						marginBottom={1.5}
						display={'flex'}
						width="100%"
						justifyContent={'space-between'}
					>
						<Typography style={{ opacity: 0.6 }} className={classes.bodyInfo}>
							Number of tickets:
						</Typography>
						<Typography className={classes.bodyInfo}>{tickets}</Typography>
					</Box>
					<Box width="100%" display="flex" justifyContent={'space-between'}>
						<Typography style={{ opacity: 0.6 }} className={classes.bodyInfo}>
							Total Price:
						</Typography>
						<Typography className={classes.bodyInfo}>
							{ticketPrice * tickets} {raffle.proceeds.mint.symbol}
						</Typography>
					</Box>
				</Box>
			);
		}
	};

	return (
		<Box className={classes.container}>
			<Box width={'100%'} display="flex" justifyContent={'flex-end'}>
				{!transactionOnGoing ? (
					<IconButton
						className={classes.icon}
						onClick={!transactionOnGoing ? handleClose : undefined}
					>
						<FontAwesomeIcon icon={faTimes} />
					</IconButton>
				) : null}
			</Box>
			<Box width={'100%'} display="flex">
				<Box className={classes.bodyContainer}>
					<Typography className={classes.bodyTitle}>
						{getBodyTitle()}
					</Typography>
					{getBodyInfo()}
					<Box style={{ border: '4px solid black' }} marginBottom={2.5} />
					{claim ? (
						<button
							onClick={transactionOnGoing ? undefined : onClickClaim}
							className={
								transactionOnGoing ? classes.stakeAnimation : classes.stakeBtn
							}
							style={{
								cursor: transactionOnGoing ? 'default' : 'pointer',
							}}
						>
							{transactionOnGoing ? 'Processing...' : 'claim claim claimm!'}
						</button>
					) : (
						<button
							onClick={transactionOnGoing ? undefined : onClickBuy}
							className={
								transactionOnGoing ? classes.stakeAnimation : classes.stakeBtn
							}
							style={{
								cursor: transactionOnGoing ? 'default' : 'pointer',
							}}
						>
							{transactionOnGoing ? 'Processing...' : 'BUY NOW!'}
						</button>
					)}
					{transactionOnGoing && (
						<Typography
							style={{
								marginTop: 1.75,
								marginBottom: 0,
								fontSize: '1.125rem',
								fontFamily: Fonts.ShareTech,
								color: 'black',
							}}
						>
							NOTE:{' '}
							<span style={{ opacity: 0.6 }}>
								Popup can't be closed until the txn has been processed. This
								might take a few seconds so chill out and DO NOT REFRESH!!!
							</span>
						</Typography>
					)}
				</Box>
			</Box>
		</Box>
	);
}
