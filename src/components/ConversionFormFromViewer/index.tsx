import { map } from "lodash";
import React from "react";
import InputSwitch from "./InputSwitch";
import {
    AvailableEngines,
    TemplateMap,
} from "../../state/trajectory/conversion-data-types";
import { Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";

import styles from "./style.css";
import {
    CustomParameter,
    CustomType,
} from "../../state/trajectory/conversion-data-types";

const { Panel } = Collapse;

interface InputFormProps {
    // template: { [key: string]: any };
    // templateData: { [key: string]: any };
    // type: string;
    // submitFile: (data: any) => void;
    // onReturned: () => void;
    conversionProcessingData: {
        template: CustomType;
        templateMap: TemplateMap;
        preConvertedFile: string;
        engineType: AvailableEngines;
    };
}

class InputForm extends React.Component<InputFormProps> {
    constructor(props: InputFormProps) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(path: string[], key: string, value: any) {
        // let newState: any = {};
        // if (path.length == 0) {
        //     newState = {
        //         ...this.state[key],
        //         [key] : value
        //     }
        // } else {
        //     // convert the paths into a nested object
        //     // make sure to copy any existing state at each level
        //     let tempObject = newState;
        //     let currentState = this.state[path[0]] || {};
        //     path.map((nestedKey: string, i: number, array: string[]) => {
        //         let thisValue;
        //         if (i == array.length - 1) {
        //             thisValue = {
        //                 ...currentState,
        //                 [key]: value,
        //             };
        //         } else {
        //             thisValue = { ...currentState };
        //             currentState = currentState[array[i + 1]] || {};
        //         }
        //         tempObject = tempObject[nestedKey] = thisValue;
        //     });
        // }
        // this.setState(newState);
        //calling to remove linting error
        this.handleChange(path, key, value);
    }

    handleSubmit(event: any) {
        // event.preventDefault();
        // const payload = {
        //     ...this.state,
        // };
        // console.log("submitting", payload);
        // this.props.submitFile(payload)
        //calling to remove linting error
        this.handleSubmit(event);
    }

    render() {
        const { template, templateMap: templateData } =
            this.props.conversionProcessingData;
        const { parameters } = template;
        console.log("TEMPLATE", template);
        if (templateData) {
            return (
                <div>
                    <Collapse
                        accordion
                        className={styles.collapse}
                        bordered={false}
                        expandIcon={({ isActive }) => (
                            <CaretRightOutlined
                                style={{ fontSize: "16px", color: "#08c" }}
                                rotate={isActive ? 90 : 0}
                            />
                        )}
                    >
                        {map(
                            parameters,
                            (
                                parameter: CustomParameter,
                                key: string
                            ): JSX.Element | null => {
                                const dataType = parameter.data_type;
                                if (
                                    dataType === "file" ||
                                    dataType === "meta_data"
                                ) {
                                    return null;
                                }
                                if (templateData[dataType]) {
                                    return (
                                        <Panel
                                            header={parameter.description}
                                            key={key}
                                            className={styles.panel}
                                        >
                                            <InputSwitch
                                                handler={this.handleChange}
                                                id={key}
                                                templateData={templateData}
                                                parameter={parameter}
                                                dataType={dataType}
                                                path={[key]}
                                            />
                                        </Panel>
                                    );
                                }
                                return null;
                            }
                        )}
                        <Panel
                            key="placeholder"
                            header=""
                            showArrow={false}
                            collapsible="disabled"
                        ></Panel>
                    </Collapse>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default InputForm;
