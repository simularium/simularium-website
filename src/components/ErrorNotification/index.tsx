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
        duration: htmlData ? 0 : 10,
        onClose: onClose,
    });
};

export default ErrorNotification;
