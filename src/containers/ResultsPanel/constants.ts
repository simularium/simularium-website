const COLORS = {
    darkTwo: "#1e1b25",
    whiteTwo: "#d3d3d3",
    babyPurple: "#b59ff6",
    lightGreen: "#c9e358",
    cyan: "#12e9ff",
    darkBlue: "#005097",
    pink: "#ce729e",
    burntOrange: "#ce7152",
    green: "#54ce52",
};

export const PLOT_STYLE = {
    backgroundColor: COLORS.darkTwo,
    backgroundTransparentColor: "#14121987",
    textColor: COLORS.whiteTwo,
    borderColor: "#737373",
    timeIndicatorColor: COLORS.whiteTwo,
    fontFamily: "Overpass",
    fontSize: 11,
    titleFontSize: 16,
    titlePositionX: 0.03,
    titlePositionY: 0.94,
    legendItemHeight: 19, // Dependent on fontSize and fontFamily
    titleMaxCharPerLine: 33,
    titleHeightPerLine: 20.02, // Dependent on fontSize and fontFamily
    marginTop: 55,
    marginLeft: 50,
    marginBottom: 30,
    marginRight: 5,
    colorway: [
        COLORS.lightGreen,
        COLORS.cyan,
        COLORS.darkBlue,
        COLORS.babyPurple,
        COLORS.whiteTwo,
        COLORS.pink,
        COLORS.burntOrange,
        COLORS.green,
    ],
    height: 240,
    width: 260,
};

// Shared between x-axis and y-axis
export const AXIS_ATTRIBUTES = {
    /* cSpell:disable */
    showline: true,
    linecolor: COLORS.whiteTwo,
    title: {
        size: 12,
        standoff: 3,
    },
    automargin: true,
    showgrid: false,
    zeroline: false,
    /* cSpell:enable */
};

export const DATA_STYLE = {
    lineWidth: 1,
    markerSize: 3,
    markerLineWidth: 0.5,
};
