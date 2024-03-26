import { Button } from "antd";
import React from "react";

import CustomModal from "../CustomModal";

interface RecordMoviesModalProps {
    setModalVisible: (isModalVisible: boolean) => void;
    downloadMovie: () => void;
    duration: number;
}

const RecordMoviesModal: React.FC<RecordMoviesModalProps> = ({
    setModalVisible,
    downloadMovie,
    duration,
}) => {
    const closeModal = () => {
        setModalVisible(false);
    };

    const completeDownload = () => {
        downloadMovie();
        closeModal();
    };

    const footerButtons = (
        <>
            <Button className="primary-button" onClick={closeModal}>
                Cancel
            </Button>
            <Button className="secondary-button" onClick={completeDownload}>
                Save
            </Button>
        </>
    );

    const getFormattedDuration = (durationInSeconds: number): string => {
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        const secs = Math.ceil(durationInSeconds) % 60;

        const minutesStr = minutes.toString().padStart(2, "0");
        const secondsStr = secs.toString().padStart(2, "0");

        return `${minutesStr}:${secondsStr}`;
    };

    return (
        <CustomModal
            closeHandler={closeModal}
            footerButtons={footerButtons}
            titleText="Save movie"
            width={311}
        >
            <div>Movie duration: {getFormattedDuration(duration)} s</div>
        </CustomModal>
    );
};

export default RecordMoviesModal;
