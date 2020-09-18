import * as React from "react";
import { Checkbox } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";

interface SharedCheckboxProps {
    options: string[];
    onTopLevelCheck: any;
    title: string;
    checkedList: string[];
    showLabel: boolean;
}

export default class SharedCheckbox extends React.Component<
    SharedCheckboxProps,
    {}
> {
    constructor(props: SharedCheckboxProps) {
        super(props);
        this.onCheckAllChange = this.onCheckAllChange.bind(this);
    }

    onCheckAllChange(event: CheckboxChangeEvent) {
        const { options, onTopLevelCheck, title } = this.props;
        event.preventDefault();
        event.target.checked
            ? onTopLevelCheck({
                  [title]: options,
              })
            : onTopLevelCheck({
                  [title]: [],
              });
    }

    render() {
        const { showLabel, title, checkedList, options } = this.props;
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
                {showLabel ? title : ""}
            </Checkbox>
        );
    }
}
