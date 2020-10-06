import * as React from "react";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import classNames from "classnames";

import Checkbox from "../Checkbox";
import { CHECKBOX_TYPE_STAR } from "../../constants";
import { isUndefined } from "lodash";

const styles = require("./style.css");

interface SharedCheckboxProps {
    options: string[];
    onTopLevelCheck: any;
    title: string;
    checkedList: string[];
    showLabel: boolean;
    checkboxType?: CHECKBOX_TYPE_STAR;
    indeterminate?: boolean;
    isHeader: boolean;
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
            indeterminate,
            isHeader,
        } = this.props;

        const isIndeterminate = !isUndefined(indeterminate)
            ? indeterminate
            : !!checkedList.length && checkedList.length < options.length;
        const checkboxClassNames = classNames([
            styles.container,
            { [styles.header]: isHeader, ["header-checkbox"]: isHeader },
        ]);
        return (
            <Checkbox
                indeterminate={isIndeterminate}
                onChange={this.onCheckAllChange}
                checked={checkedList.length === options.length}
                style={{
                    margin: "auto",
                }}
                className={checkboxClassNames}
                checkboxType={checkboxType}
            >
                {showLabel ? title : ""}
            </Checkbox>
        );
    }
}
