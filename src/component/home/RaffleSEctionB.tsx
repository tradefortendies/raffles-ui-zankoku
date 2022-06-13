import {
	Box,
	Modal,
	Typography,
	createStyles,
	makeStyles,
	useMediaQuery,
	useTheme,
} from '@material-ui/core';
import { Colors, Fonts, Transition } from '../../utils/styles/DefaultTheme';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import BuyNowModal from '../modal/BuyNowModal';
import Countdown from 'react-countdown';
import ErrorModal from '../modal/ErrorModal';
import { Raffle } from '../../lib/types';
import SuccessModal from '../modal/SuccessModal';
import { WalletMultiButton } from '@solana/wallet-adapter-material-ui';
import { buyTickets } from '../../lib/actions/buyTickets';
import { sleep } from '../../lib/utils';
import styled from 'styled-components';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useProgramApis } from '../../hooks/useProgramApis';
import { useRafflesStore } from '../../hooks/useRafflesStore';

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
		greyArea: {
			background: '#F5F5F5',
			padding: theme.spacing(2.5, 5),
			position: 'absolute',
			boxSizing: 'border-box',
			bottom: 0,
			width: '100%',
			[theme.breakpoints.down('sm')]: {
				padding: theme.spacing(2.5),
			},
		},
		greyCont: {
			display: 'flex',
			width: '100%',
			justifyContent: 'space-between',
			position: 'relative',
			paddingBottom: theme.spacing(1.25),
			marginBottom: theme.spacing(2.5),
			'&:after': {
				position: 'absolute',
				content: '""',
				width: '100%',
				height: '3px',
				background: Colors.black,
				bottom: 0,
				left: 0,
			},
			[theme.breakpoints.down('sm')]: {
				flexDirection: 'column',
			},
		},
		sectionInfo: {
			fontFamily: Fonts.ShareTech,
			fontSize: '1.125rem',
			color: Colors.black,
			opacity: 0.6,
			marginBottom: theme.spacing(0.75),
		},
		sectionValue: {
			fontFamily: Fonts.ShareTech,
			fontSize: '1.375rem',
			color: Colors.black,
		},
		actionBox: {
			border: '1px solid rgba(0, 0, 0, 0.6)',
			marginRight: theme.spacing(0.25),
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			padding: theme.spacing(1),
			flex: 1,
			position: 'relative',

			'&:hover': {
				background: '#E9E9E9',
			},

			'& input': {
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				border: 0,
				outline: 0,
				fontFamily: Fonts.Bebas,
				fontSize: '1.75rem',
				fontWeight: 400,
				color: Colors.black,
				background: 'transparent',
				textAlign: 'center',
			},
		},
		actionInfo: {
			fontFamily: Fonts.Bebas,
			fontSize: '1.75rem',
			fontWeight: 400,
			color: Colors.black,
		},
		buyBtn: {
			width: '100%',
			height: '100%',
			border: 0,
			background:
				'linear-gradient(93.09deg, #FF00C7 -30.79%, #00FFD1 42.53%, #FFF500 118.97%)',
			color: Colors.black,
			fontFamily: Fonts.Bebas,
			fontSize: '1.75rem',
			fontWeight: 400,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			cursor: 'pointer',
		},
		drawInfo: {
			fontFamily: Fonts.ShareTech,
			fontSize: '1.125rem',
			color: Colors.black,
			textTransform: 'uppercase',
			marginBottom: theme.spacing(1),
		},
		drawAnimationBtn: {
			transition: Transition.Default,
			animation: 'gradient 5s ease infinite',
			backgroundSize: '400% 400%',
			height: '58px',
			cursor: 'default !important',
		},
	})
);

const ConnectButton = styled(WalletMultiButton)`
	width: 100%;
	height: 100%;
	border: 0;
	border-radius: 0;
	box-shadow: 0;
	background: linear-gradient(
		93.09deg,
		#ff00c7 -30.79%,
		#00ffd1 42.53%,
		#fff500 118.97%
	);
	color: ${Colors.black};
	font-family: ${Fonts.Bebas};
	font-size: 1.75rem;
	font-weight: 400;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
`;

interface renderTimeType {
	hours: number;
	days: number;
	minutes: number;
	seconds: number;
	completed: boolean;
}

interface RaffleSEctionBProps {
	time: number | string;
	ticketPrice: number;
	raffle: Raffle;
	isTimeEnded?: boolean;
	isSoldout?: boolean;
	setIsOngoing?: (val: boolean) => void;
}

