import * as React from "react";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import classNames from "classnames";

import Checkbox from "../Checkbox";
import { CHECKBOX_TYPE_STAR } from "../../constants";
import { isUndefined } from "lodash";

import styles from "./style.css";
import { CHECK_ALL_BUTTON_TITLE } from "../AgentTree";

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

export default class SharedCheckbox extends React.Component<SharedCheckboxProps> {
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
            {
                [styles.checkbox]: checkboxType !== CHECKBOX_TYPE_STAR,
                ["header-checkbox"]: isHeader,
            },
        ]);

        return (
            <Checkbox
                indeterminate={isIndeterminate}
                onChange={this.onCheckAllChange}
                checked={checkedList.length === options.length}
                className={checkboxClassNames}
                checkboxType={checkboxType}
                checkboxLevel={
                    title === CHECK_ALL_BUTTON_TITLE ? "top" : "shared"
                }
            >
                {showLabel ? title : null}
            </Checkbox>
        );
    }
}
