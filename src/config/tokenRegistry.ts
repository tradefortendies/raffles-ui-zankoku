export const wrappedSOL = 'So11111111111111111111111111111111111111112';

export const tokenRegistry = {
	'HTN3btAx52hsVjvtehCvmACcHdDKJSniYPnKCQTEoxfw': {
		chainId: 101,
		address: 'HTN3btAx52hsVjvtehCvmACcHdDKJSniYPnKCQTEoxfw',
		symbol: 'TT',
		name: 'TEST TOKEN',
		decimals: 9,
		logoURI:
			'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/9nusLQeFKiocswDt6NQsiErm1M43H2b8x6v5onhivqKv/logo.png',
		tags: [],
		extensions: {
			website: 'https://sollama.finance',
			twitter: 'https://twitter.com/SollamaFinance',
		},
	},
	C2Yb6sdCrZgaXNoWqYy1NFRfvTqphwUR9e2XPEwf51rW: {
		chainId: 101,
		address: 'C2Yb6sdCrZgaXNoWqYy1NFRfvTqphwUR9e2XPEwf51rW',
		symbol: '$TCRECK',
		name: 'TCRECK',
		decimals: 9,
		logoURI:
			'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Ao94rg8D6oK2TAq3nm8YEQxfS73vZ2GWYw2AKaUihDEY/logo.png',
		tags: ['social-token'],
	},
	'3HyfccrqLjzCty3qo1JRjEuXCPoSFNyoNsszkzVjxPZr': {
		chainId: 101,
		address: '3HyfccrqLjzCty3qo1JRjEuXCPoSFNyoNsszkzVjxPZr',
		symbol: '$TUSDC',
		name: 'TUSDC',
		decimals: 9,
		logoURI:
			'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
		tags: ['social-token'],
	},
	Ao94rg8D6oK2TAq3nm8YEQxfS73vZ2GWYw2AKaUihDEY: {
		chainId: 101,
		address: 'Ao94rg8D6oK2TAq3nm8YEQxfS73vZ2GWYw2AKaUihDEY',
		symbol: '$CRECK',
		name: 'CRECK',
		decimals: 9,
		logoURI:
			'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Ao94rg8D6oK2TAq3nm8YEQxfS73vZ2GWYw2AKaUihDEY/logo.png',
		tags: ['social-token'],
	},
	EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: {
		chainId: 101,
		address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
		symbol: 'USDC',
		name: 'USD Coin',
		decimals: 6,
		logoURI:
			'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
		tags: ['stablecoin'],
		extensions: {
			coingeckoId: 'usd-coin',
			serumV3Usdt: '77quYg4MGneUdjgXCunt9GgM1usmrxKY31twEy3WHwcS',
			website: 'https://www.centre.io/',
		},
	},
	EdmGrziqDSzSdyUgVRkQL5M48RgrdByazD4fDQix66As: {
		name: 'SMB #3 (SMB)',
		logoURI:
			'https://ik.imagekit.io/cmjffa5th3u/smb3_GE0vhGPQK.png?ik-sdk-version=javascript-1.4.3&updatedAt=1649131783173',
		chainId: 101,
		address: 'EdmGrziqDSzSdyUgVRkQL5M48RgrdByazD4fDQix66As',
		symbol: '$SMB',
		decimals: 0,
		tags: ['social-token'],
	},
	'2kSXtar8DQyRgJKKdMbGQESATGa8pgtD8i8CQiDBopYe': {
		name: 'SMB #32 (SMB)',
		logoURI:
			'https://ik.imagekit.io/cmjffa5th3u/smb32_NcJ8qpdIo.png?ik-sdk-version=javascript-1.4.3&updatedAt=1649135487141',
		chainId: 101,
		address: '2kSXtar8DQyRgJKKdMbGQESATGa8pgtD8i8CQiDBopYe',
		symbol: '$SMB',
		decimals: 0,
		tags: ['social-token'],
	},
	AeDMqYg7VUTgKJJwN9PNtLx64FkpZie2ASs7J4TMRNpN: {
		name: 'SMB #31 (SMB)',
		logoURI:
			'https://bafkreicp4qiutxxgh5lqcfkt5kqreg34zgvbgzxmmqfo3ljtqg2u5qgroq.ipfs.dweb.link/?ext=png',
		chainId: 101,
		address: 'AeDMqYg7VUTgKJJwN9PNtLx64FkpZie2ASs7J4TMRNpN',
		symbol: '$SMB',
		decimals: 0,
		tags: ['social-token'],
	},
	AMzmwvDRKdt5AQ3m1m28tWjzBxmQNe1PsmHnYitVZwzp: {
		"chainId": 101,
		"address": "AMzmwvDRKdt5AQ3m1m28tWjzBxmQNe1PsmHnYitVZwzp",
		"symbol": "JUNKz",
		"name": "JUNK",
		"decimals": 9,
		"logoURI": "https://raw.githubusercontent.com/XAGBack/JUNKToken1/main/JunkToken.png",
		"tags": [
		  "utility-token"
		]
	  }
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
