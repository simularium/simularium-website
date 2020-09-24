import React, { ReactNode, useState } from "react";
import { Button } from "antd";
import { noop } from "lodash";
import classNames from "classnames";

import { CaretRight } from "../Icons";

import collapseAnimation from "./collapseMotion";

interface TreeNodeProps extends React.PropsWithChildren<any> {
    actions?: ReactNode[];
    headerContent: ReactNode;
}
const styles = require("./style.css");

const TreeNode = ({
    children,
    actions = [],
    headerContent,
}: TreeNodeProps): JSX.Element => {
    const [isExpanded, setExpanded] = useState<boolean>(false);
    const ref = React.createRef<HTMLDivElement>();
    const onToggle = () => {
        const isOpening = !isExpanded;
        setExpanded(!isExpanded);
        if (isOpening && ref.current) {
            collapseAnimation.enter(ref.current, noop);
        } else if (ref.current) {
            collapseAnimation.leave(ref.current, noop);
        }
    };
    const buttonClassNames = classNames(styles.toggleButton, {
        [styles.active]: isExpanded,
    });
    const panelClassNames = classNames(styles.panel, {
        [styles.active]: isExpanded,
    });
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                {actions.length > 0 && actions.map((button) => button)}
                <Button
                    className={buttonClassNames}
                    ghost
                    shape="circle"
                    icon={CaretRight}
                    onClick={onToggle}
                />
                {headerContent}
            </header>
            <div ref={ref} className={panelClassNames}>
                {children}
            </div>
        </div>
    );
};

export default TreeNode;
