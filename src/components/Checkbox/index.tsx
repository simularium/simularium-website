import * as React from "react";
import { Checkbox as AntdCheckbox, Tooltip } from "antd";
import { CheckboxProps } from "antd/lib/checkbox";

import StarCheckbox from "../StarCheckbox";
import { CHECKBOX_TYPE_STAR, LEFT_PANEL_TOOLTIP_DELAY } from "../../constants";

interface CheckboxTypeProps extends CheckboxProps {
    checkboxType?: CHECKBOX_TYPE_STAR;
    checkboxLevel?: keyof TooltipOffsets;
}

interface TooltipOffsets {
    default: number[];
    top: number[];
    shared: number[];
}

const tooltipOffsets: TooltipOffsets = {
    default: [-11, -1],
    top: [-22, -3],
    shared: [-8, 8],
};

const Checkbox: React.FunctionComponent<CheckboxTypeProps> = (
    props: CheckboxTypeProps
) => {
    // removing props that are only needed at this level
    const childProps = { ...props, checkboxType: null, checkboxLevel: null };
    const checkboxLevel = props.checkboxLevel ? props.checkboxLevel : "default";

    if (props.checkboxType === CHECKBOX_TYPE_STAR) {
        return <StarCheckbox {...childProps} />;
    }
    return (
        <Tooltip
            title={props.checked ? "Hide" : "Show"}
            placement="top"
            mouseEnterDelay={LEFT_PANEL_TOOLTIP_DELAY}
            // Position tooltip with alignConfig object: https://github.com/yiminghe/dom-align#usage
            align={{ offset: tooltipOffsets[checkboxLevel] }}
        >
            <AntdCheckbox {...childProps} />
        </Tooltip>
    );
};

export default Checkbox;
