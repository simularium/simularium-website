import * as React from "react";
import { notification } from "antd";
import { convertToSentenceCase } from "../../util";

interface ErrorNotificationProps {
    message: string;
    htmlData?: string;
    onClose?: () => void;
}

const errorNotification = ({
    message,
    htmlData,
    onClose,
}: ErrorNotificationProps) => {
    return notification.error({
        message: convertToSentenceCase(message),
        description:
            (
                <div
                    dangerouslySetInnerHTML={{
                        __html: htmlData as string,
                    }}
                />
            ) || "",
        duration: htmlData ? 0 : 4.5,
        onClose: onClose,
    });
};

export default errorNotification;
