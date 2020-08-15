export default async function validatePlayerName(roomId, playerName) {
  const response = await fetch(
    `https://shrouded-woodland-63031.herokuapp.com/rooms/${roomId}/players/${playerName}`
  );
  const text = await response.text();
  return text === "false";
}
