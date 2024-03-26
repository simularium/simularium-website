import React, { ReactNode, useEffect, useState } from "react";
import { Tooltip, TooltipProps } from "antd";

import {
    NAV_BAR_TOOLTIP_OFFSET,
    TOOLTIP_COLOR,
    TOOLTIP_DELAY,
} from "../../constants";
import NavButton, { NavButtonProps } from "../NavButton";

interface NavButtonWithTooltipProps extends NavButtonProps {
    tooltipText?: { default: string; disabled?: string };
    titleText?: string;
    buttonType?: string;
    tooltipPlacement?: TooltipProps["placement"];
    icon?: ReactNode;
    clickHandler: () => void;
    isDisabled?: boolean;
}

const NavButtonWithTooltip: React.FC<NavButtonWithTooltipProps> = ({
    tooltipText = { default: "" },
    titleText,
    tooltipPlacement,
    buttonType,
    icon,
    clickHandler,
    isDisabled = false,
    ...props
}) => {
    const getTooltipRenderText = () => {
        return isDisabled && tooltipText.disabled
            ? tooltipText.disabled
            : tooltipText.default;
    };

    const [tooltipRenderText, setTooltipRenderText] =
        useState(getTooltipRenderText);

    // The conditional below prevents a flicker when tooltip text changes faster than tooltip can hide
    useEffect(() => {
        if (!isDisabled || (!tooltipVisible && isDisabled)) {
            setTooltipRenderText(getTooltipRenderText());
        }
    }, [isDisabled]);

    const [tooltipVisible, setTooltipVisible] = React.useState(false);

    const handleMouseEnter = () => setTooltipVisible(true);
    const handleMouseLeave = () => setTooltipVisible(false);

    const navButtonProps = {
        ...props,
        titleText,
        icon,
        buttonType,
        isDisabled,
        clickHandler,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
    };

    return (
        <Tooltip
            placement={tooltipPlacement}
            title={tooltipRenderText}
            color={TOOLTIP_COLOR}
            mouseEnterDelay={TOOLTIP_DELAY}
            arrowPointAtCenter={true}
            align={{ targetOffset: NAV_BAR_TOOLTIP_OFFSET }}
            trigger={["hover", "focus"]}
            open={tooltipVisible}
        >
            <NavButton {...navButtonProps} onClick={clickHandler} />
        </Tooltip>
    );
};

export default NavButtonWithTooltip;
