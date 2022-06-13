import axios from "axios"

export const getSubmittedRaffles = async (raffleID) => {
  const url = `https://bleckmarket.cetsoncreck.com/api/raffle/${raffleID}/`
  const result = await axios.get(url)
  return result.data
}

export const submitUserName = async (userName, wallet, raffleId) => {
  const url = "https://bleckmarket.cetsoncreck.com/api/discord/"
  await axios.post(url, {
    wallet,
    raffle_id: raffleId,
    discord_id: userName
  })
}