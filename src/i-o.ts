import {AbstractExecutable} from "./executable";
import {IAuth, IAuthToken, IIdentityResult} from "./auth";
import {GenericResult, success} from "./result";
import {IError} from "./error";

export interface IAuthTokenResult extends GenericResult<IAuthToken, IError> {}

export class HandleResult<O> extends GenericResult<O, IError> {
    stage? :string;
    message? :string;
}

export interface IIOOptions {}

/**
 * @class provides convert and handle external Input and service data (like auth tokens) to run executable (internal)
 */
export abstract class AbstractIO<I, EI, EO, O> {

    protected constructor(
        protected executable :AbstractExecutable<EI, EO>,
        protected authenticator? :IAuth,
        protected options?: IIOOptions
    ) {}

    /**
     * to perform actions on errors
     */
    protected fail(stage :string, message :string, errors :IError[]) :HandleResult<O> {
        const failure = new HandleResult(null, errors);
        failure.message = message;
        failure.stage = stage;
        return failure;
    };

    /**
     * to extract auth tokens from external Input
     */
    protected abstract authTokens(input :I) :IAuthTokenResult;

    /**
     * to extract data for executable from external Input
     */
    protected abstract data(inputs: I) :GenericResult<EI, IError>;

    /**
     * to perform actions on successful executable run
     * @param result
     */
    protected abstract success(result: EO) :O;

    /**
     * handler
     */
    public async handler(inputs: I) :Promise<GenericResult<O,IError>> {
        let authPassResult :IIdentityResult;
        let authTokenResult :IAuthTokenResult;

        if (this.authenticator) {
            //extract tokens from inputs
            authTokenResult = this.authTokens(inputs);
            if (authTokenResult.isFailure)
                return this.fail('auth', "can't extract tokens", authTokenResult.errors);

            // identify session (check tokens/credentials)
            authPassResult = await this.authenticator.identify(authTokenResult.get());
            if (authPassResult.isFailure)
                return this.fail('auth', 'not identified', authPassResult.errors);
        }

        // extract data from inputs
        const dataResult = await this.data(inputs);
        if (dataResult.isFailure) return this.fail('validation', 'incorrect income', dataResult.errors);

        // execute
        const runResult = await this.executable.run(dataResult.get(), authPassResult && authPassResult.get());
        if (runResult.isFailure) return this.fail('execution', 'execution failed', runResult.errors);

        // handle results
        return success(this.success(runResult.get()));
    };
}
