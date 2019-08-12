import {IRunError} from "./executable";
import {get} from "stack-trace";

export interface IError {
    message :string,
    stack?: any
}

export const error = (message :string) :IRunError => {
    const err :IRunError = {
        message: message
    };
    err.stack = get();
    return err;
};
