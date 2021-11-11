import * as React from "react";
import { notification } from "antd";
import { ErrorLevel } from "@aics/simularium-viewer";

import { convertToSentenceCase } from "../../util";

interface ErrorNotificationProps {
    message: string;
    level: ErrorLevel;
    htmlData?: string;
    onClose?: () => void;
}

const ErrorNotification = ({
    level,
    message,
    htmlData,
    onClose,
}: ErrorNotificationProps) => {
    // Sometimes the message that comes in at runtime is an entire
    // Error object instead of a string
    if (typeof message !== "string") {
        const error: Error = message;
        message = error.message;
    }
    if (level === undefined) {
        level = ErrorLevel.ERROR;
    }

    const getDuration = () => {
        if (htmlData) return 0; // Do not close automatically

        // 10 seconds for errors
        // 3 seconds for warnings and info messages
        if (level === ErrorLevel.ERROR) return 10;
        return 3;
    };

    return notification[level]({
        message: convertToSentenceCase(message),
        description:
            (
                <div
                    dangerouslySetInnerHTML={{
                        __html: htmlData as string,
                    }}
                />
            ) || "",
        duration: getDuration(),
        onClose: onClose,
    });
};

export default ErrorNotification;
