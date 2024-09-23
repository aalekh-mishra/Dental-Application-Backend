export default {
    SUCCESS: `The operation has been successful`,
    SOMETHING_WENT_WRONG: `Something went wrong!`,
    NOT_FOUND: (entity: string) => `${entity} not found`,
    TOO_MANY_REQUESTS: `Too many requests! Please try again after some time`,
    API_ENDPOINT_NOT_FOUND_ERR: "Api endpoint does not found",
    AUTH_HEADER_MISSING_ERR: "Auth header is missing",
    AUTH_TOKEN_MISSING_ERR: "Auth token is missing",
    JWT_DECODE_ERR: "Incorrect token",
    USER_NOT_FOUND_ERR: "User not found",
    ACCESS_DENIED_ERR: "Access deny for normal user",
}
