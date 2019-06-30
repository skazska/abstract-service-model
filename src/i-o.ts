import {IExecutable} from "./executable";
import {Auth, IAuthToken, IIdentityResult} from "./auth";
import {Result} from "./result";
import {IError} from "./error";

export interface IConvertError extends IError {}
export interface IAuthTokenResult extends Result<IAuthToken, IConvertError> {}

/**
 * provides convertations from external Input to executable (internal) Input and service data (like auth tokens)
 */

/**
 * @property _executable ref to `Executable` implementation instance
 * @property [_authenticator] ref to `Auth` implementation instance
 */
export abstract class IO<I, O> {

    constructor(
        protected _executable :IExecutable,
        protected _authenticator? :Auth
    ) {}

    /**
     * to perform actions on errors
     */
    protected abstract fail(stage, message, errors);

    /**
     * to extract auth tokens from external Input
     */
    protected abstract authTokens(input :I) :IAuthTokenResult;

    /**
     * to extract data for executable from external Input
     */
    protected abstract data(inputs: I) :Result<any, IConvertError>;

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
            if (authTokenResult.isFailure) return this.fail('auth', "can't extract tokens", authTokenResult.errors);

            // identify session (check tokens/credentials)
            authPassResult = await this._authenticator.identify(authTokenResult.get());
            if (authPassResult.isFailure) return this.fail('auth', 'not identified', authPassResult.errors);
        }

        // extract data from inputs
        const dataResult = await this.data(inputs);
        if (dataResult.isFailure) return this.fail('validation', 'incorrect income', dataResult.errors);

        // execute
        const runResult = await this._executable.run(dataResult.get(), authPassResult && authPassResult.get());
        if (runResult.isFailure) return this.fail('execution', 'execution failed', runResult.errors);

        // handle results
        return this.success(runResult.get());
    };
}
