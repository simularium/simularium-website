import React from "react";
import { Checkbox as AntdCheckbox } from "antd";
import { map, noop } from "lodash";
import { CheckboxChangeEvent, CheckboxOptionType } from "antd/lib/checkbox";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
const CheckboxGroup = AntdCheckbox.Group;

import Checkbox from "../Checkbox";
import { CHECKBOX_TYPE_STAR } from "../../constants";

interface CheckboxTreeSubmenuProps {
    agentsHighlighted: string[];
    options: CheckboxOptionType[];
    onChange: (values: CheckboxValueType[]) => void;
    checkboxType?: CHECKBOX_TYPE_STAR;
}
const styles = require("./style.css");

const CheckboxTreeSubmenu = ({
    agentsHighlighted,
    options,
    onChange,
    checkboxType,
}: CheckboxTreeSubmenuProps) => {
    const onCheckboxChange = ({ target }: CheckboxChangeEvent) => {
        const allowedValues = map(options, "value");
        const optionIndex = agentsHighlighted.indexOf(target.value);
        const value = [...agentsHighlighted];
        if (optionIndex === -1) {
            value.push(target.value);
        } else {
            value.splice(optionIndex, 1);
        }

        const newValue = value
            .filter((val) => allowedValues.indexOf(val) !== -1)
            .sort((a, b) => {
                const indexA = options.findIndex((opt) => opt.value === a);
                const indexB = options.findIndex((opt) => opt.value === b);
                return indexA - indexB;
            });
        onChange(newValue);
    };
    return (
        <CheckboxGroup
            className={styles.container}
            value={agentsHighlighted || []}
            onChange={onChange}
        >
            {options.map(({ value }) => (
                <Checkbox
                    key={value as string}
                    value={value}
                    checkboxType={checkboxType}
                    checked={agentsHighlighted.includes(value as string)}
                    onChange={checkboxType ? onCheckboxChange : noop}
                />
            ))}
        </CheckboxGroup>
    );
};

export default CheckboxTreeSubmenu;
