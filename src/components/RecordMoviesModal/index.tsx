import React from "react";

import CustomModal from "../CustomModal";
import { CustomButton } from "../CustomButton";
import { ButtonClass } from "../../constants/interfaces";

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
            <CustomButton
                variant={ButtonClass.LightPrimary}
                onClick={closeModal}
            >
                Cancel
            </CustomButton>
            <CustomButton
                variant={ButtonClass.LightSecondary}
                onClick={completeDownload}
            >
                Save
            </CustomButton>
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
