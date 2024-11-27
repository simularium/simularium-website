// Base colors - updates should match css vars!
const PURE_WHITE = "#ffffff";
const DARK = "#141219";
const DARK_THREE = "#25222e";
const DARK_FOUR = "#2f2a3c";
const OFF_WHITE = "#f7f7f7";
const WHITE_SIX = "#e7e7e7";
const WHITE_THREE = "#d8d8d8";
const BABY_PURPLE = "#b59ff6";
const LIGHT_PURPLE = "#e7e4f2";
const CHARCOAL_GRAY = "#3b3649";
const ALLEN_PURPLE = "#8d87aa";
const GRAYISH_BROWN = "#4a4a4a";
const BLUE = "#0094FF";
const WARM_GRAY = "#979797";
const TRANSPARENT_WHITE = "rgba(255, 255, 255, 0.65)";
const TRANSPARENT = "transparent";

const APP_BG_COLOR = OFF_WHITE;
const TABS_INTERACTION_COLOR = DARK_FOUR;
const SLIDER_COLOR = WHITE_THREE;
const CHECKBOX_BG_COLOR = WHITE_SIX;

// Light Theme Tokens (Global defaults, Modal, Radio)
const lightTheme = {
    // Global Tokens
    colorPrimary: BABY_PURPLE,
    colorBgBase: WHITE_SIX,
    colorBgContainer: APP_BG_COLOR,
    colorBgLayout: WHITE_SIX,
    colorText: GRAYISH_BROWN,
    colorLink: BLUE,

    // Form
    labelColor: DARK,

    // Input
    inputPlaceholderColor: WARM_GRAY,
    inputBorderColor: WARM_GRAY,
    inputBgColor: APP_BG_COLOR,

    // Radio
    radioPrimaryColor: PURE_WHITE,
    radioTextColor: DARK,

    // Modal
    modalHeaderBg: LIGHT_PURPLE,
    modalContentBg: LIGHT_PURPLE,
    modalTitleColor: DARK,
};

// Dark Theme Tokens
const darkTheme = {
    // Layout
    layoutSiderBg: DARK,
    layoutTriggerBg: DARK,
    layoutTriggerColor: BABY_PURPLE,
    layoutFooterBg: DARK_THREE,
    layoutLightTriggerColor: GRAYISH_BROWN,

    // Menu
    menuDarkItemColor: TRANSPARENT_WHITE,
    menuDarkSelectedBg: BABY_PURPLE,
    menuDarkSelectedColor: PURE_WHITE,

    // Button
    buttonDefaultBg: TRANSPARENT,

    // Checkbox
    checkboxBorderColor: WARM_GRAY,
    checkboxPrimaryColor: CHECKBOX_BG_COLOR,
    checkboxBgColor: CHECKBOX_BG_COLOR,
    checkboxMarkColor: DARK,

    // Tabs
    tabsCardBg: LIGHT_PURPLE,
    tabsInteractionColor: TABS_INTERACTION_COLOR,

    // Popover
    popoverBgColor: CHARCOAL_GRAY,
    popoverTextColor: PURE_WHITE,

    // Dropdown
    dropdownBgColor: CHARCOAL_GRAY,
    dropdownTextColor: TRANSPARENT_WHITE,

    // Tag
    tagDefaultBg: ALLEN_PURPLE,
    tagDefaultColor: WHITE_SIX,

    // Slider
    sliderRailBg: DARK_FOUR,
    sliderRailHoverBg: WARM_GRAY,
    sliderColor: SLIDER_COLOR,
};

export const simulariumTheme = {
    token: {
        fontFamily:
            "'Overpass', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        // Using light theme tokens for global defaults
        // todo: redesign will restrict light theme
        // to modals and specific pages
        colorPrimary: lightTheme.colorPrimary,
        colorBgBase: lightTheme.colorBgBase,
        colorBgContainer: lightTheme.colorBgContainer,
        colorBgLayout: lightTheme.colorBgLayout,
        colorText: lightTheme.colorText,
        colorLink: lightTheme.colorLink,
        borderRadius: 0,
        controlHeight: 32,
        controlHeightLG: 40,
        controlHeightSM: 24,
    },
    components: {
        Form: {
            labelColor: lightTheme.labelColor,
            verticalLabelPadding: "0 0 4px 0",
            labelFontSize: 16,
        },
        Input: {
            colorTextPlaceholder: lightTheme.inputPlaceholderColor,
            colorBorder: lightTheme.inputBorderColor,
            colorBgContainer: lightTheme.inputBgColor,
        },
        Button: {
            algorithm: true,
            defaultHoverBg: darkTheme.buttonDefaultBg,
            defaultActiveBg: darkTheme.buttonDefaultBg,
            borderRadius: 3,
        },
        Radio: {
            colorPrimary: lightTheme.radioPrimaryColor,
            colorText: lightTheme.radioTextColor,
        },
        Layout: {
            headerHeight: 60,
            headerPadding: 0,
            siderBg: darkTheme.layoutSiderBg,
            triggerBg: darkTheme.layoutTriggerBg,
            triggerColor: darkTheme.layoutTriggerColor,
            footerBg: darkTheme.layoutFooterBg,
            zeroTriggerWidth: 30,
            zeroTriggerHeight: 100,
            lightTriggerColor: darkTheme.layoutLightTriggerColor,
        },
        Menu: {
            darkItemColor: darkTheme.menuDarkItemColor,
            darkItemSelectedBg: darkTheme.menuDarkSelectedBg,
            darkItemSelectedColor: darkTheme.menuDarkSelectedColor,
        },
        Modal: {
            headerBg: lightTheme.modalHeaderBg,
            contentBg: lightTheme.modalContentBg,
            titleColor: lightTheme.modalTitleColor,
            borderRadiusLG: 6,
        },
        Checkbox: {
            borderRadius: 3,
            colorBorder: darkTheme.checkboxBorderColor,
            size: 16,
            colorPrimary: darkTheme.checkboxPrimaryColor,
            colorBgContainer: darkTheme.checkboxBgColor,
            colorWhite: darkTheme.checkboxMarkColor,
            colorPrimaryHover: darkTheme.checkboxPrimaryColor,
        },
        Tabs: {
            cardBg: darkTheme.tabsCardBg,
            inkBarColor: darkTheme.tabsInteractionColor,
            itemHoverColor: darkTheme.tabsInteractionColor,
            itemActiveColor: darkTheme.tabsInteractionColor,
            itemSelectedColor: darkTheme.tabsInteractionColor,
            horizontalItemMargin: "0 0 0 12",
            titleFontSizeLG: 18,
        },
        Popover: {
            colorBgElevated: darkTheme.popoverBgColor,
            colorText: darkTheme.popoverTextColor,
            sizePopupArrow: 8,
        },
        Dropdown: {
            colorBgElevated: darkTheme.dropdownBgColor,
            colorText: darkTheme.dropdownTextColor,
        },
        Tag: {
            defaultBg: darkTheme.tagDefaultBg,
            defaultColor: darkTheme.tagDefaultColor,
        },
        Slider: {
            railBg: darkTheme.sliderRailBg,
            railHoverBg: darkTheme.sliderRailHoverBg,
            trackBg: darkTheme.sliderColor,
            handleColor: darkTheme.sliderColor,
            trackHoverBg: darkTheme.sliderColor,
            handleActiveColor: darkTheme.sliderColor,
            handleActiveOutlineColor: TRANSPARENT,
            handleSize: 5.5,
            handleSizeHover: 5.5,
            dotBorderColor: darkTheme.sliderColor,
        },
    },
};
export default simulariumTheme;
