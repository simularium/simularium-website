import { Button } from "antd";
import React from "react";

import CustomModal from "../CustomModal";

interface RecordMoviesModalProps {
    downloadMovie: () => void;
    closeModal: () => void;
    duration: string;
}

const RecordMoviesModal: React.FC<RecordMoviesModalProps> = ({
    downloadMovie,
    closeModal,
    duration,
}) => {
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

    return (
        <CustomModal
            closeHandler={closeModal}
            footerButtons={footerButtons}
            titleText="Save movie"
            width={311}
        >
            <div>Movie duration: {duration} s</div>
        </CustomModal>
    );
};

export default RecordMoviesModal;