export default function RaffleSEctionB({
	time,
	ticketPrice,
	raffle: initialRaffle,
	isTimeEnded,
	isSoldout,
	setIsOngoing,
}: RaffleSEctionBProps) {
	const classes = useStyle();
	const [ticket, setTicket] = useState(1);
	const [openModal, setOpenModal] = useState(false);
	const [modalState, setModalState] = useState(0);
	const [error, setError] = useState('');
	const [transactionOnGoing, setTransactionOnGoing] = useState(false);
	const { updateRaffleById, raffles } = useRafflesStore();
	const theme = useTheme();
	const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));

	const wallet = useAnchorWallet();
	let walletAddr = null;
	if (wallet && wallet?.publicKey.toString()) {
		walletAddr = wallet?.publicKey.toString();
		walletAddr = `${walletAddr?.slice(0, 4)}...${walletAddr?.slice(-5)}`;
	}

	const raffle = useMemo(
		() => raffles.get(initialRaffle.publicKey.toBase58()),
		[initialRaffle, raffles]
	);

	const handleClose = () => {
		if (modalState === 1) {
			setTicket(1);
		}
		setModalState(0);
		setOpenModal(false);
	};

	const updateCurrentRaffle = useCallback(async () => {
		if (updateRaffleById) await updateRaffleById(raffle.publicKey.toBase58());
	}, [raffle.publicKey, updateRaffleById]);

	const onClickAction = (sign: string) => {
		if (sign === '-') {
			if (ticket > 1) {
				setTicket(ticket - 1);
			}
		} else if (sign === '+') {
			setTicket(ticket + 1);
		}
	};

	const onChangeNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!isNaN(parseInt(e.target.value))) {
			setTicket(parseInt(e.target.value));
		}
	};

	const { draffleClient } = useProgramApis();

	const onClickBuyTickets = () => {
		setOpenModal(true);
	};

	const onBuyTickets = useCallback(async () => {
		try {
			console.log({ ticket });
			setTransactionOnGoing(true);
			await buyTickets(draffleClient, raffle, ticket);
			setModalState(1);
			await sleep(500);
			updateCurrentRaffle();
		} catch (error: any) {
			let message = 'Something went wrong';
			if (error && error.message) {
				message = `Transaction failed: ${error.message}`;
			}
			setError(message);
			setModalState(2);
		} finally {
			setTransactionOnGoing(false);
		}
	}, [draffleClient, raffle, ticket, updateCurrentRaffle]);

	const getModalContent = () => {
		if (modalState === 0) {
			return (
				<BuyNowModal
					handleClose={handleClose}
					transactionOnGoing={transactionOnGoing}
					onClickBuyTickets={onBuyTickets}
					tickets={ticket}
					ticketPrice={ticketPrice}
					raffle={raffle}
				/>
			);
		} else if (modalState === 1) {
			return <SuccessModal handleClose={handleClose} tickets={ticket} />;
		} else if (modalState === 2) {
			return <ErrorModal handleClose={handleClose} content={error} />;
		}
	};

	const renderer = ({
		days,
		hours,
		minutes,
		seconds,
		completed,
	}: renderTimeType) => {
		if (completed) {
			setIsOngoing(false);
			return <Ended />;
		} else {
			return (
				<Typography className={classes.sectionValue}>
					{days}
					<span style={{ opacity: 0.6 }}>d </span>
					{hours}
					<span style={{ opacity: 0.6 }}>h </span>
					{minutes}
					<span style={{ opacity: 0.6 }}>m </span>
					{seconds}
					<span style={{ opacity: 0.6 }}>s </span>
				</Typography>
			);
		}
	};

	const getCTA = () => {
		if (isTimeEnded) {
			return (
				<>
					<Typography className={classes.drawInfo}>
						WINNERS WILL BE ANNOUNCED SOON:
					</Typography>
					<button className={`${classes.buyBtn} ${classes.drawAnimationBtn}`}>
						DRAWING WINNER(S)...
					</button>
				</>
			);
		} else if (isSoldout) {
			return (
				<>
					<Typography className={classes.drawInfo}>
						WINNERS WILL BE ANNOUNCED SOON:
					</Typography>
					<button
						style={{
							background: '#D3D3D3',
						}}
						className={`${classes.buyBtn}`}
					>
						SOLD OUT!!
					</button>
				</>
			);
		} else {
			if (!walletAddr) {
				return <ConnectButton>CONNECT WALLET</ConnectButton>;
			} else {
				return (
					<button className={classes.buyBtn} onClick={onClickBuyTickets}>
						BUY TICKETS
					</button>
				);
			}
		}
	};

	useEffect(() => {
		if (isTimeEnded) {
			setIsOngoing(false);
		}
	}, [isTimeEnded, setIsOngoing]);

	return (
		<Box className={classes.greyArea}>
			<Box className={classes.greyCont}>
				{isMobileScreen ? (
					<>
						<Box
							width="100%"
							display={'flex'}
							justifyContent="space-between"
							alignItems={'center'}
							style={{
								borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
							}}
							paddingBottom={1.25}
							marginBottom={1.25}
						>
							<Typography className={classes.sectionInfo}>Price</Typography>
							<Typography className={classes.sectionValue}>
								{ticketPrice} {raffle.proceeds.mint.symbol}{' '}
								<span style={{ opacity: 0.6 }}>per ticket</span>
							</Typography>
						</Box>
						<Box
							width="100%"
							display={'flex'}
							justifyContent="space-between"
							alignItems={'center'}
							marginBottom={1.25}
						>
							<Typography className={classes.sectionInfo}>Ends in:</Typography>
							{isTimeEnded ? (
								<Ended />
							) : (
								<Countdown date={time} renderer={renderer} />
							)}
						</Box>
					</>
				) : (
					<>
						<Box
							style={{
								borderRight: '1px solid rgba(0, 0, 0, 0.1)',
							}}
							flex={1}
							marginRight={2.5}
						>
							<Typography className={classes.sectionInfo}>Price</Typography>
							<Typography className={classes.sectionValue}>
								{ticketPrice} {raffle.proceeds.mint.symbol}{' '}
								<span style={{ opacity: 0.6 }}>per ticket</span>
							</Typography>
						</Box>
						<Box flex={1}>
							<Typography className={classes.sectionInfo}>Ends in:</Typography>
							{isTimeEnded ? (
								<Ended />
							) : (
								<Countdown date={time} renderer={renderer} />
							)}
						</Box>
					</>
				)}
			</Box>
			{/* ticket section */}
			<Box>
				{!isTimeEnded && !isMobileScreen && !isSoldout && (
					<Typography className={classes.sectionInfo}>
						Number of tickets:
					</Typography>
				)}
				<Box
					width="100%"
					display={'flex'}
					flexDirection={
						isTimeEnded || isMobileScreen || isSoldout ? 'column' : 'row'
					}
					justifyContent={isMobileScreen ? 'space-between' : 'flex-start'}
				>
					{isMobileScreen && !isTimeEnded && !isSoldout && (
						<Box display="flex">
							<Box width="50%" display="flex" alignItems={'center'}>
								<Typography className={classes.sectionInfo}>
									Number of tickets:
								</Typography>
							</Box>
							<Box width={isMobileScreen ? '50%' : '30%'} display={'flex'}>
								<Box
									onClick={() => onClickAction('-')}
									style={{ cursor: 'pointer' }}
									className={classes.actionBox}
								>
									<Typography className={classes.actionInfo}>-</Typography>
								</Box>
								<Box className={classes.actionBox}>
									<input
										onChange={onChangeNumber}
										type="text"
										name="number"
										value={ticket}
									/>
								</Box>
								<Box
									onClick={() => onClickAction('+')}
									style={{ cursor: 'pointer' }}
									className={classes.actionBox}
								>
									<Typography className={classes.actionInfo}>+</Typography>
								</Box>
							</Box>
						</Box>
					)}
					{!isTimeEnded && !isMobileScreen && !isSoldout && (
						<Box width={isMobileScreen ? '50%' : '30%'} display={'flex'}>
							<Box
								onClick={() => onClickAction('-')}
								style={{ cursor: 'pointer' }}
								className={classes.actionBox}
							>
								<Typography className={classes.actionInfo}>-</Typography>
							</Box>
							<Box className={classes.actionBox}>
								<input
									onChange={onChangeNumber}
									type="text"
									name="number"
									value={ticket}
								/>
							</Box>
							<Box
								onClick={() => onClickAction('+')}
								style={{ cursor: 'pointer' }}
								className={classes.actionBox}
							>
								<Typography className={classes.actionInfo}>+</Typography>
							</Box>
						</Box>
					)}
					<Box
						marginTop={isMobileScreen ? 1 : 0}
						width={isTimeEnded || isMobileScreen || isSoldout ? '100%' : '70%'}
					>
						{getCTA()}
					</Box>
				</Box>
			</Box>
			<Modal
				open={openModal}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				{getModalContent()}
			</Modal>
		</Box>
	);
}

const Ended = () => {
	return (
		<Box display={'flex'}>
			<Typography
				style={{
					fontFamily: Fonts.ShareTech,
					color: '#FF0000',
					fontSize: '1.3rem',
				}}
			>
				ENDED
			</Typography>
		</Box>
	);
};
