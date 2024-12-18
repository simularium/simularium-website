import React from "react";
import { ConfigProvider } from "antd";
import { ThemeProvider } from "styled-components";
import { antdTheme, styledTheme } from "./theme";

interface StyleProviderProps {
    children: React.ReactNode;
}

// a single wrapper for the different styling providers
// consumed by antd and styled-components
const StyleProvider = ({ children }: StyleProviderProps) => {
    return (
        <ConfigProvider theme={antdTheme} wave={{ disabled: true }}>
            <ThemeProvider theme={styledTheme}>
                {/* todo: add style-components GlobalStyles here */}
                {children}
            </ThemeProvider>
        </ConfigProvider>
    );
};

export default StyleProvider;
