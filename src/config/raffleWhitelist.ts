import { RaffleMetaData } from '../lib/types';
import { TESTING } from './misc';

// HbwUf4Lhc5a7QEdeGxBR7N9ZgHrokajoeQvsvL9ZND12 - can be used later
const testWhitelist = new Map<string, RaffleMetaData>([
  [
    '4SJ1VPATiwvHneNYzv1mBM1tHE1TKc2vEdhzXTzejojL',
    {
      name: 'Catalina Whale 4518',
      overviewImageUri:
        'https://www.arweave.net/ZsWpkIkgGEI9T-vAxiIGw3A239_UzlVvSk9gXFcD8Bk?ext=png',
      twitter: '',
      discord: '',
      description:
        '1 Winner for a Catalina Whale Mixer NFT',
      total: 5000,
      claimable: false,
      timer: 'Tuesday, 21 June 2022 12:00:00 AM GMT+05:30',
    },
  ]
]);

const prodWhitelist = new Map<string, RaffleMetaData>([
  [
    '4SJ1VPATiwvHneNYzv1mBM1tHE1TKc2vEdhzXTzejojL',
    {
      name: 'Catalina Whale 4518',
      overviewImageUri:
        'https://www.arweave.net/ZsWpkIkgGEI9T-vAxiIGw3A239_UzlVvSk9gXFcD8Bk?ext=png',
      twitter: '',
      discord: '',
      description:
        '1 Winner for a Catalina Whale Mixer NFT',
      total: 5000,
      claimable: false,
      timer: 'Tuesday, 21 June 2022 12:00:00 AM GMT+05:30',
    },
  ]
]);

export const RAFFLES_WHITELIST = TESTING ? testWhitelist : prodWhitelist;
