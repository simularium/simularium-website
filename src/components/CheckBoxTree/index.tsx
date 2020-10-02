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
const LABEL_SPAN_NO = 5;
const styles = require("./style.css");

class CheckBoxTree extends React.Component<CheckBoxTreeProps> {
    onSubCheckboxChange = (key: string, values: string[]) => {
        const { handleAgentCheck } = this.props;
        handleAgentCheck({ [key]: values });
    };

    onSubHighlightChange = (key: string, values: string[]) => {
        const { handleHighlight } = this.props;
        handleHighlight({ [key]: values });
    };

    onTopLevelCheck = (checkedKeys: { [key: string]: string[] }) => {
        const { handleAgentCheck } = this.props;
        handleAgentCheck(checkedKeys);
    };

    toggleAllOnOff = (checkedKeys: { [key: string]: string[] }) => {
        const {
            setAgentsVisible,
            payloadForSelectNone,
            payloadForSelectAll,
        } = this.props;
        if (!checkedKeys.All.length) {
            setAgentsVisible(payloadForSelectNone);
        } else {
            setAgentsVisible(payloadForSelectAll);
        }
    };

    onTopLevelHighlightChange = (checkedKeys: { [key: string]: string[] }) => {
        const { handleHighlight } = this.props;
        handleHighlight(checkedKeys);
    };

    onAgentWithNoTagsChange = (event: CheckboxChangeEvent, title: string) => {
        event.preventDefault();
        if (event.target.checked) {
            this.onSubCheckboxChange(title, [title]);
        } else {
            this.onSubCheckboxChange(title, []);
        }
    };

    renderCheckAllButton = () => {
        const { agentsChecked, treeData, checkAllIsIntermediate } = this.props;
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
                    onTopLevelCheck={this.toggleAllOnOff}
                    indeterminate={checkAllIsIntermediate}
                    checkedList={checkedList}
                    isHeader={false}
                />
            </div>
        );
    };

    renderSharedCheckboxes = (nodeData: AgentDisplayNode) =>
        nodeData.children.length ? (
            <Row key="actions">
                <Col span={12}>
                    <SharedCheckbox
                        title={nodeData.title}
                        showLabel={false}
                        checkboxType={CHECKBOX_TYPE_STAR}
                        options={map(nodeData.children, "value" as string)}
                        onTopLevelCheck={this.onTopLevelHighlightChange}
                        checkedList={
                            this.props.agentsHighlighted[nodeData.title] || []
                        }
                        isHeader={true}
                    />
                </Col>
                <Col span={12}>
                    <SharedCheckbox
                        title={nodeData.title}
                        showLabel={false}
                        options={map(nodeData.children, "value" as string)}
                        onTopLevelCheck={this.onTopLevelCheck}
                        checkedList={
                            this.props.agentsChecked[nodeData.title] || []
                        }
                        isHeader={true}
                    />
                </Col>
            </Row>
        ) : (
            <Checkbox
                key={nodeData.title}
                onChange={(event) =>
                    this.onAgentWithNoTagsChange(event, nodeData.title)
                }
            >
                {nodeData.title}
            </Checkbox>
        );
    render() {
        const { agentsHighlighted, treeData, agentsChecked } = this.props;
        return treeData.length > 0 ? (
            <div className={styles.container}>
                <Row className={styles.colLabels}>
                    <Col span={CHECKBOX_SPAN_NO} offset={4}>
                        <label
                            className={classNames([
                                "icon-moon",
                                styles.starIcon,
                            ])}
                        />
                    </Col>
                    <Col span={CHECKBOX_SPAN_NO}>
                        <label>show</label>
                    </Col>
                    <Col flex={LABEL_SPAN_NO} offset={1}>
                        <label>type</label>
                    </Col>
                </Row>
                <TreeNode headerContent={this.renderCheckAllButton()} />
                {treeData.map((nodeData) => {
                    return (
                        <TreeNode
                            headerContent={
                                <>
                                    {this.renderSharedCheckboxes(nodeData)}{" "}
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
                                            agentsHighlighted[nodeData.title] ||
                                            []
                                        }
                                        checkboxType={CHECKBOX_TYPE_STAR}
                                        onChange={(values) =>
                                            this.onSubHighlightChange(
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
                                            this.onSubCheckboxChange(
                                                nodeData.title,
                                                values as string[]
                                            )
                                        }
                                    />
                                </Col>
                                <Col
                                    span={LABEL_SPAN_NO}
                                    offset={4}
                                    className={styles.checkboxLabels}
                                >
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
    }
}

export default CheckBoxTree;
