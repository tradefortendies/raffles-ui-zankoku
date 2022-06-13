import {
	Box,
	IconButton,
	Typography,
	createStyles,
	makeStyles,
} from '@material-ui/core';
import { Colors, Fonts } from '../../utils/styles/DefaultTheme';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import success from '../../assets/images/success.png';

const useStyle = makeStyles((theme) =>
	createStyles({
		container: {
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			width: 420,
			background: 'transparent',
		},
		icon: {
			'& svg': {
				color: Colors.SECONDARY,
			},
		},
		bodyContainer: {
			background: Colors.SECONDARY,
			padding: theme.spacing(5),
			width: '100%',
		},
		logo: {
			height: '40px',
			width: '40px',
			'& img': {
				height: '100%',
				width: '100%',
			},
		},
		title: {
			fontFamily: Fonts.Bebas,
			color: Colors.Background,
			fontSize: '2.3rem',
			textTransform: 'uppercase',
			letterSpacing: '-0.011em',
		},
		info: {
			fontFamily: Fonts.ShareTech,
			fontSize: '1.3rem',
			color: Colors.Background,
			opacity: 0.4,
			letterSpacing: '-0.011em',
		},
	})
);

export default function SuccessModal({
	handleClose,
	tickets = 1,
	claim = false,
	title = '',
	submit = false,
	userName = '',
}) {
	const classes = useStyle();

	const onClose = () => {
		handleClose();
	};

	const getContent = () => {
		if (submit) {
			return (
				<>
					<span style={{ opacity: 0.4, display: 'block' }}>{userName}</span>
					<span style={{ marginLeft: '4px' }}>SUBMITTED!</span>
				</>
			);
		} else if (claim) {
			return (
				<>
					<span style={{ opacity: 0.4 }}>{title}</span>
					<span style={{ marginLeft: '4px' }}>CLAIMED!</span>
				</>
			);
		} else {
			return (
				<>
					<span style={{ opacity: 0.4 }}>{tickets} Tickets</span>
					<span style={{ marginLeft: '4px' }}>BOUGHT!</span>
				</>
			);
		}
	};

	const getBody = () => {
		if (submit) {
			return (
				<>
					<span>
						You’ve successfully submitted discord username! And don’t forget to
						read claim process instructions.
					</span>
				</>
			);
		} else {
			return (
				<>
					<span>You’ve successfully entered the raffle! good luck!</span>
				</>
			);
		}
	};

	return (
		<Box className={classes.container}>
			<Box width="100%" display="flex" justifyContent={'flex-end'}>
				<IconButton className={classes.icon} onClick={onClose}>
					<FontAwesomeIcon icon={faTimes} />
				</IconButton>
			</Box>
			<Box width={'100%'} display="flex" border={'3px solid #16C60C'}>
				<Box className={classes.bodyContainer}>
					<Box className={classes.logo}>
						<img src={success} alt="success" />
					</Box>
					<Typography
						style={{ display: submit ? 'block' : 'flex' }}
						className={classes.title}
					>
						{getContent()}
					</Typography>
					<Typography className={classes.info}>{getBody()}</Typography>
				</Box>
			</Box>
		</Box>
	);
}
