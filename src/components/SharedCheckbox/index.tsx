import * as React from "react";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import Checkbox from "../Checkbox";
import { CHECKBOX_TYPE_STAR } from "../../constants";

const styles = require("./style.css");

interface SharedCheckboxProps {
    options: string[];
    onTopLevelCheck: any;
    title: string;
    checkedList: string[];
    showLabel: boolean;
    checkboxType?: CHECKBOX_TYPE_STAR;
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
        const {
            showLabel,
            title,
            checkedList,
            options,
            checkboxType,
        } = this.props;
        return (
            <Checkbox
                indeterminate={
                    !!checkedList.length && checkedList.length < options.length
                }
                onChange={this.onCheckAllChange}
                checked={checkedList.length === options.length}
                style={{
                    margin: "auto",
                }}
                className={[styles.container, "header-checkbox"].join(" ")}
                checkboxType={checkboxType}
            >
                {showLabel ? title : ""}
            </Checkbox>
        );
    }
}
