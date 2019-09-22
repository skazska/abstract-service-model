/**
 * Module represents Error
 */
// import {get} from "stack-trace";

export interface IError extends Error{
    message :string
}

export const error = (message :string) :IError => {
    const err :IError = new Error (message);
    // err.stack = get();
    return err;
};
