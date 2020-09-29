import * as React from "react";
import classNames from "classnames";
import { Checkbox as AntdCheckbox } from "antd";
import { CheckboxProps } from "antd/lib/checkbox";

import StarCheckbox from "../StarCheckbox";

interface CheckboxTypeProps extends CheckboxProps {
    checkboxType?: string;
}
const Checkbox: React.FunctionComponent<CheckboxTypeProps> = (
    props: CheckboxTypeProps
) => {
    if (props.checkboxType === "star") {
        return <StarCheckbox {...props} />;
    }
    return <AntdCheckbox {...props} />;
};

export default Checkbox;
