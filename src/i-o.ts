import {IExecutable} from "./executable";
import {AbstractAuth, IAuthToken, IIdentityResult} from "./auth";
import {GenericResult} from "./result";
import {IError} from "./error";

export interface IIOError extends IError {}
export interface IAuthTokenResult extends GenericResult<IAuthToken, IIOError> {}

/**
 * @class provides convert and handle external Input and service data (like auth tokens) to run executable (internal)
 */
export abstract class AbstractIO<I, O> {

    protected constructor(
        protected _executable :IExecutable,
        protected _authenticator? :AbstractAuth
    ) {}

    /**
     * to perform actions on errors
     */
    protected abstract fail(stage :string, message :string, errors :IError[]) :any;

    /**
     * to extract auth tokens from external Input
     */
    protected abstract authTokens(input :I) :IAuthTokenResult;

    /**
     * to extract data for executable from external Input
     */
    protected abstract data(inputs: I) :GenericResult<any, IIOError>;

    /**
     * to perform actions on successful executable run
     * @param result
     */
    protected abstract success(result: any) :O;

    /**
     * handler
     */
    async handler(inputs: I) :Promise<O> {
        let authPassResult :IIdentityResult;
        let authTokenResult :IAuthTokenResult;

        if (this._authenticator) {
            //extract tokens from inputs
            authTokenResult = this.authTokens(inputs);
            if (authTokenResult.isFailure) return Promise.reject(
                this.fail('auth', "can't extract tokens", authTokenResult.errors)
            );

            // identify session (check tokens/credentials)
            authPassResult = await this._authenticator.identify(authTokenResult.get());
            if (authPassResult.isFailure) return Promise.reject(
                this.fail('auth', 'not identified', authPassResult.errors)
            );
        }

        // extract data from inputs
        const dataResult = await this.data(inputs);
        if (dataResult.isFailure) return Promise.reject(
            this.fail('validation', 'incorrect income', dataResult.errors)
        );

        // execute
        const runResult = await this._executable.run(dataResult.get(), authPassResult && authPassResult.get());
        if (runResult.isFailure) return Promise.reject(
            this.fail('execution', 'execution failed', runResult.errors)
        );

        // handle results
        return Promise.resolve(this.success(runResult.get()));
    };
}
