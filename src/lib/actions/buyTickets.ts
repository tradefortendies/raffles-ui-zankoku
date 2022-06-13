import {
	ASSOCIATED_TOKEN_PROGRAM_ID,
	Token,
	TOKEN_PROGRAM_ID,
	u64,
} from '@solana/spl-token';
import { Transaction, TransactionInstruction } from '@solana/web3.js';
import { DraffleProgram } from '../../providers/ProgramApisProvider';
import { PaymentOption, Raffle } from '../types';

export const BUY_TICKETS_TX_FEE_LAMPORTS = 5;

export const calculateBasketPrice = (
	ticketPrice: u64,
	ticketAmount: number,
	paymentOption: PaymentOption
) =>
	ticketPrice
		.muln(ticketAmount)
		.mul(paymentOption.dispenserPriceIn)
		.div(paymentOption.dispenserPriceOut);

export const buyTickets = async (
	draffleClient: DraffleProgram,
	raffle: Raffle,
	ticketAmount: number
) => {
	// Compute buyer ATA for tickets purchase
	const buyerTokenAccount = await Token.getAssociatedTokenAddress(
		ASSOCIATED_TOKEN_PROGRAM_ID,
		TOKEN_PROGRAM_ID,
		raffle.proceeds.mint.publicKey,
		draffleClient.provider.wallet.publicKey
	);
	let finalBuyerAccount = buyerTokenAccount;
	let instructions: TransactionInstruction[] = [];

	instructions.push(
		draffleClient.instruction.buyTickets(ticketAmount, {
			accounts: {
				raffle: raffle.publicKey,
				entrants: raffle.entrantsAccountAddress,
				proceeds: raffle.proceeds.address,
				buyerTokenAccount: finalBuyerAccount,
				buyerTransferAuthority: draffleClient.provider.wallet.publicKey,
				tokenProgram: TOKEN_PROGRAM_ID,
			},
		})
	);

	return await draffleClient.provider.send(
		new Transaction().add(...instructions)
	);
};
