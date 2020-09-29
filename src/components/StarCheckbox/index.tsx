import React, { ChangeEvent } from "react";
import classNames from "classnames";
import { CheckboxChangeEvent, CheckboxProps } from "antd/lib/checkbox";

const styles = require("./style.css");

interface StarCheckbox extends CheckboxProps {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
const StarCheckbox: React.FunctionComponent<CheckboxProps> = ({
    checked,
    indeterminate,
    onChange,
    value,
    className,
}: CheckboxProps) => {
    const parentClassnames = className ? className.split(" ") : [];
    const wrapperClassnames = classNames([...parentClassnames, styles.wrapper]);
    const checkboxClassNames = classNames(["icon-moon", styles.checkbox], {
        [styles.checked]: checked,
        [styles.indeterminate]: indeterminate,
    });
    console.log(className);
    return (
        <label className={wrapperClassnames}>
            <span className={styles.container}>
                <input
                    checked={checked}
                    type="checkbox"
                    onChange={onChange}
                    value={value}
                />
                <span className={checkboxClassNames} />
            </span>
        </label>
    );
};

export default StarCheckbox;
