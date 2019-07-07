import {IExecutable} from "./executable";
import {AbstractAuth, IAuthToken, IIdentityResult} from "./auth";
import {GenericResult} from "./result";
import {IError} from "./error";

export interface IConvertError extends IError {}
export interface IAuthTokenResult extends GenericResult<IAuthToken, IConvertError> {}

/**
 * provides convertations from external Input to executable (internal) Input and service data (like auth tokens)
 */

/**
 * @property _executable ref to `AbstractExecutable` implementation instance
 * @property [_authenticator] ref to `AbstractAuth` implementation instance
 */
export abstract class AbstractIO<I, O> {

    protected constructor(
        protected _executable :IExecutable,
        protected _authenticator? :AbstractAuth
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
    protected abstract data(inputs: I) :GenericResult<any, IConvertError>;

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
