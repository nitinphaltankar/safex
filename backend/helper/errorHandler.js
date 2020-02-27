// global method to throw error
export const throwError = (res, statusCode, errorMessage) => {
    let error = {};
    error.status = false;
    error.error_message = errorMessage;
    res.status(statusCode).send(error);
    return false;
}