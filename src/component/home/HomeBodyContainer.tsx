import {
  Box,
  Grid,
  Typography,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import { Colors, Fonts } from '../../utils/styles/DefaultTheme';
import React, { useEffect, useMemo, useState } from 'react';

import HomeBodyCard from '../home/HomeBodyCard';
import { Raffle } from '../../lib/types';
import { useRafflesStore } from '../../hooks/useRafflesStore';
import { useWallet } from '@solana/wallet-adapter-react';

const useStyle = makeStyles((theme) =>
  createStyles({
    bodyContainer: {
      width: '100%',
      marginTop: theme.spacing(2.5),
    },
  })
);

interface HomeBodyContainerProps {}

export interface tableType {
  winner: string;
  entries: number;
  claim: JSX.Element | null;
}

export default function HomeBodyContainer(props: HomeBodyContainerProps) {
  const { publicKey } = useWallet();
  const classes = useStyle();
  const { raffles, fetchAllRaffles, fetching } = useRafflesStore();

  const rafflesToShow = useMemo(() => {
    //@ts-ignore
    let toShow = [...raffles.values()].sort(
      (raffle1, raffle2) =>
        raffle2.endTimestamp.getTime() - raffle1.endTimestamp.getTime()
    );
    return toShow;
  }, [raffles]);

  console.log('homebodycontainer', rafflesToShow[rafflesToShow.length - 1]);

  const getView = () => {
	const currentRaffle = rafflesToShow[rafflesToShow.length - 1];
    if (currentRaffle) {
		const modifiedCard = {
			image: currentRaffle.metadata.overviewImageUri,
			title: currentRaffle.metadata.name,
			entries: currentRaffle.totalTickets,
			numUniqueWallets: currentRaffle.entrants.size,
			winner: currentRaffle.prizes.length,
			time: currentRaffle.endTimestamp?.toString(),
			ticketPrice:
			currentRaffle.proceeds.ticketPrice.toNumber() /
			  10 ** (currentRaffle.proceeds.mint.decimals || 0),
			raffleId: currentRaffle.publicKey.toBase58(),
			raffle: currentRaffle,
			description: currentRaffle.metadata.description ?? '',
			total: currentRaffle.metadata.total ?? 1,
		  };
      return (
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <HomeBodyCard key={0} {...modifiedCard} />;
        </Box>
      );
    } else {
      return (
        <Box
          width='100%'
          height={'400px'}
          display='flex'
          flexDirection={'column'}
          justifyContent={'center'}
          alignItems='center'
        >
          <div className='lds-facebook'>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <Typography
            style={{
              fontSize: '1.5rem',
              color: Colors.SECONDARY,
            }}
          >
            Patience is a virtue.
          </Typography>
        </Box>
      );
    }
  };

  useEffect(fetchAllRaffles, [fetchAllRaffles]);

  return <Box className={classes.bodyContainer}>{getView()}</Box>;
}
