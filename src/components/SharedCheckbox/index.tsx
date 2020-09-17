import * as React from "react";
import { Checkbox } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";

interface SharedCheckboxProps {
    options: string[];
    onTopLevelCheck: any;
    title: string;
    checkedList: string[];
}

export default class SharedCheckbox extends React.Component<
    SharedCheckboxProps,
    {}
> {
    constructor(props: SharedCheckboxProps) {
        super(props);
        this.onCheckAllChange = this.onCheckAllChange.bind(this);
    }

    onCheckAllChange(Event: CheckboxChangeEvent) {
        const { options, onTopLevelCheck, title } = this.props;
        Event.preventDefault();
        Event.target.checked
            ? onTopLevelCheck({
                  [title]: options,
              })
            : onTopLevelCheck({
                  [title]: [],
              });
    }

    render() {
        const { title, checkedList, options } = this.props;
        return (
            <Checkbox
                indeterminate={
                    !!checkedList.length && checkedList.length < options.length
                }
                onChange={this.onCheckAllChange}
                checked={checkedList.length === options.length}
                style={{
                    margin: "auto",
                    width: 120,
                }}
            >
                {title}
            </Checkbox>
        );
    }
}
