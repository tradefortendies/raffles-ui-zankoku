import { Box, createStyles, makeStyles } from '@material-ui/core';
import React, { useContext, useEffect } from 'react';

import { CardContext } from '../../context/cardContext';
import HomeBodyContainer from '../home/HomeBodyContainer';
import HomeTitleContainer from '../home/HomeTitleContainer';
import Layout from '../layout/Layout';

const useStyle = makeStyles((theme) =>
	createStyles({
		container: {
			marginTop: theme.spacing(6),
			width: '100%',
			[theme.breakpoints.down('sm')]: {
				marginTop: theme.spacing(2.5),
			},
		},
	})
);

export default function HomePage() {
	const classes = useStyle();
	const [card, setCard] = useContext(CardContext);

	useEffect(() => {
		setCard(null);
	}, [setCard]);
	return (
		<Layout>
			<Box className={classes.container}>
				<HomeBodyContainer />
			</Box>
		</Layout>
	);
}
