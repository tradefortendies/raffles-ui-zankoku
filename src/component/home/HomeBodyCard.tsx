import {
  Box,
  Grid,
  Typography,
  createStyles,
  makeStyles,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';
import { Colors, Fonts } from '../../utils/styles/DefaultTheme';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useProgramApis } from '../../hooks/useProgramApis';
import { expand } from '../../lib/randomnessTools';
import { CardContext } from '../../context/cardContext';
import Countdown from 'react-countdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Raffle } from '../../lib/types';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useRafflesStore } from '../../hooks/useRafflesStore';
import { useWallet } from '@solana/wallet-adapter-react';
import { sleep } from '../../lib/utils';
import { claimPrize as claimPrizeQuery } from '../../lib/actions/claimPrize';
import { buyTickets } from '../../lib/actions/buyTickets';

import styled from 'styled-components';

const RaffleContainer = styled.div`
  color: white;

  display: flex;
  justify-content: space-evenly;
  align-items: center;

  .description-container {
    text-align: center;
    overflow: auto !important;
    height: 120px;
    background-color: #383555;
    border: 8px solid #2b2941;
    padding: 6px 40px;
    color: #c6ff00;
    font-size: 14px;

    &.ended {
      color: white;
    }

    &.claimed {
      color: white !important;
    }
  }

  @media (max-width: 1200px) {
    flex-direction: column;
  }
`;

const StationContainer = styled.div`
  flex: 1 50%;
  margin: 0 10px;
  background-image: url('/cardBg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  text-align: center;
  position: relative;

  width: 600px;
  font-size: 16px;

  padding: 48px;

  h1 {
    text-align: center;
  }

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type='number'] {
    -moz-appearance: textfield;
  }

  .card-icon {
    display: block;
    text-align: left;
    position: absolute;
    top: -30px;
    height: 100px;
  }

  .tickets-container {
    display: flex;
    justify-content: space-between;
  }

  .purchase-container {
    display: flex;
    align-items: center;

    img {
      height: 60px;

      :hover {
        cursor: pointer;
      }
    }

    .tickets-container {
      display: flex;
      flex-direction: row !important;
      align-items: center;
      margin-left: 50px;

      div {
        background-image: url('/numTicketsBg.png');
        background-repeat: no-repeat;
        background-size: contain;

        margin-left: 30px;
        height: 60px;

        input {
          margin: 12px 54px;
          height: 30px;
          width: 75px;

          background-color: #6b678d;
          color: white;
        }
      }
    }
  }

  .back-button {
    position: absolute;
    bottom: -80px;
    height: 60px;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    text-align: center;

    :hover {
      cursor: pointer;
    }
  }

  /* Ended State */
  .claim-button {
    display: block;
    margin: 0 auto;
    height: 60px;

    :hover {
      cursor: pointer;
    }
  }

  /* Claimed State */
  .ended-text {
    font-size: 40px;
    text-align: center;
    color: #75fb83;
    line-height: 0;
  }

  @media (max-width: 1200px) {
    /* background-image: none; */
    /* background-color: #4b4867; */

    /* border: 8px solid #222034; */
    border-radius: 8px;

    width: 800px;

    .purchase-container {
      justify-content: space-between;
      .tickets-container {
        margin-left: 250px;
      }
    }
  }

  @media (max-width: 1000px) {
    width: 600px;

    .purchase-container {
      flex-direction: column-reverse;

      .tickets-container {
        margin: 24px;
        margin-left: 72px;
      }
    }
  }

  @media (max-width: 800px) {
    width: 400px;

    .tickets-container {
      flex-direction: column;
    }
  }

  @media (max-width: 550px) {
    margin-top: 30px;
    width: 230px;
    text-align: center;
    order: 2;
    h1 {
      font-size: 30px;
      margin: 36px 0;
    }

    .purchase-container > .tickets-container {
      flex-direction: column !important;
      margin-left: 36px;
    }

    .back-button {
      height: 40px;
    }
  }
`;

const PrizeContainer = styled.div`
  flex: 1 50%;
  margin: 0 10px;
  text-align: center;

  img {
    border: 2px solid black;
    border-radius: 8px;
    width: 100%;
    max-width: 568px;
    max-height: 568px;
    box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px,
      rgba(0, 0, 0, 0.22) 0px 15px 12px;
  }

  h3 {
    text-align: right;
  }

  p {
    text-align: center;
  }

  @media (max-width: 1200px) {
    h3 {
      text-align: center;
    }

    margin-top: 100px;
  }
  @media (max-width: 550px) {
    order: 1;
    margin-top: 5px !important;
  }
`;

