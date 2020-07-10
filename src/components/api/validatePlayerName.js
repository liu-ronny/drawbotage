export default async function validatePlayerName(playerName) {
  const response = await fetch(
    `http://localhost:8080/is-valid-roomID/${playerName}`
  );
  const text = await response.text();
  return text === "true";
}
