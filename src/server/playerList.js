class EmptyPlayerListError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, EmptyPlayerListError);
  }
}

/**
 * Manages a dynamic list of player names. Its primary role is to get the next
 * available player from the provided list of names. It handles player disconnections
 * and reuses names if necessary.
 */
class PlayerList {
  /**
   * Creates a dynamic list of players that takes care of getting the next available player.
   * @param {Room} room - The room that contains the players
   * @param {string[]} playerNames - The list of player names to manage
   */
  constructor(room, playerNames) {
    this._room = room;
    this._names = [];
    this._temp = [];

    // push the list of player names in reverse order so that they pop in index order
    for (let i = playerNames.length - 1; i >= 0; i--) {
      this._names.push(playerNames[i]);
    }
  }

  /**
   * Returns the name of the next available player. If the next player is no longer in the room,
   * the player's name is discarded from the list.
   * @throws {EmptyPlayerListError} An error indicating that the PlayerList has less than 2 players
   * @returns {string} The name of the next available player
   */
  next() {
    const namesLen = this._names.length;
    const tempLen = this._temp.length;

    if (namesLen + tempLen < 2) {
      throw new EmptyPlayerListError();
    }

    // reuse previously popped names if the main stack is empty
    if (namesLen === 0) {
      for (let i = 0; i < tempLen; i++) {
        this._names.push(this._temp.pop());
      }
    }

    // validate that the next player is available
    // if not, recursively call next, which will either eventually throw an error or return the next available player
    let top = this._names.pop();
    if (!this._room.contains(top)) {
      return this.next();
    }

    this._temp.push(top);
    return top;
  }
}

module.exports = PlayerList;
