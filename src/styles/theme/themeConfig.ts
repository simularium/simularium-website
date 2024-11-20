import { ThemeConfig } from "antd";

const WHITE = "#ffffff";
const DARK = "#141219";
const DARK_TWO = "#1e1b25";
const DARK_THREE = "#1b181f";
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

// Semantic Color Variables
const COLOR_PRIMARY = BABY_PURPLE;
const COLOR_BG_BASE = WHITE_SIX;
const COLOR_BG_CONTAINER = OFF_WHITE;
const COLOR_BG_LAYOUT = WHITE_SIX;
const COLOR_TEXT = GRAYISH_BROWN;
const COLOR_SUCCESS = HIGHLIGHT_GREEN;
const COLOR_LINK = BLUE;

const FORM_LABEL_COLOR = DARK;

const INPUT_PLACEHOLDER_COLOR = MEDIUM_DARK_GRAY;
const INPUT_BORDER_COLOR = MEDIUM_DARK_GRAY;
const INPUT_BG_COLOR = OFF_WHITE;
const INPUT_HOVER_COLOR = BABY_PURPLE;

const BUTTON_PRIMARY_COLOR = BABY_PURPLE;
const BUTTON_DEFAULT_BG = TRANSPARENT;
const BUTTON_DEFAULT_COLOR = DEFAULT_GRAY;
const BUTTON_DEFAULT_BORDER = DARK_TWO;

const RADIO_PRIMARY_COLOR = WHITE;
const RADIO_TEXT_COLOR = DARK;

const LAYOUT_SIDER_BG = DARK;
const LAYOUT_TRIGGER_BG = DARK;
const LAYOUT_TRIGGER_COLOR = BABY_PURPLE;
const LAYOUT_FOOTER_BG = DARK_THREE;
const LAYOUT_LIGHT_TRIGGER_COLOR = GRAYISH_BROWN;

const MENU_DARK_ITEM_COLOR = TRANSPARENT_WHITE;
const MENU_DARK_SELECTED_BG = BABY_PURPLE;
const MENU_DARK_SELECTED_COLOR = WHITE;

const MODAL_HEADER_BG = LIGHT_PURPLE;
const MODAL_CONTENT_BG = LIGHT_PURPLE;
const MODAL_TITLE_COLOR = DARK;

const CHECKBOX_BORDER_COLOR = MEDIUM_DARK_GRAY;
const CHECKBOX_PRIMARY_COLOR = WHITE_SIX;
const CHECKBOX_BG_COLOR = WHITE_SIX;
const CHECKBOX_MARK_COLOR = DARK;

const TABS_CARD_BG = LIGHT_PURPLE;
const TABS_INK_BAR_COLOR = DARK_FOUR;
const TABS_ITEM_HOVER_COLOR = DARK_FOUR;
const TABS_ITEM_ACTIVE_COLOR = DARK_FOUR;
const TABS_ITEM_SELECTED_COLOR = DARK_FOUR;

const POPOVER_BG_COLOR = DARK_PURPLE;
const POPOVER_TEXT_COLOR = WHITE;

const DROPDOWN_BG_COLOR = DARK_PURPLE;
const DROPDOWN_TEXT_COLOR = TRANSPARENT_WHITE;

const TAG_DEFAULT_BG = ALLEN_PURPLE;
const TAG_DEFAULT_COLOR = WHITE_SIX;

const SLIDER_RAIL_BG = BACKGROUND_COLOR_LIGHT;
const SLIDER_RAIL_HOVER_BG = WARM_GRAY;
const SLIDER_TRACK_BG = WHITE_THREE;
const SLIDER_HANDLE_COLOR = WHITE_THREE;
const SLIDER_DOT_BORDER_COLOR = WHITE_THREE;

