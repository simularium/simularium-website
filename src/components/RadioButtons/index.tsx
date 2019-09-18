import * as React from "React";
import { Radio, Input } from "antd";
import { AnyAction } from "redux";
import { RadioChangeEvent } from "antd/lib/radio";

interface RadioButtonsProps {
    options: string[];
    value: string;
    onChange: (value: any) => AnyAction;
}

export default class RadioButtons extends React.Component<RadioButtonsProps> {
    state = {
        value: 1,
    };
    constructor(props: RadioButtonsProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e: RadioChangeEvent) {
        const { onChange } = this.props;
        onChange(e.target.value);
    }

    render() {
        const { options, value } = this.props;

        const radioStyle = {
            display: "block",
            height: "30px",
            lineHeight: "30px",
        };

        return (
            <Radio.Group onChange={this.handleChange} value={value}>
                {options.map((ele) => (
                    <Radio style={radioStyle} value={ele} key={ele}>
                        {ele}
                    </Radio>
                ))}
            </Radio.Group>
        );
    }
}
