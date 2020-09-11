import * as React from "react";
import { ActionCreator } from "redux";
import { Modal, Button } from "antd";

import TRAJECTORIES from "../../constants/networked-trajectories";
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
                    {TRAJECTORIES.map((trajectory) => (
                        <Button
                            key={trajectory.id}
                            onClick={() => selectFile(`${trajectory.id}.h5`)}
                        >
                            {trajectory.id}
                        </Button>
                    ))}
                </Modal>
            </div>
        );
    }
}

export default LoadTrajectoryFileModal;
