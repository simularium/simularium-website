import * as React from "react";
import { Checkbox } from "antd";
import { filter, map } from "lodash";
import { CheckboxValueType } from "antd/lib/checkbox/Group";

interface CheckBoxesProps {
    options: string[];
    onChange: (checked: CheckboxValueType[]) => void;
    values: string[];
    title: string;
}

export default class CheckBoxes extends React.Component<CheckBoxesProps, {}> {
    public render(): JSX.Element {
        const { options, onChange, values, title } = this.props;
        const checkStyle = {
            display: "block",
            height: "30px",
            lineHeight: "30px",
            marginLeft: 0,
        };
        return (
            <div>
                <h4>{title}</h4>
                <Checkbox.Group value={values} onChange={onChange}>
                    {options.map((ele) => (
                        <Checkbox style={checkStyle} value={ele}>
                            {ele}
                        </Checkbox>
                    ))}
                </Checkbox.Group>
            </div>
        );
    }
}
