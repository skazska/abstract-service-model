import {get} from "stack-trace";

export interface IError {
    message :string,
    stack?: any
}

export const error = (message :string) :IError => {
    const err :IError = {
        message: message
    };
    err.stack = get();
    return err;
};