export const simulariumTheme: ThemeConfig = {
    token: {
        fontFamily:
            "'Overpass', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        colorPrimary: COLOR_PRIMARY,
        colorBgBase: COLOR_BG_BASE,
        colorBgContainer: COLOR_BG_CONTAINER,
        colorBgLayout: COLOR_BG_LAYOUT,
        colorText: COLOR_TEXT,
        colorSuccess: COLOR_SUCCESS,
        colorLink: COLOR_LINK,
        borderRadius: 0,
        controlHeight: 32,
        controlHeightLG: 40,
        controlHeightSM: 24,
    },
    components: {
        Form: {
            labelColor: FORM_LABEL_COLOR,
            verticalLabelPadding: "0 0 4px 0",
            labelFontSize: 16,
        },
        Input: {
            colorTextPlaceholder: INPUT_PLACEHOLDER_COLOR,
            colorBorder: INPUT_BORDER_COLOR,
            colorBgContainer: INPUT_BG_COLOR,
            colorPrimaryHover: INPUT_HOVER_COLOR,
            hoverBorderColor: INPUT_HOVER_COLOR,
        },
        Button: {
            colorPrimary: BUTTON_PRIMARY_COLOR,
            colorPrimaryHover: BUTTON_PRIMARY_COLOR,
            algorithm: true,
            defaultBg: BUTTON_DEFAULT_BG,
            defaultHoverBg: BUTTON_DEFAULT_BG,
            defaultActiveBg: BUTTON_DEFAULT_BG,
            defaultColor: BUTTON_DEFAULT_COLOR,
            defaultBorderColor: BUTTON_DEFAULT_BORDER,
            borderRadius: 3,
        },
        Radio: {
            colorPrimary: RADIO_PRIMARY_COLOR,
            colorText: RADIO_TEXT_COLOR,
        },
        Layout: {
            headerHeight: 60,
            headerPadding: 0,
            siderBg: LAYOUT_SIDER_BG,
            triggerBg: LAYOUT_TRIGGER_BG,
            triggerColor: LAYOUT_TRIGGER_COLOR,
            footerBg: LAYOUT_FOOTER_BG,
            zeroTriggerWidth: 30,
            zeroTriggerHeight: 100,
            lightTriggerColor: LAYOUT_LIGHT_TRIGGER_COLOR,
        },
        Menu: {
            darkItemColor: MENU_DARK_ITEM_COLOR,
            darkItemSelectedBg: MENU_DARK_SELECTED_BG,
            darkItemSelectedColor: MENU_DARK_SELECTED_COLOR,
        },
        Modal: {
            headerBg: MODAL_HEADER_BG,
            contentBg: MODAL_CONTENT_BG,
            titleColor: MODAL_TITLE_COLOR,
            borderRadiusLG: 6,
        },
        Checkbox: {
            borderRadius: 3,
            colorBorder: CHECKBOX_BORDER_COLOR,
            size: 16,
            colorPrimary: CHECKBOX_PRIMARY_COLOR,
            colorBgContainer: CHECKBOX_BG_COLOR,
            colorWhite: CHECKBOX_MARK_COLOR,
            colorPrimaryHover: CHECKBOX_PRIMARY_COLOR,
        },
        Tabs: {
            cardBg: TABS_CARD_BG,
            inkBarColor: TABS_INK_BAR_COLOR,
            itemHoverColor: TABS_ITEM_HOVER_COLOR,
            itemActiveColor: TABS_ITEM_ACTIVE_COLOR,
            itemSelectedColor: TABS_ITEM_SELECTED_COLOR,
            horizontalItemMargin: "0 0 0 12",
            titleFontSizeLG: 18,
        },
        Popover: {
            colorBgElevated: POPOVER_BG_COLOR,
            colorText: POPOVER_TEXT_COLOR,
            sizePopupArrow: 8,
        },
        Dropdown: {
            colorBgElevated: DROPDOWN_BG_COLOR,
            colorText: DROPDOWN_TEXT_COLOR,
        },
        Tag: {
            defaultBg: TAG_DEFAULT_BG,
            defaultColor: TAG_DEFAULT_COLOR,
        },
        Slider: {
            railBg: SLIDER_RAIL_BG,
            railHoverBg: SLIDER_RAIL_HOVER_BG,
            trackBg: SLIDER_TRACK_BG,
            handleColor: SLIDER_HANDLE_COLOR,
            trackHoverBg: SLIDER_TRACK_BG,
            handleActiveColor: SLIDER_HANDLE_COLOR,
            handleActiveOutlineColor: TRANSPARENT,
            handleSize: 5.5,
            handleSizeHover: 5.5,
            dotBorderColor: SLIDER_DOT_BORDER_COLOR,
        },
    },
};

export default simulariumTheme;
