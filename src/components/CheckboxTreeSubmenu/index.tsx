import React from "react";
import { Checkbox } from "antd";
import { CheckboxOptionType } from "antd/lib/checkbox";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
const CheckboxGroup = Checkbox.Group;

interface CheckboxTreeSubmenuProps {
    agentsHighlighted: string[];
    options: CheckboxOptionType[];
    onChange: (values: CheckboxValueType[]) => void;
}
const styles = require("./style.css");

const CheckboxTreeSubmenu = ({
    agentsHighlighted,
    options,
    onChange,
}: CheckboxTreeSubmenuProps) => {
    return (
        <CheckboxGroup
            className={styles.container}
            value={agentsHighlighted || []}
            onChange={onChange}
        >
            {options.map(({ value }) => (
                <Checkbox key={value as string} value={value} />
            ))}
        </CheckboxGroup>
    );
};

export default CheckboxTreeSubmenu;
