import {Result} from "./result";
import {IIdentity} from "./auth";
import {IError} from "./error";

export interface IRunError extends IError {}

export interface IRunParams {}

export interface IRunData {}

export interface IRunResult extends Result<IRunData, IRunError> {}

export abstract class Executable {


    protected abstract authenticate(identity :IIdentity) :Promise<Result<boolean, IRunError>>
    protected abstract execute(params :IRunParams) :Promise<IRunResult>

    async run(params :IRunParams, identity? :IIdentity) :Promise<IRunResult> {
        if (identity) {
            const authResult = await this.authenticate(identity);
            if (authResult.isFailure) return authResult;
        }
        return this.execute(params);
    }
}
