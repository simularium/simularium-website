import { ThemeConfig } from "antd";
import { themeColors } from "./colors";

const typographyToken = {
    fontFamily:
        "'Overpass', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
};

// make variables available as props in
// .styled components by passing this into
// the ThemeProvider in the StyleProvider
export const styledTheme = {
    colors: themeColors,
    typography: typographyToken.fontFamily,
} as const;

export type ThemeType = typeof styledTheme;
export type ThemedProps<T = unknown> = T & { theme: ThemeType };

export const antdTheme: ThemeConfig = {
    token: {
        fontFamily: typographyToken.fontFamily,
        colorPrimary: themeColors.primaryPurple,
        colorBgBase: themeColors.lightBg,
        colorBgContainer: themeColors.lightBg,
        colorBgLayout: themeColors.lightBg,
        colorText: themeColors.lightBgText,
        colorLink: themeColors.primaryBlue,
        borderRadius: 0,
        controlHeight: 32,
        controlHeightLG: 40,
        controlHeightSM: 24,
    },
    components: {
        Form: {
            labelColor: themeColors.form.label,
            verticalLabelPadding: "0 0 4px 0",
            labelFontSize: 16,
        },
        Input: {
            colorTextPlaceholder: themeColors.input.placeholder,
            colorBorder: themeColors.input.border,
            colorBgContainer: themeColors.input.background,
        },
        Button: {
            algorithm: true,
            defaultHoverBg: themeColors.button.hoverBg,
            defaultActiveBg: themeColors.button.activeBg,
            borderRadius: 3,
        },
        Radio: {
            colorPrimary: themeColors.radio.primary,
            colorText: themeColors.radio.text,
        },
        Layout: {
            headerHeight: 60,
            headerPadding: 0,
            siderBg: themeColors.layout.sider,
            triggerBg: themeColors.layout.trigger,
            triggerColor: themeColors.layout.triggerAccent,
            footerBg: themeColors.layout.footer,
            zeroTriggerWidth: 30,
            zeroTriggerHeight: 100,
            lightTriggerColor: themeColors.layout.lightTrigger,
        },
        Menu: {
            darkItemColor: themeColors.menu.item,
            darkItemSelectedBg: themeColors.menu.selectedBg,
            darkItemSelectedColor: themeColors.menu.selectedText,
        },
        Modal: {
            headerBg: themeColors.modal.headerBg,
            contentBg: themeColors.modal.contentBg,
            titleColor: themeColors.modal.title,
            borderRadiusLG: 6,
        },
        Checkbox: {
            borderRadius: 3,
            colorBorder: themeColors.checkbox.border,
            size: 16,
            colorPrimary: themeColors.checkbox.background,
            colorBgContainer: themeColors.checkbox.background,
            colorWhite: themeColors.checkbox.check,
            colorPrimaryHover: themeColors.checkbox.background,
        },
        Tabs: {
            cardBg: themeColors.tabs.background,
            inkBarColor: themeColors.tabs.accent,
            itemHoverColor: themeColors.tabs.accent,
            itemActiveColor: themeColors.tabs.accent,
            itemSelectedColor: themeColors.tabs.accent,
            horizontalItemMargin: "0 0 0 12",
            titleFontSizeLG: 18,
        },
        Popover: {
            colorBgElevated: themeColors.popover.background,
            colorText: themeColors.popover.text,
            sizePopupArrow: 8,
        },
        Dropdown: {
            colorBgElevated: themeColors.dropdown.background,
            colorText: themeColors.dropdown.text,
        },
        Tag: {
            defaultBg: themeColors.tag.background,
            defaultColor: themeColors.tag.text,
        },
        Slider: {
            railBg: themeColors.slider.rail,
            railHoverBg: themeColors.slider.railHover,
            trackBg: themeColors.slider.color,
            handleColor: themeColors.slider.color,
            trackHoverBg: themeColors.slider.color,
            handleActiveColor: themeColors.slider.color,
            handleActiveOutlineColor: themeColors.transparentBg,
            handleSize: 5.5,
            handleSizeHover: 5.5,
            dotBorderColor: themeColors.slider.color,
        },
    },
};
