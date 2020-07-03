export default async function validateRoomID(roomID) {
  const response = await fetch(
    `http://localhost:8080/is-valid-roomID/${roomID}`
  );
  const text = await response.text();
  return text === "true";
}
