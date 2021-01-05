import * as React from "react";
import { Checkbox as AntdCheckbox, Tooltip } from "antd";
import { CheckboxProps } from "antd/lib/checkbox";

import StarCheckbox from "../StarCheckbox";
import { CHECKBOX_TYPE_STAR } from "../../constants";

interface CheckboxTypeProps extends CheckboxProps {
    checkboxType?: CHECKBOX_TYPE_STAR;
}

const Checkbox: React.FunctionComponent<CheckboxTypeProps> = (
    props: CheckboxTypeProps
) => {
    const childProps = { ...props, checkboxType: null }; // removing prop that is only needed at this level
    if (props.checkboxType === CHECKBOX_TYPE_STAR) {
        return <StarCheckbox {...childProps} />;
    }
    return (
        <Tooltip
            title={props.checked ? "Hide" : "Show"}
            placement="top"
            mouseEnterDelay={1}
        >
            <AntdCheckbox {...childProps} />
        </Tooltip>
    );
};

export default Checkbox;
