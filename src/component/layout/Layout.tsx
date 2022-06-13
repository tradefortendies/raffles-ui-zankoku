import {
	Box,
	BoxProps,
	createStyles,
	makeStyles,
	useMediaQuery,
	useTheme,
} from '@material-ui/core';

import FullWidthPage from './FullWidthPage';
import Header from './Header.jsx';
import React from 'react';
// import VerticalHeader from './VerticalHeader.jsx';

const useStyle = makeStyles((theme) =>
	createStyles({
		container: {
			backgroundSize: 'contain',
			backgroundRepeat: 'no-repeat',
			width: '100%',
			maxWidth: '1720px',
			height: '100vh',
			padding: theme.spacing(2.5, 15),
			position: 'relative',
			boxSizing: 'border-box',
			'& .back-img': {
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
			},
			[theme.breakpoints.down('md')]: {
				padding: theme.spacing(2.5, 6.2),
			},
			[theme.breakpoints.down('sm')]: {
				padding: theme.spacing(2.5),
				backgroundSize: 'contain !important',
			},
			'& .extra': {
				height: '100px',
			},
		},
	})
);

interface LayoutProps {}

export default function Layout({ children }: LayoutProps & BoxProps) {
	const classes = useStyle();
	const theme = useTheme();
	// const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

	return (
		<FullWidthPage>
			<Box className={classes.container}>
				<Header />
				<Box
					width="100%"
					display="flex"
					justifyContent={'center'}
					alignItems="center"
					position="relative"
				>
					{children}
				</Box>
				<Box className="extra"></Box>
			</Box>
		</FullWidthPage>
	);
}
