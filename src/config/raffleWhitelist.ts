import { RaffleMetaData } from '../lib/types';
import { TESTING } from './misc';

// HbwUf4Lhc5a7QEdeGxBR7N9ZgHrokajoeQvsvL9ZND12 - can be used later
const testWhitelist = new Map<string, RaffleMetaData>([
  [
    'Ghwy4hmoSgJvw4aSbjqy5F3vpScpfxbGz2fmZSdYWGc6',
    {
      name: 'PENGSOL Whitelist',
      overviewImageUri:
        'https://stek.cetsoncreck.com/api/static/raffle/pengsol_wl.png',
      twitter: 'https://twitter.com/pengsol_',
      discord: 'https://discord.com/creckhouse',
      description:
        '25 winners will receive 1 WL spot for PENGSOL upcoming NFT project (Discord Closed)',
      total: 5000,
      claimable: false,
      timer: 'Tuesday, 11 June 2022 06:30:00 PM GMT+05:30',
    },
  ],
  [
    'BdgY4hbemKeDsMzExmz8sq4izaHozzeYD4xHfAEdZVZr',
    {
      name: 'Neo Hunters Whitelist',
      overviewImageUri:
        'https://stek.cetsoncreck.com/api/static/raffle/neo_hunters.jpg',
      twitter: 'https://twitter.com/neo_hunters',
      discord: 'http://discord.gg/neohunters',
      description:
        '20 winners will receive 1 WL spot for Neo Hunters upcoming NFT project',
      total: 5000,
      claimable: false,
      timer: 'Tuesday, 10 June 2022 06:30:00 PM GMT+05:30',
    },
  ],
]);

const prodWhitelist = new Map<string, RaffleMetaData>([
  [
    'FnHwnXGBz7NRZEsT8u12pE2cxURt8mYHQZykzmRtjb27',
    {
      name: 'dRaffle launch raffle',
      overviewImageUri: '/resources/001-mainnet-launch.gif',
    },
  ],
  [
    '2QjkshNu3mrcCnriekTpppa3PFwnAR9Yf7v5vc54m2Yh',
    {
      name: 'First SOL raffle',
      overviewImageUri: '/resources/solana-logo.gif',
    },
  ],
  [
    '8aEm1MoDqkYT5vCB21jC6aMMcMbdQJgmHpyBbtHDfUjU',
    {
      name: 'Anti Artist Club',
      overviewImageUri: '/resources/aartist-raffle-overview.gif',
    },
  ],
  [
    '2ziwAj4awgvNyn8ywwjkBRkBsmv259u9vVyEdrGYTb54',
    {
      name: 'More SOL',
      overviewImageUri: '/resources/solana-logo.gif',
    },
  ],
  [
    'EgHys3WPcM5WRpKqVHs1REfK6Npzq9sJ7dZPFPzQy2xG',
    {
      name: 'Triple SOL',
      overviewImageUri: '/resources/solana-logo-x3.gif',
    },
  ],
  [
    'CjzFZfrMW4D1jZVm5upCobRi96UYnQTk5cescSt12rhV',
    {
      name: 'SAMO raffle',
      overviewImageUri: '/resources/samo-x3.gif',
    },
  ],
  [
    'EZtBKgWq66KT4jRKtd4VT3LWh3mVC4pwcCsqLzKas63G',
    {
      name: 'BitBoat raffle',
      overviewImageUri: '/resources/bitboat-raffle.gif',
    },
  ],
]);

export const RAFFLES_WHITELIST = TESTING ? testWhitelist : prodWhitelist;