const useStyle = makeStyles((theme) =>
  createStyles({
    bodyCardContainer: {
      background: Colors.SECONDARY,
      padding: theme.spacing(1.25),
      position: 'relative',
    },
    imgContainer: {
      width: '100%',
      '& img': {
        width: '100%',
        height: 'auto',
      },
    },
    cardContainer: {
      backgroundRepeat: `no-repeat`,
      backgroundSize: `contain`,
    },
    title: {
      fontFamily: Fonts.Bebas,
      fontSize: '1.5rem',
      fontWeight: 400,
      color: Colors.black,
      display: 'block',
      marginTop: theme.spacing(1.25),
      position: 'relative',
      paddingBottom: theme.spacing(0.5),
      marginBottom: theme.spacing(1),
      textTransform: 'uppercase',
      '&:after': {
        position: 'absolute',
        content: '""',
        width: '100%',
        height: '1px',
        opacity: 0.1,
        background: Colors.black,
        bottom: 0,
        left: 0,
      },
    },
    info: {
      fontFamily: Fonts.ShareTech,
      fontSize: '1.125rem',
      color: Colors.black,
    },
    timerBox: {
      height: '32px',
      width: '32px',
      border: '1px solid rgba(0, 0, 0, 0.6)',
      marginRight: theme.spacing(0.25),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    timerInfo: {
      fontFamily: Fonts.ShareTech,
      fontSize: '1rem',
      color: Colors.black,
    },
    greyCtaBtn: {
      width: '100%',
      marginTop: theme.spacing(2),
      padding: theme.spacing(1, 2),
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      border: 0,
      outline: 0,
      fontFamily: Fonts.Bebas,
      fontSize: '1.25rem',
      color: Colors.black,
      textTransform: 'uppercase',
      cursor: 'pointer',
      background: Colors.grey,
      '&:hover': {
        background: Colors.black,
        color: Colors.SECONDARY,
      },
      '& svg': {
        marginLeft: theme.spacing(1),
      },
    },
    badge: {
      position: 'absolute',
      top: 0,
      left: theme.spacing(2.5),
      background:
        'linear-gradient(93.09deg, #FF00C7 -30.79%, #00FFD1 42.53%, #FFF500 118.97%)',
      padding: theme.spacing(0.75, 1.5),
    },
    badgeInfo: {
      fontFamily: Fonts.Bebas,
      fontSize: '1.25rem',
      color: Colors.black,
      textTransform: 'uppercase',
    },
    ctaBtn: {
      width: '100%',
      marginTop: theme.spacing(2),
      padding: theme.spacing(1, 2),
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      border: `3px solid ${Colors.black}`,
      fontFamily: Fonts.Bebas,
      fontSize: '1.25rem',
      color: Colors.black,
      textTransform: 'uppercase',
      cursor: 'pointer',
      background: Colors.SECONDARY,
      '&:hover': {
        background: Colors.black,
        color: Colors.SECONDARY,
      },
      '& svg': {
        marginLeft: theme.spacing(1),
      },
    },
  })
);

export interface HomeBodyCardType {
  image: string;
  title: string;
  entries: number;
  winner: number;
  time?: number | string;
  numUniqueWallets: number;
  ticketPrice: number;
  raffleId: string;
  raffle: Raffle;
  description: string;
  total: number;
}

interface HomeBodyCardProps extends HomeBodyCardType {}

interface renderTimeType {
  hours: number;
  days: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

export default function HomeBodyCard({
  image,
  title,
  entries,
  winner,
  time,
  numUniqueWallets,
  ticketPrice,
  raffleId,
  raffle: raffleOld,
  description,
  total,
}: HomeBodyCardProps) {
  const classes = useStyle();
  const theme = useTheme();
  const [card, setCard] = useContext(CardContext);
  const [timerEnded, setTimerEnded] = useState(false);

  // related to claiming
  const [error, setError] = useState('');
  const [transactionOnGoing, setTransactionOnGoing] = useState(false);
  const [index, setIndex] = useState(0);
  const [winningTicketState, setWinningTicketState] = useState(0);
  const { draffleClient } = useProgramApis();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [ticket, setTicket] = useState(0);

  const wallet = useAnchorWallet();
  let walletAddr = null;
  if (wallet && wallet?.publicKey.toString()) {
    walletAddr = wallet?.publicKey.toString();
  }
  const navigate = useNavigate();
  let handleTicketAmount = (e: React.FormEvent<HTMLInputElement>): void => {
    setTicket((e.target as HTMLInputElement).valueAsNumber);
  };
  const { raffles, updateRaffleById } = useRafflesStore();
  console.log('raffles', time, title, winner);
  const raffle = useMemo(() => raffles.get(raffleId), [raffleId, raffles]);
  const winningTickets = useMemo(() => {
    if (!raffle.randomness || !raffle.entrants || raffle.entrants.size === 0)
      return [];
    const secret = raffle.randomness;
    return raffle.prizes.map((_, prizeIndex) => {
      const rand = expand(secret, prizeIndex);
      return rand % raffle.totalTickets;
    });
  }, [raffle]);
  const updateCurrentRaffle = useCallback(async () => {
    if (updateRaffleById) await updateRaffleById(raffle.publicKey.toBase58());
  }, [raffle.publicKey, updateRaffleById]);

  const entrant = useMemo(() => {
    if (!draffleClient.provider.wallet.publicKey) return;

    return raffle?.entrants.get(
      draffleClient.provider.wallet.publicKey.toString()
    );
  }, [raffle, draffleClient.provider.wallet.publicKey]);

  const entrantEntries = useMemo(() => {
	if (!draffleClient.provider.wallet.publicKey) return;

    const entrant = raffle?.entrants.get(
		draffleClient.provider.wallet.publicKey.toString()
	  );
	  console.log('entrant', entrant);
	  return entrant?.tickets?.length;
  }, [raffle, draffleClient.provider.wallet.publicKey]);
  

  const onBuyTickets = async () => {
    try {
      console.log({ ticket });
      setTransactionOnGoing(true);
      await buyTickets(draffleClient, raffle, ticket);
      await sleep(500);
      updateCurrentRaffle();
    } catch (error: any) {
      let message = 'Something went wrong';
      if (error && error.message) {
        message = `Transaction failed: ${error.message}`;
      }
      setError(message);
    } finally {
      setTransactionOnGoing(false);
    }
  };

  const claimPrize = async (i: number, winning: number) => {
    try {
      setTransactionOnGoing(true);
      const prizeIndex = index;
      const ticketIndex = winningTicketState;
      await claimPrizeQuery(draffleClient, raffle, prizeIndex, ticketIndex);
      await sleep(500);
      updateCurrentRaffle();
    } catch (error: any) {
      let message = 'Something went wrong';
      if (error && error.message) {
        message = `Transaction failed: ${error.message}`;
      }
      setError(message);
    } finally {
      setTransactionOnGoing(false);
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

  const onClickJoinRaffle = () => {
    const card: HomeBodyCardType = {
      title,
      image,
      entries,
      winner,
      time,
      numUniqueWallets,
      ticketPrice,
      raffleId,
      raffle,
      description,
      total,
    };
    setCard?.(card);

    if (timerEnded) {
      navigate('/raffle-table');
    } else {
      navigate('/raffle-buy');
    }
  };

  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return;
    } else {
      // Render a countdown
      return (
        <>
          <Typography
            style={{
              color: '#c6ff00',
              marginBottom: '10px',
              marginTop: '0px',
              paddingTop: '0px',
            }}
          >
            {days}days {hours}hrs {minutes}mins {seconds}s
          </Typography>
        </>
      );
    }
  };

  if (!raffle?.isEnded) {
    return (
      <RaffleContainer>
        <StationContainer>
          <img src='/cardIcon.png' alt='Card Icon' className='card-icon' />
          <h1>Raffle Station</h1>
    		  <h5>Ticket Sales Ends In:</h5>
          <Countdown date={time} renderer={renderer} />
          <div className='description-container'>
            <p>{description}</p>
          </div>
          <div>
            <p>Price: {ticketPrice} Junkz</p>
            <div className='tickets-container'>
              {transactionOnGoing ? (
                <p>BUYING...</p>
              ) : (
                <p>Tickets: {entries}</p>
              )}
              {walletAddr && <p>Owned: {entrantEntries}</p>}
            </div>
            <div className='purchase-container'>
              <img
                src='/buyButton.png'
                alt='Buy Tickets'
                onClick={onBuyTickets}
              />
              <div className='tickets-container'>
                <p>Amount</p>
                <div>
                  <input type='number' value={ticket} onChange={handleTicketAmount} />
                </div>
              </div>
            </div>
          </div>
        </StationContainer>
        <PrizeContainer>
          <h3>Raffle Prize</h3>
          <div>
            <img src={image} alt='NFT Raffled' />
          </div>
          <p>
            {winner}x {title}
          </p>
        </PrizeContainer>
      </RaffleContainer>
    );
  } else {
    return (
      <RaffleContainer>
        <StationContainer>
          <img src='/cardIcon.png' alt='Card Icon' className='card-icon' />
          <h1>Raffle Station</h1>
          {raffle?.randomness && <div className='description-container'>
            <p>Winners</p>
            {raffle?.prizes?.map((data, i) => (
              <p>
                {getWinnerWalletAddr(
                  raffle.entrantsRaw[winningTickets[i]].toBase58()
                )}
              </p>
            ))}
          </div>}
          <div>
            <p>Burned: {ticketPrice * entries} Junkz</p>
            <p>Tickets Sold: {entries}</p>
            {raffle?.randomness && raffle?.prizes?.map((data, i) => {
              if ((entrant?.tickets || []).includes(winningTickets[i])) {
                return (
                    <img
                      src='/claimButton.png'
                      alt='Claim Button'
                      className='claim-button'
                      onClick={() => claimPrize(i, winningTickets[i])}
                    />
                );
              }
            })}
			{transactionOnGoing ? (<p>Claiming...</p>) : null}
          </div>
        </StationContainer>
        <PrizeContainer>
          <h3>Raffle Prize</h3>
          <div>
          <img src={image} alt='NFT Raffled' />
          </div>
          <div className='description-container ended'>
            <p>{description}</p>
          </div>
        </PrizeContainer>
      </RaffleContainer>
    );
  }
}
