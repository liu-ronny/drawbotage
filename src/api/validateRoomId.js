export default async function validateRoomId(roomId) {
  const response = await fetch(
    `https://shrouded-woodland-63031.herokuapp.com/rooms/valid/${roomId}`
  );
  const text = await response.text();
  return text === "true";
}
