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
}: CheckboxProps) => {
    const checkboxClassNames = classNames(["icon-moon", styles.checkbox], {
        [styles.checked]: checked,
        [styles.indeterminate]: indeterminate,
    });

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <input
                    checked={checked}
                    type="checkbox"
                    onChange={onChange}
                    value={value}
                />
                <span className={checkboxClassNames} />
            </div>
        </div>
    );
};

export default StarCheckbox;
