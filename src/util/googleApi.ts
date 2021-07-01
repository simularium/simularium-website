import { URL_PARAM_KEY_USER_URL } from "../constants";

const googleDriveUrlRegEx = /(?:drive.google\.com\/file\/d\/)(.*)(?=\/)|(?:drive.google\.com\/file\/d\/)(.*)/g;
const googleDriveUrlExcludingIdRegEx = /(drive.google\.com\/file\/d\/)(?=.*)/g;

export const isGoogleDriveUrl = (url: string) => /google.com/g.test(url);

export const getGoogleDriveFileId = (allParams: { [key: string]: string }) => {
    if (
        allParams[URL_PARAM_KEY_USER_URL] &&
        allParams.id &&
        isGoogleDriveUrl(allParams[URL_PARAM_KEY_USER_URL])
    ) {
        return allParams.id;
    } else if (
        allParams[URL_PARAM_KEY_USER_URL] &&
        isGoogleDriveUrl(allParams[URL_PARAM_KEY_USER_URL])
    ) {
        const googleDriveUrl = allParams[URL_PARAM_KEY_USER_URL];
        const driveUrlWithIdMatch = googleDriveUrl.match(googleDriveUrlRegEx);
        if (driveUrlWithIdMatch && driveUrlWithIdMatch[0]) {
            const driveUrlWithId = driveUrlWithIdMatch[0];
            const id = driveUrlWithId.replace(
                googleDriveUrlExcludingIdRegEx,
                ""
            );
            return id;
        }
    }
};

export const getGoogleApiUrl = (id: string) => {
    return `https://www.googleapis.com/drive/v2/files/${id}?alt=media&key=${
        process.env.GOOGLE_API_KEY
    }`;
};
