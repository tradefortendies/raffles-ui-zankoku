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
import hand from '../../assets/images/backhand.svg';
import { useState } from 'react';

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
		userField: {
			width: '100%',
			border: '2px solid rgba(0, 0, 0, 0.8)',
			background: 'rgba(0, 0, 0, 0.1)',
			fontFamily: Fonts.ShareTech,
			fontSize: '1.5rem',
			color: Colors.black,
			padding: theme.spacing(1.25),
			boxSizing: 'border-box',
			marginBottom: theme.spacing(1.25),
		},
	})
);

export default function SubmitModal({
	handleClose,
	transactionOnGoing,
	onSubmit,
}) {
	const classes = useStyle();
	const [userName, setUserName] = useState('');
	// nfts.map((val) => (rewards = rewards + Number.parseFloat(val.reward)));

	const onClickSubmit = async () => {
		await onSubmit(userName);
	};

	const getBodyTitle = () => {
		return (
			<>
				<span>
					<img src={hand} alt="hand" />
				</span>
				<span>Submit discord username</span>
			</>
		);
	};

	const getBodyInfo = () => {
		return (
			<Box width="100%" paddingBottom={2.5}>
				<Box marginBottom={1.5} display={'flex'} width="100%">
					<Typography style={{ opacity: 0.6 }} className={classes.bodyInfo}>
						Include # in username. Example: Peblo#6969
					</Typography>
				</Box>
			</Box>
		);
	};

	const checkValidUserName = () => {
		const regex = new RegExp(/^.*#\d{4}$/);
		if (userName !== '' && regex.test(userName)) {
			return true;
		}

		return false;
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

					<input
						type="text"
						name="userName"
						id="userName"
						className={classes.userField}
						onChange={(e) => setUserName(e.target.value)}
						placeholder="UserName"
					/>
					<Box style={{ opacity: checkValidUserName() ? 1 : 0.6 }}>
						{getBodyInfo()}
						<Box style={{ border: '4px solid black' }} marginBottom={2.5} />
						<button
							onClick={
								transactionOnGoing || !checkValidUserName()
									? undefined
									: onClickSubmit
							}
							className={
								transactionOnGoing ? classes.stakeAnimation : classes.stakeBtn
							}
							style={{
								cursor: transactionOnGoing ? 'default' : 'pointer',
							}}
						>
							{transactionOnGoing ? 'Processing...' : 'SUBMIT'}
						</button>
					</Box>
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
