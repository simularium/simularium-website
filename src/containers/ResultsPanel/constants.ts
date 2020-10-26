const COLORS = {
    darkTwo: "#1e1b25",
    whiteTwo: "#d3d3d3",
    babyPurple: "#b59ff6",
};

export const PLOT_STYLE = {
    backgroundColor: COLORS.darkTwo,
    backgroundTransparentColor: "#14121987",
    textColor: COLORS.whiteTwo,
    borderColor: "#737373",
    fontFamily: "Overpass",
    fontSize: 11,
    legendItemHeight: 19, // Dependent on fontSize and fontFamily
    marginTop: 40,
    marginLeft: 50,
    marginBottom: 30,
    marginRight: 5,
    colorway: [
        "#c9e358",
        "#12e9ff",
        "#005097",
        COLORS.babyPurple,
        COLORS.whiteTwo,
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
