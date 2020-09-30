import React from "react";
import { Col, Row } from "antd";
import { ActionCreator } from "redux";
import { CheckboxChangeEvent, CheckboxOptionType } from "antd/lib/checkbox";
import { map, filter } from "lodash";
import classNames from "classnames";

import {
    ChangeAgentsRenderingStateAction,
    SetVisibleAction,
    VisibilitySelectionMap,
} from "../../state/selection/types";
import SharedCheckbox from "../SharedCheckbox";
import CheckboxTreeSubmenu from "../CheckboxTreeSubmenu";
import TreeNode from "../TreeNode";
import Checkbox from "../Checkbox";
import { CHECKBOX_TYPE_STAR } from "../../constants";

export interface AgentDisplayNode {
    title: string;
    key: string;
    children: CheckboxOptionType[];
}

interface CheckBoxTreeProps {
    treeData: AgentDisplayNode[];
    agentsChecked: VisibilitySelectionMap;
    agentsHighlighted: VisibilitySelectionMap;
    handleAgentCheck: ActionCreator<ChangeAgentsRenderingStateAction>;
    handleHighlight: ActionCreator<ChangeAgentsRenderingStateAction>;
    setAgentsVisible: ActionCreator<SetVisibleAction>;
    payloadForSelectAll: VisibilitySelectionMap;
    payloadForSelectNone: VisibilitySelectionMap;
    checkAllIsIntermediate: boolean;
}
const CHECKBOX_SPAN_NO = 2;
const styles = require("./style.css");

const CheckBoxTree = ({
    agentsChecked,
    agentsHighlighted,
    treeData,
    handleAgentCheck,
    handleHighlight,
    setAgentsVisible,
    payloadForSelectAll,
    payloadForSelectNone,
    checkAllIsIntermediate,
}: CheckBoxTreeProps): JSX.Element => {
    const onSubCheckboxChange = (key: string, values: string[]) => {
        handleAgentCheck({ [key]: values });
    };

    const onSubHighlightChange = (key: string, values: string[]) => {
        handleHighlight({ [key]: values });
    };

    const onTopLevelCheck = (checkedKeys: { [key: string]: string[] }) => {
        handleAgentCheck(checkedKeys);
    };

    const toggleAllOnOff = (checkedKeys: { [key: string]: string[] }) => {
        if (!checkedKeys.All.length) {
            setAgentsVisible(payloadForSelectNone);
        } else {
            console.log("PAYLOAD FOR SELECT ALL", payloadForSelectAll);
            setAgentsVisible(payloadForSelectAll);
        }
    };

    const onTopLevelHighlightChange = (checkedKeys: {
        [key: string]: string[];
    }) => {
        handleHighlight(checkedKeys);
    };

    const onAgentWithNoTagsChange = (
        event: CheckboxChangeEvent,
        title: string
    ) => {
        event.preventDefault();
        if (event.target.checked) {
            onSubCheckboxChange(title, [title]);
        } else {
            onSubCheckboxChange(title, []);
        }
    };

    const renderCheckAllButton = () => {
        const checkedList = filter(
            map(
                agentsChecked,
                (value, key): string => (value.length ? key : "")
            )
        );

        return (
            <div className={styles.checkAllCheckbox}>
                <SharedCheckbox
                    title="All"
                    showLabel={true}
                    options={map(treeData, "key" as string)}
                    onTopLevelCheck={toggleAllOnOff}
                    indeterminate={checkAllIsIntermediate}
                    checkedList={checkedList}
                    isHeader={false}
                />
            </div>
        );
    };

    const renderSharedCheckboxes = (nodeData: AgentDisplayNode) =>
        nodeData.children.length ? (
            <Row key="actions">
                <Col span={12}>
                    <SharedCheckbox
                        title={nodeData.title}
                        showLabel={false}
                        checkboxType={CHECKBOX_TYPE_STAR}
                        options={map(nodeData.children, "value" as string)}
                        onTopLevelCheck={onTopLevelHighlightChange}
                        checkedList={agentsHighlighted[nodeData.title] || []}
                        isHeader={true}
                    />
                </Col>
                <Col span={12}>
                    <SharedCheckbox
                        title={nodeData.title}
                        showLabel={false}
                        options={map(nodeData.children, "value" as string)}
                        onTopLevelCheck={onTopLevelCheck}
                        checkedList={agentsChecked[nodeData.title] || []}
                        isHeader={true}
                    />
                </Col>
            </Row>
        ) : (
            <Checkbox
                key={nodeData.title}
                onChange={(event) =>
                    onAgentWithNoTagsChange(event, nodeData.title)
                }
            >
                {nodeData.title}
            </Checkbox>
        );

    return treeData.length > 0 ? (
        <div className={styles.container}>
            <Row className={styles.colLabels}>
                <Col span={CHECKBOX_SPAN_NO} offset={4}>
                    <label
                        className={classNames(["icon-moon", styles.starIcon])}
                    />
                </Col>
                <Col span={CHECKBOX_SPAN_NO}>
                    <label>show</label>
                </Col>
                <Col flex={5} offset={1}>
                    <label>type</label>
                </Col>
            </Row>
            <TreeNode headerContent={renderCheckAllButton()} />
            {treeData.map((nodeData) => {
                return (
                    <TreeNode
                        headerContent={
                            <>
                                {renderSharedCheckboxes(nodeData)}{" "}
                                <label className={styles.headerLabel}>
                                    {nodeData.title}
                                </label>
                            </>
                        }
                        key={nodeData.key}
                    >
                        <Row className={styles.subMenu}>
                            <Col span={CHECKBOX_SPAN_NO} offset={3}>
                                <CheckboxTreeSubmenu
                                    options={nodeData.children}
                                    checkedAgents={
                                        agentsHighlighted[nodeData.title] || []
                                    }
                                    checkboxType={CHECKBOX_TYPE_STAR}
                                    onChange={(values) =>
                                        onSubHighlightChange(
                                            nodeData.title,
                                            values as string[]
                                        )
                                    }
                                />
                            </Col>
                            <Col span={CHECKBOX_SPAN_NO}>
                                <CheckboxTreeSubmenu
                                    options={nodeData.children}
                                    checkedAgents={
                                        agentsChecked[nodeData.title] || []
                                    }
                                    onChange={(values) =>
                                        onSubCheckboxChange(
                                            nodeData.title,
                                            values as string[]
                                        )
                                    }
                                />
                            </Col>
                            <Col span={5} offset={4} className={styles.label}>
                                {nodeData.children.map((value) => {
                                    return (
                                        <label
                                            className={styles.rowLabel}
                                            key={value.value as string}
                                        >
                                            {value.label}
                                        </label>
                                    );
                                })}
                            </Col>
                        </Row>
                    </TreeNode>
                );
            })}
        </div>
    ) : (
        <div>Load file</div>
    );
};

export default CheckBoxTree;
