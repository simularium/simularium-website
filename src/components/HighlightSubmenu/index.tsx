import React from "react";
import { Checkbox } from "antd";
import { CheckboxOptionType } from "antd/lib/checkbox";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
const CheckboxGroup = Checkbox.Group;

interface HighlightSubmenuProps {
    agentsHighlighted: string[];
    options: CheckboxOptionType[];
    onChange: (values: CheckboxValueType[]) => void;
}
const styles = require("./style.css");

const HighlightSubmenu = ({
    agentsHighlighted,
    options,
    onChange,
}: HighlightSubmenuProps) => {
    return (
        <CheckboxGroup
            className={styles.container}
            value={agentsHighlighted || []}
            onChange={onChange}
        >
            {options.map(({ value }) => (
                <Checkbox key={value} value={value} />
            ))}
        </CheckboxGroup>
    );
};

export default HighlightSubmenu;
