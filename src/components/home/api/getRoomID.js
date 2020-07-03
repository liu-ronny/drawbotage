export default async function getRoomID() {
  const response = await fetch("/roomid");
  const roomID = await response.text();
  return roomID;
}
