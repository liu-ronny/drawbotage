function gameStateReducer(state, action) {
  const newState = {};
  Object.assign(newState, state);

  switch (action.type) {
    case "UPDATE_GAME_INFO":
      newState.host = action.host;
      newState.bluePlayerNames = action.bluePlayerNames;
      newState.redPlayerNames = action.redPlayerNames;
      newState.unassignedPlayerNames = action.unassignedPlayerNames;
      newState.rounds = action.rounds;
      newState.drawTime = action.drawTime;
      break;
    case "DISCONNECT":
      newState.disconnected = true;
      newState.disconnectedMsg = action.message;
      break;
    case "START_GAME":
      newState.startGame = true;
      break;
    default:
      return state;
  }

  return newState;
}

export default gameStateReducer;
