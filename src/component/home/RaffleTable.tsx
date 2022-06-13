import {
	Box,
	IconButton,
	Modal,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
	createStyles,
	makeStyles,
	useMediaQuery,
	useTheme,
} from '@material-ui/core';
import { Colors, Fonts } from '../../utils/styles/DefaultTheme';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getSubmittedRaffles, submitUserName } from '../../api/submit';

import BuyNowModal from '../modal/BuyNowModal';
import Countdown from 'react-countdown';
import { ReactComponent as DiscordIcon } from '../../assets/images/discord.svg';
import ErrorModal from '../modal/ErrorModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HomeBodyCardType } from './HomeBodyCard';
import { RunningRaffle } from './RunningRaffle.jsx';
import SubmitModal from '../modal/SubmitModal';
import SuccessModal from '../modal/SuccessModal';
import { claimPrize as claimPrizeQuery } from '../../lib/actions/claimPrize';
import { expand } from '../../lib/randomnessTools';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { sleep } from '../../lib/utils';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useProgramApis } from '../../hooks/useProgramApis';
import { useRafflesStore } from '../../hooks/useRafflesStore';

const useStyle = makeStyles((theme) =>
	createStyles({
		raffleImgContainer: {
			width: '40%',
			height: 'fit-content',
			marginRight: theme.spacing(2),
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
		raffleContentContainer: {
			width: '60%',
			background: Colors.SECONDARY,
			[theme.breakpoints.down('sm')]: {
				width: '100%',
			},
		},

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
			marginBottom: theme.spacing(5),
		},
		tableCont: {
			background: '#F0F0F0',
			padding: theme.spacing(2.5),
		},
		tableTitle: {
			fontFamily: Fonts.ShareTech,
			color: Colors.black,
			opacity: 0.4,
			fontSize: '0.875rem',
		},
		tableInfo: {
			fontFamily: Fonts.ShareTech,
			color: Colors.black,
			fontSize: '1rem',
		},
		tableRow: {
			'&:last-child td, &:last-child th': { border: 0 },
		},
		claimBtn: {
			width: '100%',
			padding: theme.spacing(0.5, 1),
			textTransform: 'uppercase',
			border: `1.5px solid ${Colors.black}`,
			fontFamily: Fonts.Bebas,
			fontSize: '1rem',
			color: Colors.black,
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
		tableCellCenter: {
			display: 'flex',
			justifyContent: 'center',
			// alignItems: 'center',
		},
		stepsContainer: {
			width: '100%',
			background: 'rgba(0, 10, 255, 0.1)',
			border: '1px solid rgba(0, 10, 255, 0.4)',
			padding: theme.spacing(1.25),
			marginBottom: theme.spacing(2.5),
			boxSizing: 'border-box',
		},
		stepInfo: {
			fontFamily: Fonts.ShareTech,
			fontSize: '1.125rem',
			color: '#000AFF',
			fontWeight: 400,
		},
		tableTimerCont: {
			width: '100%',
			padding: theme.spacing(1.6, 2.5),
			boxSizing: 'border-box',
			border: '2px solid #000000',
			background: '#F0F0F0',
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		tableTimerInfo: {
			fontFamily: Fonts.ShareTech,
			fontSize: '1.125rem',
			color: Colors.black,
			fontWeight: 400,
		},
		tableTimerVal: {
			fontFamily: Fonts.ShareTech,
			fontSize: '1.375rem',
			color: Colors.black,
			fontWeight: 400,
			display: 'flex',
			'& span': {
				marginRight: '6px',
			},
		},
	})
);

interface RaffleTableProps {
	card: HomeBodyCardType;
	classes: any;
}

interface renderTimeType {
	hours: number;
	days: number;
	minutes: number;
	seconds: number;
	completed: boolean;
}

export default function RaffleTable({
	card: cardFromProps,
	classes: classesFromProp,
}: RaffleTableProps) {
	const classes = useStyle();
	const theme = useTheme();
	const [openModal, setOpenModal] = useState(false);
	const [modalState, setModalState] = useState(0);
	const [error, setError] = useState('');
	const [transactionOnGoing, setTransactionOnGoing] = useState(false);
	const [index, setIndex] = useState(0);
	const [winningTicketState, setWinningTicketState] = useState(0);
	const [submit, setSubmit] = useState(false);
	const [discordUserName, setDiscordUserName] = useState('');
	const [submittedRaffles, setSubmittedRaffles] = useState([]);
	const [isTimerEnded, setIsTimerEnded] = useState(false);

	const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
	const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const { draffleClient } = useProgramApis();

	const { raffles, updateRaffleById } = useRafflesStore();
	const raffle = useMemo(
		() => raffles.get(cardFromProps.raffle.publicKey.toBase58()),
		[cardFromProps, raffles]
	);

	const wallet = useAnchorWallet();
	let walletAddr = null;
	if (wallet && wallet?.publicKey.toString()) {
		walletAddr = wallet?.publicKey.toString();
	}

	const updateCurrentRaffle = useCallback(async () => {
		if (updateRaffleById) await updateRaffleById(raffle.publicKey.toBase58());
	}, [raffle.publicKey, updateRaffleById]);

	const entrant = useMemo(() => {
		if (!draffleClient.provider.wallet.publicKey) return;

		return raffle?.entrants.get(
			draffleClient.provider.wallet.publicKey.toString()
		);
	}, [raffle, draffleClient.provider.wallet.publicKey]); // "Unnecessary" dependency required due to React not picking up change in publicKey subfield

	// Each winning ticket index for each prize
	const winningTickets = useMemo(() => {
		if (!raffle.randomness || !raffle.entrants || raffle.entrants.size === 0)
			return [];
		const secret = raffle.randomness;
		return raffle.prizes.map((_, prizeIndex) => {
			const rand = expand(secret, prizeIndex);
			return rand % raffle.totalTickets;
		});
	}, [raffle]);

	const getRaffles = useCallback(async () => {
		try {
			const MSubmittedRaffles = await getSubmittedRaffles(
				cardFromProps.raffle.publicKey.toString()
			);
			setSubmittedRaffles(MSubmittedRaffles);
		} catch (error) {
			console.log('Something went wrong in fetch raffles', error);
		}
	}, [cardFromProps.raffle.publicKey]);

	const isWalletSubmitted = (wallet) => {
		if (submittedRaffles && submittedRaffles.length > 0) {
			const isSubmitted = submittedRaffles.some((val) => val.wallet === wallet);
			return isSubmitted;
		}
		return false;
	};

	const handleClose = () => {
		setModalState(0);
		setOpenModal(false);
		setSubmit(false);
	};

	const onSubmit = async (userName: string) => {
		//todo
		try {
			setDiscordUserName(userName);
			setTransactionOnGoing(true);
			await submitUserName(
				userName,
				walletAddr,
				cardFromProps.raffle.publicKey.toString()
			);
			setModalState(1);
		} catch (error) {
			let message = 'Something went wrong';
			if (error && error.message) {
				message = `Submission failed: ${error.message}`;
			}
			setError(message);
			setModalState(2);
		} finally {
			setTransactionOnGoing(false);
		}
	};

	const claimPrize = useCallback(async () => {
		try {
			setTransactionOnGoing(true);
			const prizeIndex = index;
			const ticketIndex = winningTicketState;
			await claimPrizeQuery(draffleClient, raffle, prizeIndex, ticketIndex);
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
	}, [draffleClient, raffle, updateCurrentRaffle, index, winningTicketState]);

	const onClickClaimBtn = (i: number, winning: number) => {
		setIndex(i);
		setWinningTicketState(winning);
		setOpenModal(true);
	};

	const onClickSubmitBtn = () => {
		setModalState(3);
		setSubmit(true);
		setOpenModal(true);
	};

	const getModalContent = () => {
		if (modalState === 0) {
			return (
				<BuyNowModal
					handleClose={handleClose}
					transactionOnGoing={transactionOnGoing}
					claim
					claimAction={claimPrize}
					title={cardFromProps.title}
					raffle={raffle}
				/>
			);
		} else if (modalState === 1) {
			return (
				<SuccessModal
					title={cardFromProps.title}
					claim
					submit={submit}
					userName={discordUserName}
					handleClose={handleClose}
				/>
			);
		} else if (modalState === 2) {
			return <ErrorModal handleClose={handleClose} content={error} />;
		} else if (modalState === 3) {
			return (
				<SubmitModal
					handleClose={handleClose}
					transactionOnGoing={transactionOnGoing}
					onSubmit={onSubmit}
				/>
			);
		}
	};

	const getWinnerWalletAddr = (walletAddr) => {
		if (isSmallScreen) {
			const smallWalletAddr = `${walletAddr?.slice(0, 4)}...${walletAddr?.slice(
				-5
			)}`;
			return smallWalletAddr;
		}
		return walletAddr;
	};

	const defaultTableCell = () => (
		<TableCell className={classes.tableCellCenter} align="center">
			-
		</TableCell>
	);

	const getThirdColumn = (data, i, walletAddrFromAPI) => {
		if (cardFromProps?.raffle?.metadata?.claimable) {
			if (data?.amount.toString() === '0') {
				return (
					<TableCell className={classes.tableCellCenter} align="center">
						<button className={classes.claimed}>
							<FontAwesomeIcon icon={faCheck} />
							Claimed!
						</button>
					</TableCell>
				);
			} else if ((entrant?.tickets || []).includes(winningTickets[i])) {
				return (
					<TableCell className={classes.tableCellCenter} align="center">
						<button
							className={classes.claimBtn}
							onClick={() => onClickClaimBtn(i, winningTickets[i])}
						>
							Claim
						</button>
					</TableCell>
				);
			} else {
				return defaultTableCell();
			}
		} else {
			// use the api here
			if (isWalletSubmitted(walletAddrFromAPI)) {
				return (
					<TableCell className={classes.tableCellCenter} align="center">
						<button className={classes.claimed}>
							<FontAwesomeIcon icon={faCheck} />
							Submitted!
						</button>
					</TableCell>
				);
			} else if (walletAddrFromAPI === walletAddr) {
				if (isTimerEnded) {
					return defaultTableCell();
				} else {
					return (
						<TableCell className={classes.tableCellCenter} align="center">
							<button
								className={classes.claimBtn}
								onClick={() => onClickSubmitBtn()}
							>
								Submit
							</button>
						</TableCell>
					);
				}
			} else {
				return defaultTableCell();
			}
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
			setIsTimerEnded(true);
			return (
				<Box display={'flex'}>
					<Box
						style={{
							border: '1px solid #FFCCCC',
							padding: theme.spacing(0.5, 1),
							height: '30px',
						}}
						display="flex"
						justifyContent="center"
						alignItems="center"
					>
						<Typography
							style={{
								fontFamily: Fonts.ShareTech,
								color: '#FF0000',
								fontSize: '0.9rem',
							}}
						>
							ENDED
						</Typography>
					</Box>
				</Box>
			);
		} else {
			return (
				<Typography className={classes.tableTimerVal}>
					{days}
					<span style={{ opacity: 0.6 }}>d</span> {hours}
					<span style={{ opacity: 0.6 }}>h</span> {minutes}
					<span style={{ opacity: 0.6 }}>m</span> {seconds}
					<span style={{ opacity: 0.6 }}>s</span>{' '}
				</Typography>
			);
		}
	};

	useEffect(() => {
		getRaffles();
	}, [getRaffles]);

	return (
		<>
			{raffle?.randomness ? (
				<Box
					width="100%"
					display={'flex'}
					flexDirection={!isMobileScreen ? 'row' : 'column'}
				>
					<Box className={classes.raffleImgContainer}>
						<img src={cardFromProps.image} alt="nft" />
						<Box
							style={{
								background: Colors.SECONDARY,
							}}
							className={classes.badge}
						>
							<Typography
								style={{
									color: '#FF1111',
								}}
								className={classes.badgeTitle}
							>
								{'RAFFLE ENDED'}
							</Typography>
						</Box>
					</Box>
					<Box className={classes.raffleContentContainer}>
						<Box
							style={{
								padding: isMobileScreen ? 0 : theme.spacing(2.5, 5),
								background: Colors.SECONDARY,
							}}
						>
							{isMobileScreen ? (
								<Box
									width="100%"
									style={{ boxSizing: 'border-box' }}
									padding={theme.spacing(2.5, 5)}
								>
									<TableTop cardFromProps={cardFromProps} />
								</Box>
							) : (
								<TableTop cardFromProps={cardFromProps} />
							)}

							{!cardFromProps?.raffle?.metadata?.claimable && (
								<Box className={classes.tableTimerCont}>
									<Typography className={classes.tableTimerInfo}>
										Discord username submission will close in:
									</Typography>
									<Countdown
										date={cardFromProps?.raffle?.metadata?.timer}
										renderer={renderer}
									/>
								</Box>
							)}
							<Box className={classes.tableCont}>
								<Table style={{ width: '100%' }} aria-label="simple table">
									<TableHead>
										<TableRow>
											<TableCell>
												<Typography className={classes.tableTitle}>
													WINNERS
												</Typography>
											</TableCell>
											<TableCell align="center">
												<Typography className={classes.tableTitle}>
													ENTRIES
												</Typography>
											</TableCell>
											<TableCell align="center">
												<Typography className={classes.tableTitle}>
													{cardFromProps?.raffle?.metadata?.claimable
														? 'CLAIM'
														: 'DISCORD ID'}
												</Typography>
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{raffle?.prizes?.map((data, i) => (
											<TableRow key={i} className={classes.tableRow}>
												<TableCell>
													<Typography className={classes.tableInfo}>
														{getWinnerWalletAddr(
															raffle.entrantsRaw[winningTickets[i]].toBase58()
														)}
													</Typography>
												</TableCell>
												<TableCell align="center">
													<Typography className={classes.tableInfo}>
														{
															raffle.entrants.get(
																raffle.entrantsRaw[winningTickets[i]].toString()
															).tickets.length
														}
													</Typography>
												</TableCell>
												{getThirdColumn(
													data,
													i,
													raffle.entrantsRaw[winningTickets[i]].toBase58()
												)}
											</TableRow>
										))}
									</TableBody>
								</Table>
							</Box>
						</Box>
					</Box>
				</Box>
			) : (
				<RunningRaffle
					classes={classesFromProp}
					cardFromProps={cardFromProps}
					isTimeEnded
				/>
			)}
			<Modal
				open={openModal}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				{getModalContent()}
			</Modal>
		</>
	);
}

const TableTop = ({ cardFromProps }) => {
	const classes = useStyle();

	const steps: string[] = [
		'Winners need to submit Discord Username below. Submission will close in 48 hours.',
		'Join respective project’s discord server here.',
		'Chill.. We will send the Usernames, once submission window is closed.',
		'Submit your wallet in their WL wallet submission discord channel.',
	];

	return (
		<>
			<Box
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
			{!cardFromProps?.raffle?.metadata?.claimable ? (
				<Box className={classes.stepsContainer}>
					<Typography
						style={{
							textDecoration: 'underline',
							marginBottom: 16,
						}}
						className={classes.stepInfo}
					>
						STEPS TO CLAIM WL STOP
					</Typography>
					{steps.map((step, i) => (
						<Typography
							style={{ fontSize: '1rem' }}
							className={classes.stepInfo}
						>
							{i + 1}. {step}
						</Typography>
					))}
				</Box>
			) : (
				<Typography className={classes.info}>
					{cardFromProps.description ?? 'Claim your degod!'}
				</Typography>
			)}
		</>
	);
};
