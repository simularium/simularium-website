import { UploadRequestOption } from "rc-upload/lib/interface";
import { ViewerError } from "../../state/viewer/types";
import { ErrorLevel, FrontEndError } from "@aics/simularium-viewer";
import { ReceiveFileToConvertAction } from "../../state/trajectory/types";

export default async (
    fileToConvert: any,
    receiveFileToConvert: (
        fileContents: string,
        fileName: string
    ) => ReceiveFileToConvertAction,
    setError: (error: ViewerError) => void,
    rcRequest?: UploadRequestOption
) => {
    try {
        const unpackedFileText = await fileToConvert.originFileObj.text();
        const fileExtensionRegex = /\.[^/.]+$/;
        const fileName = fileToConvert.name.replace(fileExtensionRegex, "");
        receiveFileToConvert(unpackedFileText, fileName);
        if (rcRequest?.onSuccess) {
            rcRequest.onSuccess(
                {
                    name: fileToConvert.name,
                    status: "done",
                    url: "",
                },
                new XMLHttpRequest() // onSuccess needs an XMLHttpRequest arg
            );
        }
    } catch (error) {
        let message;
        let level = ErrorLevel.ERROR;

        if (error instanceof FrontEndError) {
            message = error.message;
            level = error.level;
        } else {
            message = String(error);
        }
        setError({ level, message, htmlData: "" });
    }
};
