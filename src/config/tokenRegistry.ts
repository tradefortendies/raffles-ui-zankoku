export const wrappedSOL = 'So11111111111111111111111111111111111111112';

export const tokenRegistry = {
	'AMzmwvDRKdt5AQ3m1m28tWjzBxmQNe1PsmHnYitVZwzp':   {
      chainId: 101,
      address: "Azw7nHFCUrY3i2RpRLxJja1mooiZkAai3ipsmQTeMqNQ",
      symbol: "JUNK",
      name: "Zankoku JUNK",
      decimals: 9,
      logoURI: "https://raw.githubusercontent.com/XAGBack/junktoken/main/Junk.png",
      tags: [
        "utility-token"
      ]
    },
};

export const tokenInfoMap = new Map(Object.entries(tokenRegistry));

export const UNKNOWN_TOKEN_INFO = {
	chainId: 101,
	symbol: '???',
	name: 'Unkown token',
	decimals: 0,
	logoURI:
		'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/9nusLQeFKiocswDt6NQsiErm1M43H2b8x6v5onhivqKv/logo.png',
	tags: [],
	extensions: {},
};
