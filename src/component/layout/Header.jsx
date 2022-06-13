import {
	Box,
	createStyles,
	makeStyles,
} from '@material-ui/core';
import { Colors, Fonts } from '../../utils/styles/DefaultTheme';

import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-material-ui';
import styled from 'styled-components';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useNavigate } from 'react-router-dom';

const useStyle = makeStyles((theme) =>
	createStyles({
		container: {
			width: '100%',
			// border: "1px solid yellow",
			display: 'flex',
			justifyContent: 'space-between',
			position: 'relative',
		},
		centerContainer: {
			position: 'absolute',
			top: 0,
			left: '45%',
			height: '100%',
			transform: 'translateX(-50%)',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		},
		tabTitle: {
			fontFamily: Fonts.Bebas,
			fontSize: '1.75rem',
			color: Colors.SECONDARY,
			whiteSpace: 'nowrap',
			textTransform: 'uppercase',
			marginRight: theme.spacing(5),
			position: 'relative',
			paddingBottom: theme.spacing(1),
			cursor: 'pointer',
		},
		tabTitleWithUnderline: {
			'&:after': {
				content: '""',
				height: '4px',
				background: Colors.SECONDARY,
				width: '100%',
				left: 0,
				bottom: 0,
				position: 'absolute',
			},
		},
		centerTitle: {
			fontFamily: Fonts.Bebas,
			fontSize: '3rem',
			color: Colors.SECONDARY,
			whiteSpace: 'nowrap',
			textTransform: 'uppercase',
			position: 'relative',
			marginLeft: theme.spacing(1),
		},
		logoContainer: {
			background: Colors.Background,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			cursor: 'pointer',
		},
		icon: {
			width: '53px',
			height: '53px',
			cursor: 'pointer',
			'& img': {
				width: '53px',
				height: '53px',
				cursor: 'pointer',
			},
			'& svg': {
				width: '100%',
				height: '100%',
				fontSize: '55px',
				color: Colors.SECONDARY,
			},
		},
		title: {
			fontFamily: Fonts.Bebas,
			color: Colors.SECONDARY,
			whiteSpace: 'nowrap',
		},
		buttonContainer: {
			display: 'flex',
			justifyContent: 'flex-end',
			'& > *': {
				marginRight: theme.spacing(2.5),
			},
		},
	})
);

const ConnectButton = styled(WalletMultiButton)`
	/* background: url('/connectWallet.png'); */
	/* background: url('/emptyConnectWallet.png'); */
	background: ${props => `url('/${props.connected}.png')`};
	background-position: 12px 5px !important;
	background-repeat: no-repeat !important;
	background-size: contain !important;
	width: 360px;
	height: 60px;
	/* color: transparent; */
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 20px;

	&:hover {
		background-color: transparent !important;
	}

	&[disabled] {
		background: url('/emptyConnectWallet.png') no-repeat center !important;
		background-size: contain !important;
	}

	i {
		margin-top: -17px;
		margin-right: 10px;
	}

	p {
		margin-top: -17px;
	}
`;

export default function Header() {
	const classes = useStyle();
	const wallet = useAnchorWallet();
	let walletAddr = null;
	const navigate = useNavigate();
	if (wallet && wallet?.publicKey.toString()) {
		walletAddr = wallet?.publicKey.toString();
		walletAddr = `${walletAddr?.slice(0, 4)}...${walletAddr?.slice(-5)}`;
	}

	const onClickLogo = () => {
		navigate('/raffle');
	};

	// useEffect(() => {
	// 	if (!walletAddr) {
	// 		navigate('/home');
	// 	}
	// }, [walletAddr, navigate]);

	return (
		<Box className={classes.container}>
			<Box className={classes.buttonContainer}>
				<ConnectButton connected={walletAddr ? "emptyConnectWallet" : "connectWallet" }>
					{walletAddr ? `${walletAddr}` : ''}
				</ConnectButton>
			</Box>
		</Box>
	);
}
