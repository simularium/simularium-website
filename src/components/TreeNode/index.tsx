import React, { ReactNode, useState } from "react";
import { Button } from "antd";
import { CheckboxValueType } from "antd/lib/checkbox/Group";

interface TreeNodeProps extends React.PropsWithChildren<any> {
    actions?: ReactNode[];
    headerContent: (values: CheckboxValueType[]) => void;
}
// const styles = require("./style.css");

const TreeNode = ({ children, actions = [], headerContent }: TreeNodeProps) => {
    const [isExpanded, setExpanded] = useState<boolean>(false);

    const onToggle = () => {
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        setExpanded(!isExpanded);
    };
    return (
        <div>
            <header>
                {actions.length > 0 &&
                    actions.map((button) => (
                        <div key={button.key}>{button}</div>
                    ))}
                <Button onClick={onToggle}>toggle</Button>
                {headerContent}
            </header>
            {isExpanded && <div className="panel">{children}</div>}
        </div>
    );
};

export default TreeNode;
