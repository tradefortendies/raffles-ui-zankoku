import {
	Box,
	IconButton,
	Typography,
	createStyles,
	makeStyles,
} from '@material-ui/core';
import { Colors, Fonts } from '../../utils/styles/DefaultTheme';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import error from '../../assets/images/error.png';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

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

export default function ErrorModal({ handleClose, content }) {
	const classes = useStyle();

	const onClose = () => {
		handleClose();
	};
	return (
		<Box className={classes.container}>
			<Box width="100%" display="flex" justifyContent={'flex-end'}>
				<IconButton className={classes.icon} onClick={onClose}>
					<FontAwesomeIcon icon={faTimes} />
				</IconButton>
			</Box>
			<ErrorBody content={content} />
		</Box>
	);
}

export const ErrorBody = ({ content }) => {
	const classes = useStyle();
	return (
		<Box width={'100%'} display="flex" border={'3px solid #F8B200'}>
			<Box className={classes.bodyContainer}>
				<Box className={classes.logo}>
					<img src={error} alt="success" />
				</Box>
				<Typography className={classes.title}>ERROR</Typography>
				<Typography className={classes.info}>{content}</Typography>
			</Box>
		</Box>
	);
};
