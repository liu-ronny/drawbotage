import { timeoutPromise } from "../utils/promises";

/**
 * Gets a new room id from the server.
 * @returns {string} - A UUID that identifies the new room
 * @throws {Error}
 */
async function createRoomId() {
  try {
    const response = await timeoutPromise(
      5000,
      fetch("/rooms", { method: "POST" })
    );
    const roomId = await response.text();
    return roomId;
  } catch (err) {
    throw new Error("Unable to retrieve a room id from the server");
  }
}

export default createRoomId;
