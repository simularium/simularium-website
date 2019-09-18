import * as React from "react";
import { Checkbox } from "antd";
import { filter, map } from "lodash";
import { CheckboxValueType } from "antd/lib/checkbox/Group";

interface CheckBoxesProps {
    options: string[];
    onChange: (checked: CheckboxValueType[]) => void;
    values: string[];
}

export default class CheckBoxes extends React.Component<CheckBoxesProps, {}> {
    public render(): JSX.Element {
        const { options, onChange, values } = this.props;
        return (
            <div>
                <Checkbox.Group
                    options={options}
                    value={values}
                    onChange={onChange}
                />
            </div>
        );
    }
}
