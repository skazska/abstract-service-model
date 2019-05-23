import {Result} from "./result";
import {IIdentity} from "./auth";
import {IError} from "./error";

export interface IRunError extends IError {}

export interface IExecutable {
    run(params? :any, identity? :IIdentity);
}

export abstract class Executable<I, O> implements IExecutable {

    protected abstract authenticate(identity :IIdentity) :Promise<Result<O, IRunError>>
    protected abstract execute(params :I) :Promise<Result<O, IRunError>>

    async run(params :I, identity? :IIdentity) :Promise<Result<O, IRunError>> {
        if (identity) {
            const authResult = await this.authenticate(identity);
            if (authResult.isFailure) return authResult;
        }
        return this.execute(params);
    }
}
