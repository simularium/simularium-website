import React, { useState } from "react";
import { Checkbox, Collapse, Col, Row } from "antd";
import { ActionCreator } from "redux";
import { CheckboxChangeEvent, CheckboxOptionType } from "antd/lib/checkbox";
import { map } from "lodash";

import {
    ChangeAgentsRenderingStateAction,
    VisibilitySelectionMap,
} from "../../state/selection/types";
import SharedCheckbox from "../SharedCheckbox";
import HighlightSubmenu from "../HighlightSubmenu";
import TreeNode from "../TreeNode";

const CheckboxGroup = Checkbox.Group;

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
}

const styles = require("./style.css");

const CheckBoxTree = ({
    agentsChecked,
    agentsHighlighted,
    treeData,
    handleAgentCheck,
    handleHighlight,
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
    console.log("AGENTS CHECKED", agentsChecked);
    return treeData.length > 0 ? (
        <div className={styles.container}>
            {treeData.map((data) => {
                return (
                    <TreeNode
                        actions={
                            data.children.length
                                ? [
                                      <Row key="actions">
                                          <Col flex={1}>
                                              <SharedCheckbox
                                                  title={data.title}
                                                  showLabel={false}
                                                  options={map(
                                                      data.children,
                                                      "value" as string
                                                  )}
                                                  onTopLevelCheck={
                                                      onTopLevelHighlightChange
                                                  }
                                                  checkedList={
                                                      agentsHighlighted[
                                                          data.title
                                                      ] || []
                                                  }
                                              />
                                          </Col>
                                          <Col flex={1}>
                                              <SharedCheckbox
                                                  title={data.title}
                                                  showLabel={false}
                                                  options={map(
                                                      data.children,
                                                      "value" as string
                                                  )}
                                                  onTopLevelCheck={
                                                      onTopLevelCheck
                                                  }
                                                  checkedList={
                                                      agentsChecked[
                                                          data.title
                                                      ] || []
                                                  }
                                              />
                                          </Col>
                                      </Row>,
                                  ]
                                : [
                                      <Checkbox
                                          key={data.title}
                                          onChange={(event) =>
                                              onAgentWithNoTagsChange(
                                                  event,
                                                  data.title
                                              )
                                          }
                                      >
                                          {data.title}
                                      </Checkbox>,
                                  ]
                        }
                        headerContent={<label>{data.title}</label>}
                        // headerContent={
                        //     data.children.length ? (
                        //         <Row>
                        //             <Col span={3}>
                        //                 <SharedCheckbox
                        //                     title={data.title}
                        //                     showLabel={false}
                        //                     options={map(
                        //                         data.children,
                        //                         "value" as string
                        //                     )}
                        //                     onTopLevelCheck={
                        //                         onTopLevelHighlightChange
                        //                     }
                        //                     checkedList={
                        //                         agentsHighlighted[
                        //                             data.title
                        //                         ] || []
                        //                     }
                        //                 />
                        //             </Col>
                        //             <Col span={20}>
                        //                 <SharedCheckbox
                        //                     title={data.title}
                        //                     showLabel
                        //                     options={map(
                        //                         data.children,
                        //                         "value" as string
                        //                     )}
                        //                     onTopLevelCheck={
                        //                         onTopLevelCheck
                        //                     }
                        //                     checkedList={
                        //                         agentsChecked[
                        //                             data.title
                        //                         ] || []
                        //                     }
                        //                 />
                        //             </Col>
                        //         </Row>
                        //     ) : (
                        //         <Checkbox
                        //             onChange={(event) =>
                        //                 onAgentWithNoTagsChange(
                        //                     event,
                        //                     data.title
                        //                 )
                        //             }
                        //         >
                        //             {data.title}
                        //         </Checkbox>
                        //     )
                        // }
                        key={data.key}
                    >
                        <Row className={styles.subMenu}>
                            <Col span={2}>
                                <HighlightSubmenu
                                    options={data.children}
                                    agentsHighlighted={
                                        agentsHighlighted[data.title] || []
                                    }
                                    onChange={(values) =>
                                        onSubHighlightChange(
                                            data.title,
                                            values as string[]
                                        )
                                    }
                                />
                            </Col>
                            <Col span={2}>
                                <HighlightSubmenu
                                    options={data.children}
                                    agentsHighlighted={
                                        agentsChecked[data.title] || []
                                    }
                                    onChange={(values) =>
                                        onSubCheckboxChange(
                                            data.title,
                                            values as string[]
                                        )
                                    }
                                />

                                {/* <CheckboxGroup
                                className={styles.visibilityMenu}
                                options={data.children}
                                value={
                                    agentsChecked[data.title] || []
                                }
                                onChange={(values) =>
                                    onSubCheckboxChange(
                                        data.title,
                                        values as string[]
                                    )
                                }
                            /> */}
                            </Col>
                            <Col span={5} offset={5} className={styles.label}>
                                {data.children.map((value) => {
                                    return (
                                        <label
                                            className={styles.rowLabel}
                                            key={value.value}
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
