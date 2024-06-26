import React, { useState } from "react";
import classNames from "classnames";
import { Tooltip } from "antd";
import { CheckboxProps } from "antd/lib/checkbox";

import { TOOLTIP_DELAY, TOOLTIP_COLOR } from "../../constants";
import { IconGlyphs } from "../../constants/interfaces";
import { getIconGlyphClasses } from "../../util";

import styles from "./style.css";

const StarCheckbox = ({
    checked,
    indeterminate,
    onChange,
    value,
    className,
}: CheckboxProps): JSX.Element => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipTitle, setTooltipTitle] = useState("Highlight");

    const parentClassnames = className ? className.split(" ") : [];
    const wrapperClassnames = classNames([...parentClassnames, styles.wrapper]);
    const getIconClasses = () => {
        if (checked) {
            return getIconGlyphClasses(IconGlyphs.StarFull);
        }
        if (indeterminate) {
            return getIconGlyphClasses(IconGlyphs.StarDashed);
        }
        return getIconGlyphClasses(IconGlyphs.StarEmpty);
    };
    const checkboxClassNames = classNames(getIconClasses(), styles.checkbox);

    const updateTooltipTitle = () => {
        const text = checked ? "Remove highlight" : "Highlight";
        setTooltipTitle(text);
    };

    const handleMouseEnter = () => {
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
        updateTooltipTitle();
    };

    return (
        <label className={wrapperClassnames}>
            <span className={styles.container}>
                <Tooltip
                    title={tooltipTitle}
                    placement="top"
                    mouseEnterDelay={TOOLTIP_DELAY}
                    color={TOOLTIP_COLOR}
                    open={showTooltip}
                    onOpenChange={updateTooltipTitle}
                >
                    <input
                        checked={checked}
                        type="checkbox"
                        onChange={(e: any) => {
                            setShowTooltip(false);
                            onChange?.(e);
                        }}
                        value={value}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    />
                </Tooltip>
                <span className={checkboxClassNames} />
            </span>
        </label>
    );
};

export default StarCheckbox;
