const titles = ["reverse", "hide", "color", "bulldoze"];
const drawbotages = {
  reverse: {
    description:
      "Every stroke made by the player appears in the opposite direction.",
    iconClassName: "fa fa-map-signs",
  },
  hide: {
    description: "The player only sees the previous stroke on his/her canvas.",
    iconClassName: "far fa-eye-slash",
  },
  color: {
    description: "Each new stroke is set to a random color.",
    iconClassName: "fa fas fa-palette",
  },
  bulldoze: {
    description:
      "Every 10 seconds, 1/5th of the canvas gets bulldozed by a moving eraser.",
    iconClassName: "fa fas fa-eraser",
  },
};

export { titles, drawbotages };
