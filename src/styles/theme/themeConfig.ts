import { ThemeConfig } from "antd";

const WHITE = "#ffffff";
const DARK = "#141219";
const DARK_TWO = "#1e1b25";
const DARK_FOUR = "#2f2a3c";
const WHITE_SIX = "#e7e7e7";
const WHITE_THREE = "#d8d8d8";
const BABY_PURPLE = "#b59ff6";
const LIGHT_PURPLE = "#e7e4f2";
const DARK_PURPLE = "#3b3649";
const ALLEN_PURPLE = "#8d87aa";
const GRAYISH_BROWN = "#4a4a4a";
const HIGHLIGHT_GREEN = "#b2d030";
const BLUE = "#0094FF";
const MEDIUM_DARK_GRAY = "#8b8b8b";
const WARM_GRAY = "#979797";
const BACKGROUND_COLOR_LIGHT = "#302c3b";
const TRANSPARENT_WHITE = "rgba(255, 255, 255, 0.65)";
const TRANSPARENT = "transparent";
const OFF_WHITE = "#f7f7f7";
const DEFAULT_GRAY = "#d9d9d9";
const DARK_THREE = "#1b181f";

export const simulariumTheme: ThemeConfig = {
    token: {
        fontFamily:
            "'Overpass', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        colorPrimary: BABY_PURPLE,
        colorBgBase: WHITE_SIX,
        colorBgContainer: OFF_WHITE,
        colorBgLayout: WHITE_SIX,
        colorText: GRAYISH_BROWN,
        colorSuccess: HIGHLIGHT_GREEN,
        colorLink: BLUE,
        borderRadius: 0,
        controlHeight: 32,
        controlHeightLG: 40,
        controlHeightSM: 24,
    },
    components: {
        Form: {
            labelColor: DARK,
            verticalLabelPadding: "0 0 4px 0",
            labelFontSize: 16,
        },
        Input: {
            colorTextPlaceholder: MEDIUM_DARK_GRAY,
            colorBorder: MEDIUM_DARK_GRAY,
            colorBgContainer: OFF_WHITE,
            colorPrimaryHover: BABY_PURPLE,
            hoverBorderColor: BABY_PURPLE,
        },
        Button: {
            colorPrimary: BABY_PURPLE,
            colorPrimaryHover: BABY_PURPLE,
            algorithm: true,
            defaultBg: TRANSPARENT,
            defaultHoverBg: TRANSPARENT,
            defaultActiveBg: TRANSPARENT,
            defaultColor: DEFAULT_GRAY,
            defaultBorderColor: DARK_TWO,
            borderRadius: 3,
        },
        Radio: {
            colorPrimary: WHITE,
            colorText: DARK,
        },
        Layout: {
            headerHeight: 60, // todo: align. also defined in constants.css as --header-height
            headerPadding: 0,
            siderBg: DARK,
            triggerBg: DARK,
            triggerColor: BABY_PURPLE,
            footerBg: DARK_THREE,
            zeroTriggerWidth: 30,
            zeroTriggerHeight: 100,
            lightTriggerColor: GRAYISH_BROWN,
        },
        Menu: {
            darkItemColor: TRANSPARENT_WHITE,
            darkItemSelectedBg: BABY_PURPLE,
            darkItemSelectedColor: WHITE,
        },
        Modal: {
            headerBg: LIGHT_PURPLE,
            contentBg: LIGHT_PURPLE,
            titleColor: DARK,
            borderRadiusLG: 6,
        },
        Checkbox: {
            borderRadius: 3,
            colorBorder: MEDIUM_DARK_GRAY, // indeterminate border color
            size: 16,
            colorPrimary: WHITE_SIX, // background of checked box
            colorBgContainer: WHITE_SIX, // background of checked and indeterminate box
            colorWhite: DARK, // color of the checked checkmark WHY????
            colorPrimaryHover: WHITE_SIX,
        },
        Tabs: {
            cardBg: LIGHT_PURPLE,
            inkBarColor: DARK_FOUR,
            itemHoverColor: DARK_FOUR,
            itemActiveColor: DARK_FOUR,
            itemSelectedColor: DARK_FOUR,
            horizontalItemMargin: "0 0 0 12",
            titleFontSizeLG: 18,
        },
        Popover: {
            colorBgElevated: DARK_PURPLE, // colorPicker and title tooltip
            colorText: WHITE,
            sizePopupArrow: 8,
        },
        Dropdown: {
            colorBgElevated: DARK_PURPLE,
            colorText: TRANSPARENT_WHITE,
        },
        Tag: {
            defaultBg: ALLEN_PURPLE,
            defaultColor: WHITE_SIX,
        },
        Slider: {
            railBg: BACKGROUND_COLOR_LIGHT,
            railHoverBg: WARM_GRAY,
            trackBg: WHITE_THREE,
            handleColor: WHITE_THREE,
            trackHoverBg: WHITE_THREE,
            handleActiveColor: WHITE_THREE,
            handleActiveOutlineColor: TRANSPARENT,
            handleSize: 5.5,
            handleSizeHover: 5.5,
            dotBorderColor: WHITE_THREE,
        },
    },
};

export default simulariumTheme;
