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
      newState.start = true;
      break;
    case "SET_CURRENT_PLAYER":
      newState.currentPlayerName = action.currentPlayerName;
      break;
    case "WAIT_FOR_WORD_SELECTION":
      newState.wordSelector = action.selector;
      newState.wordSelectionTimeRemaining = action.timeRemaining / 1000;
      break;
    case "SELECT_WORD":
      newState.wordChoices = action.wordChoices;
      newState.respondWithWord = action.respondWithWord;
      newState.wordSelectionTimeRemaining = action.timeRemaining / 1000;
      break;
    case "SELECT_WORD_TIMER":
      newState.wordSelectionTimeRemaining = action.timeRemaining / 1000;
      break;
    case "WORD_SELECTED":
      newState.wordChoices = null;

      if (newState.respondWithWord) {
        newState.respondWithWord(action.word);
        newState.respondWithWord = null;
      }

      break;
    case "WORD_SELECTION":
      let coveredWord = "";

      for (let i = 0; i < action.wordLength; i++) {
        coveredWord += action.spacesAt.includes(i) ? " " : "_";
      }

      newState.coveredWord = coveredWord;
      newState.wordSelector = null;
      newState.wordChoices = null;
      newState.respondWithWord = null;
      newState.wordSelectionTimeRemaining = null;
      break;
    case "WAIT_FOR_DRAWBOTAGE_SELECTION":
      newState.drawbotageSelector = action.selector;
      newState.drawbotageSelectionTimeRemaining = action.timeRemaining / 1000;
      break;
    case "SELECT_DRAWBOTAGE":
      newState.selectDrawbotage = true;
      newState.respondWithDrawbotage = action.respondWithDrawbotage;
      newState.drawbotageSelectionTimeRemaining = action.timeRemaining / 1000;
      break;
    case "DRAWBOTAGE_SELECTED":
      newState.selectDrawbotage = false;

      if (newState.respondWithWord) {
        newState.respondWithDrawbotage(action.drawbotage);
        newState.respondWithDrawbotage = null;
      }

      break;
    case "SELECT_DRAWBOTAGE_TIMER":
      newState.drawbotageSelectionTimeRemaining = action.timeRemaining / 1000;
      break;
    case "DRAWBOTAGE_SELECTION":
      newState.currentDrawbotage = action.drawbotage;
      newState.drawbotageSelector = null;
      newState.respondWithDrawbotage = null;
      newState.drawbotageSelectionTimeRemaining = null;
      break;
    case "END_TURN":
      newState.coveredWord = null;
      break;
    default:
      return state;
  }

  return newState;
}

export default gameStateReducer;
