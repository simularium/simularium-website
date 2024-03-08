import React from "react";
import classNames from "classnames";
import { Tooltip } from "antd";
import { CheckboxChangeEvent, CheckboxProps } from "antd/lib/checkbox";

import { TOOLTIP_DELAY, TOOLTIP_COLOR } from "../../constants";

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
    const checkboxClassNames = classNames(
        ["icon-moon", "star-empty-icon", styles.checkbox],
        {
            ["star-full-icon"]: checked,
            ["star-dashed-icon"]: indeterminate,
        }
    );

    return (
        <label className={wrapperClassnames}>
            <span className={styles.container}>
                <Tooltip
                    title={checked ? "Remove highlight" : "Highlight"}
                    placement="top"
                    mouseEnterDelay={TOOLTIP_DELAY}
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
