import React, { useEffect, useState } from "react";
import { Tooltip } from "antd";

import {
    NAV_BAR_TOOLTIP_OFFSET,
    TOOLTIP_COLOR,
    TOOLTIP_DELAY,
} from "../../constants";
import NavButton, { NavButtonProps } from "../NavButton";
import { TooltipPlacement } from "../../constants/interfaces";

interface TooltipText {
    default: string;
    disabled?: string;
}
interface NavButtonWithTooltipProps extends NavButtonProps {
    tooltipText?: TooltipText;
    tooltipPlacement?: TooltipPlacement;
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
    const [tooltipVisible, setTooltipVisible] = useState(false);

    // The conditional below prevents a flicker when tooltip text changes faster than tooltip can hide
    useEffect(() => {
        if (!isDisabled || (!tooltipVisible && isDisabled)) {
            setTooltipRenderText(getTooltipRenderText());
        }
    }, [isDisabled]);

    const onMouseEnter = () => setTooltipVisible(true);
    const onMouseLeave = () => setTooltipVisible(false);

    const navButtonProps = {
        ...props,
        titleText,
        icon,
        buttonType,
        isDisabled,
        clickHandler,
        onMouseEnter,
        onMouseLeave,
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
