// All Message to be used in the component
export const SUCCESS_MESSAGE = "Great news! Your file has been successfully uploaded!";
export const FAILED_MESSAGE = "Oops! Something unexpected happened during the uploading process. Please try again.";
export const WRONG_FILE_MESSAGE = "Oops! It seems like the type of file you're trying to upload is not supported. Please choose a different file.";
export const WRONG_SIZE_MESSAGE = "Uh-oh! File size it too large. Please make sure your file is not more than 5MB.";

export const SERVER_ERROR_MESSAGE = "Uh-oh! There's a hiccup with the server. Please check your server bucket configuration.";


// All Accepted file types
export const IMAGE_TYPE = 'image/png, image/gif, image/jpeg, image/webp';
export const VIDEO_TYPE = 'video/mp4';
export const FILE_TYPE = 'application/pdf, application/zip, text/csv, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation';

export const ACCEPTED_FILE_TYPES = [...IMAGE_TYPE.split(', '), VIDEO_TYPE, ...FILE_TYPE.split(', ')];

export const MESSAGES = {SUCCESS_MESSAGE, FAILED_MESSAGE, SERVER_ERROR_MESSAGE, WRONG_FILE_MESSAGE, WRONG_SIZE_MESSAGE}