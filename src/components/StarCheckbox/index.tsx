import React from "react";
import classNames from "classnames";
import { Tooltip } from "antd";
import { CheckboxChangeEvent, CheckboxProps } from "antd/lib/checkbox";

import { LEFT_PANEL_TOOLTIP_DELAY, TOOLTIP_COLOR } from "../../constants";

import styles from "./style.css";

const StarCheckbox = ({
    checked,
    indeterminate,
    onChange,
    value,
    className,
}: CheckboxProps): JSX.Element => {
    const parentClassnames = className ? className.split(" ") : [];
    const wrapperClassnames = classNames([...parentClassnames, styles.wrapper]);
    const checkboxClassNames = classNames(["icon-moon", styles.checkbox], {
        [styles.checked]: checked,
        [styles.indeterminate]: indeterminate,
    });

    return (
        <label className={wrapperClassnames}>
            <span className={styles.container}>
                <Tooltip
                    title={checked ? "Remove highlight" : "Highlight"}
                    placement="top"
                    mouseEnterDelay={LEFT_PANEL_TOOLTIP_DELAY}
                    color={TOOLTIP_COLOR}
                >
                    <input
                        checked={checked}
                        type="checkbox"
                        onChange={(e: any) =>
                            onChange ? onChange(e as CheckboxChangeEvent) : null
                        }
                        value={value}
                    />
                </Tooltip>
                <span className={checkboxClassNames} />
            </span>
        </label>
    );
};

export default StarCheckbox;
