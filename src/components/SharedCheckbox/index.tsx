import * as React from "react";
import { Checkbox } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import StarCheckbox from "../StarCheckbox";

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
        const newCheckedList = event.target.checked ? options : [];
        onTopLevelCheck({ [title]: newCheckedList });
    }

    render() {
        const { showLabel, title, checkedList, options } = this.props;
        return (
            <StarCheckbox
                indeterminate={
                    !!checkedList.length && checkedList.length < options.length
                }
                onChange={this.onCheckAllChange}
                checked={checkedList.length === options.length}
                style={{
                    margin: "auto",
                }}
            >
                {showLabel ? title : ""}
            </StarCheckbox>
        );
    }
}
