import { map } from "lodash";
import React from "react";
import { Form } from "antd";

import BaseInput from "../ConversionFormInput";
import CollectionInput from "../ConversionFormCollection";

import styles from "./style.css";

interface InputSwitchProps {
    handler: (path: string[], key: string, value: any) => void;
    id: string;
    templateData: { [key: string]: any };
    path: string[];
    parameter: { [key: string]: any };
    dataType: string;
}

const InputSwitch = (props: InputSwitchProps) => {
    const { dataType, templateData, parameter, handler, path, id } = props;

    const renderParameter = (
        currentDataType: string,
        key: string,
        currentParameter: any,
        recursive: boolean
    ) => {
        const data = templateData[currentDataType];
        if (currentDataType === "collection") {
            return (
                <CollectionInput
                    parameter={currentParameter}
                    templateData={templateData}
                    dataType={currentDataType}
                    name={currentParameter.name}
                    handler={handler}
                    path={path}
                    id={key}
                />
            );
        } else if (data.isBaseType) {
            return (
                <BaseInput
                    dataType={currentDataType}
                    options={currentParameter.options || []}
                    name={currentParameter.name}
                    handler={(value) => {
                        return handler(path, key, value);
                    }}
                />
            );
        } else if (recursive) {
            return (
                <InputSwitch
                    id={key}
                    parameter={currentParameter}
                    templateData={templateData}
                    dataType={currentDataType}
                    handler={handler}
                    path={[...path, key]}
                />
            );
        }
    };

    const hasChildren = !!templateData[dataType].parameters;

    const fields = hasChildren
        ? map(templateData[dataType].parameters, (childParameter, key) => {
              const currentDataType = childParameter.data_type;
              return renderParameter(
                  currentDataType,
                  key,
                  childParameter,
                  true
              );
          })
        : [renderParameter(dataType, id, parameter, false)].filter(Boolean);

    return (
        <div className={styles.container}>
            <Form
                labelCol={{ offset: 4 }}
                className={styles.form}
                layout="horizontal"
            >
                <div className={styles.menuWrapper}>
                    <div className={styles.collectionMenuRight}>
                        <>{fields}</>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default InputSwitch;
