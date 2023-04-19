import { map, reduce } from "lodash";
import React from "react";
import BaseInput from "./BaseInput";
import { CustomParameter } from "../../state/trajectory/conversion-data-types";
import styles from "./style.css";
import { Delete } from "../Icons";
import { Button } from "antd";

interface CollectionParameter extends CustomParameter {
    length: number;
    extendible: boolean;
    key_item: CustomParameter;
    value_item: CustomParameter;
}

interface CollectionInputProps {
    handler: (path: string[], key: string, value: any) => void;
    id: string;
    templateData: { [key: string]: any };
    name: string;
    path: string[];
    parameter: CollectionParameter;
    dataType: string;
}

interface CollectionState {
    length: number;
    [key: number]: any;
}

class CollectionInput extends React.Component<
    CollectionInputProps,
    CollectionState
> {
    constructor(props: CollectionInputProps) {
        super(props);
        this.state = {
            length: props.parameter.length,
        };
        this.handleChange = this.handleChange.bind(this);
        this.addItem = this.addItem.bind(this);
    }

    handleChange(
        key: string,
        index: number,
        type: "key" | "value",
        targetValue: any
    ) {
        const { handler, id } = this.props;
        const newState = { ...this.state };
        if (!newState[index]) {
            newState[index] = {
                key: "",
                value: {},
            };
        }
        if (type === "key") {
            newState[index] = {
                ...newState[index],
                [type]: targetValue,
            };
        } else {
            newState[index] = {
                ...newState[index],
                [type]: {
                    ...newState[index][type],
                    [key]: targetValue,
                },
            };
        }
        this.setState(newState);
        const newValues = reduce(
            newState,
            (acc, cur: { key: any; value: any }) => {
                const key = cur.key;
                const value = cur.value;
                acc[key] = value;
                return acc;
            },
            {} as Record<string, any>
        );
        handler([id], index.toString(), newValues);
    }

    renderValueItem = (
        childItem: CustomParameter,
        newPath: any,
        index: any,
        type: any
    ): any => {
        const { templateData } = this.props;
        const currentDataType = childItem.data_type;
        const data = templateData[childItem.data_type];

        if (data.isBaseType) {
            return (
                <BaseInput
                    options={childItem.options || []}
                    dataType={currentDataType}
                    name={childItem.name}
                    handler={(value) =>
                        this.handleChange(
                            newPath[newPath.length - 1],
                            index,
                            type,
                            value
                        )
                    }
                />
            );
        } else if (data.parameters) {
            return map(data.parameters, (childParameter, key) => {
                return this.renderValueItem(
                    childParameter,
                    [...newPath, key],
                    index,
                    type
                );
            });
        }
    };

    addItem() {
        const index = this.state.length + 1;
        this.setState({ length: index });
    }

    render() {
        const { name, path, parameter } = this.props;
        const jsx = [] as JSX.Element[];
        for (let index = 0; index < this.state.length; index++) {
            jsx.push(
                <div key={index} className={styles.collectionMenu}>
                    <div
                        className={styles.icon}
                        onClick={() => {
                            // TODO make this function
                        }}
                    >
                        {Delete}
                    </div>
                    <div className={styles.collectionMenuLeft}>
                        {this.renderValueItem(
                            parameter.key_item,
                            path,
                            index,
                            "key"
                        )}
                        <div />
                    </div>
                    <div className={styles.collectionMenuRight}>
                        {this.renderValueItem(
                            parameter.value_item,
                            path,
                            index,
                            "value"
                        )}
                    </div>
                </div>
            );
        }
        if (parameter.extendible) {
            jsx.push(
                <Button type="default" key={name} onClick={this.addItem}>
                    Add new +
                </Button>
            );
        }
        return jsx;
    }
}

export default CollectionInput;
