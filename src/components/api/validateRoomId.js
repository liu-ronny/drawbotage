export default async function validateRoomId(roomId) {
  const response = await fetch(
    `http://localhost:8080/is-valid-roomID/${roomId}`
  );
  const text = await response.text();
  return text === "true";
}
