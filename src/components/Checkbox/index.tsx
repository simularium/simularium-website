import * as React from "react";
import { Checkbox as AntdCheckbox, Tooltip } from "antd";
import { CheckboxProps } from "antd/lib/checkbox";

import StarCheckbox from "../StarCheckbox";
import {
    CHECKBOX_TYPE_STAR,
    LEFT_PANEL_TOOLTIP_DELAY,
    TOOLTIP_COLOR,
} from "../../constants";

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
    default: [0, -3],
    top: [0, -3],
    shared: [0, -3],
};

const Checkbox = (props: CheckboxTypeProps): JSX.Element => {
    // removing props that are only needed at this level
    const childProps = { ...props, checkboxType: null, checkboxLevel: null };
    const checkboxLevel = props.checkboxLevel ? props.checkboxLevel : "default";

    if (props.checkboxType === CHECKBOX_TYPE_STAR) {
        /* 
        Wrapping the StarCheckbox in a Tooltip component as done below for AntdCheckbox
        doesn't work (tooltips don't appear). May be due to this requirement not being met:
        https://ant.design/components/tooltip/#Note. So we wrap the input element
        inside the StarCheckbox component with a Tooltip component instead. Good thing is,
        wrapping the input element with Tooltip aligns the tooltip perfectly above the star,
        so we don't have to manually align it as we have done for the AntdCheckbox tooltip below.
        */
        return <StarCheckbox {...childProps} />;
    }
    return (
        <Tooltip
            title={props.checked ? "Hide" : "Show"}
            placement="top"
            mouseEnterDelay={LEFT_PANEL_TOOLTIP_DELAY}
            // Position tooltip with alignConfig object: https://github.com/yiminghe/dom-align#usage
            align={{ offset: tooltipOffsets[checkboxLevel] }}
            color={TOOLTIP_COLOR}
        >
            <AntdCheckbox {...childProps} />
        </Tooltip>
    );
};

export default Checkbox;
