const baseColors = {
    black: "#000000",
    white: {
        pure: "#ffffff",
        transparent: "rgba(255, 255, 255, 0.65)",
    },
    // named darkest to lightest
    dark: {
        one: "#141219",
        two: "#19171f",
        three: "#1e1b25",
        four: "#25222e", // fka three
        five: "#2f2a3c", // fka four
        six: "#3b3649", // fka charcoal gray, its purplish...
        seven: "#4a4658",
    },
    // all "offwhites" now in the gray hierarchy
    // lightest to darkest
    gray: {
        one: "#f7f7f7",
        two: "#f4f4f4",
        three: "#f2f2f2",
        four: "#e7e7e7", // fka white six
        five: "#d3d3d3",
        six: "#d8d8d8", // fka three
        seven: "#979797",
        eight: "#737373",
        nine: "#4a4a4a",
    },
    // lightest to darkest
    purple: {
        one: "#e7e4f2", // fka light
        two: "#ddd9ec",
        three: "#bab5c9",
        four: "#d0c7ed",
        five: "#d7c8ff",
        six: "#b59ff6", // fka baby
        seven: "#322759",
        eight: "#2d224d",
        nine: "#827aa3", // from allen master style guide
        ten: "#8048f3", // from allen master style guide
    },
    blue: "#0094FF",
    // brightest to dimmest
    red: {
        one: "#c23030",
        two: "#d14040",
    },
    transparent: "transparent",
};

export const semanticColors = {
    // bg colors
    transparentBg: baseColors.transparent,
    lightBg: baseColors.gray.one,
    mediumBg: baseColors.dark.six,
    grayBg: baseColors.gray.four,
    darkBg: baseColors.dark.four,
    lightPurpleBg: baseColors.purple.one,
    // text colors
    lightBgText: baseColors.dark.one,
    lightBgActiveText: baseColors.dark.three,
    darkBgText: baseColors.gray.nine,
    whiteText: baseColors.white.pure,
    // accent colors
    primaryPurple: baseColors.purple.six,
    activePurple: baseColors.purple.five,
    primaryBlue: baseColors.blue,
    primaryBorder: baseColors.gray.seven,
    sliderColor: baseColors.gray.six,
    buttonTextGray: baseColors.gray.five,
    tagBg: baseColors.purple.nine,
    tagText: baseColors.gray.nine,
};

export const componentColors = {
    form: {
        label: semanticColors.darkBgText,
    },
    input: {
        placeholder: semanticColors.primaryBorder,
        border: semanticColors.primaryBorder,
        background: semanticColors.grayBg,
    },
    button: {
        hoverBg: baseColors.transparent,
        activeBg: baseColors.transparent,
    },
    radio: {
        primary: semanticColors.whiteText,
        text: semanticColors.lightBgText,
    },
    layout: {
        sider: semanticColors.lightBgText,
        trigger: semanticColors.lightBgText,
        triggerAccent: semanticColors.primaryPurple,
        footer: semanticColors.darkBg,
        lightTrigger: semanticColors.grayBg,
    },
    menu: {
        item: baseColors.transparent,
        selectedBg: semanticColors.primaryPurple,
        selectedText: semanticColors.whiteText,
    },
    modal: {
        headerBg: semanticColors.lightPurpleBg,
        contentBg: semanticColors.lightPurpleBg,
        title: semanticColors.lightBgText,
    },
    checkbox: {
        border: semanticColors.primaryBorder,
        check: semanticColors.lightBgText,
        background: semanticColors.grayBg,
        hover: semanticColors.grayBg,
    },
    tabs: {
        background: semanticColors.lightPurpleBg,
        accent: semanticColors.darkBgText,
    },
    popover: {
        background: semanticColors.mediumBg,
        text: semanticColors.whiteText,
    },
    dropdown: {
        background: semanticColors.mediumBg,
        text: semanticColors.buttonTextGray,
        active: semanticColors.activePurple,
        activeTextColor: semanticColors.lightBgActiveText,
    },
    tag: {
        background: semanticColors.tagBg,
        text: semanticColors.tagText,
    },
    slider: {
        rail: semanticColors.darkBg,
        railHover: semanticColors.primaryBorder,
        color: semanticColors.sliderColor,
    },
};

export const themeColors = {
    ...semanticColors,
    ...componentColors,
};
