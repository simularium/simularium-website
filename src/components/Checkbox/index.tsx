import * as React from "react";
import { Checkbox as AntdCheckbox } from "antd";
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
    return <AntdCheckbox {...childProps} />;
};

export default Checkbox;
