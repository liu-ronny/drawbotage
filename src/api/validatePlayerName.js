export default async function validatePlayerName(roomId, playerName) {
  const response = await fetch(
    `http://localhost:8080/rooms/${roomId}/players/${playerName}`
  );
  const text = await response.text();
  return text === "false";
}
