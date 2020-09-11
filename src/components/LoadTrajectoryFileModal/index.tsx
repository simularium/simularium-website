import * as React from "react";
import { ActionCreator } from "redux";
import { Modal, Button } from "antd";

import { TRAJECTORY_FILES } from "../../constants";
import { ToggleAction } from "../../state/selection/types";

interface LoadTrajectoryFileModalProps {
    visible: boolean;
    selectFile: (newFile: string) => void;
    closeModal: ActionCreator<ToggleAction>;
}

class LoadTrajectoryFileModal extends React.Component<
    LoadTrajectoryFileModalProps
> {
    render() {
        const { visible, closeModal, selectFile } = this.props;

        return (
            <div>
                <Modal
                    title="Choose a trajectory file"
                    visible={visible}
                    onOk={closeModal}
                    onCancel={closeModal}
                >
                    {TRAJECTORY_FILES.map((fileName) => (
                        <Button
                            key={fileName}
                            onClick={() => selectFile(`${fileName}.h5`)}
                        >
                            {fileName}
                        </Button>
                    ))}
                </Modal>
            </div>
        );
    }
}

export default LoadTrajectoryFileModal;
