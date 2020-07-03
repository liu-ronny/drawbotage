export default async function getRoomId() {
  const response = await fetch("/roomid");
  const roomId = await response.text();
  return roomId;
}
