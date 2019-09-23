/**
 * Module represents IO:
 * AbstractIO class and infrastructure
 */
import {AbstractExecutable, IRunError} from "./executable";
import {IAbstractAuthIdentifyOptions, IAuth} from "./auth";
import {GenericResult, success} from "./result";
import {error, IError} from "./error";

export interface IAuthTokenResult extends GenericResult<string> {}

export interface IIOError extends IError {
    isIOError? :boolean
}
export const isIOError = (error :IError) :error is IIOError => {
    return 'isIOError' in error;
};

/**
 * creates IOError
 * @param message
 */
export const ioError = (message :string) :IIOError => {
    const err :IIOError = error(message);
    err.isIOError = true;
    return err;
};

/** IO options */
export interface IIOOptions {
    identifyOptions? :IAbstractAuthIdentifyOptions
}

export interface IIO {
    handler(inputs: any) :Promise<any>
}

/**
 * @class provides convert and handle external Input and service data (like auth tokens) to run executable (internal)
 */
export abstract class AbstractIO<I, EI, EO, O> implements IIO {
    /**
     * @param executable - executable to run
     * @param authenticator
     * @param options
     */
    protected constructor(
        protected executable :AbstractExecutable<EI, EO>,
        protected authenticator? :IAuth,
        protected options: IIOOptions = {}
    ) {}

    /**
     * to perform actions on errors
     */
    protected abstract fail(stage :string, message :string, errors :IError[]) :O;

    /**
     * to extract auth tokens from external Input
     */
    protected abstract authTokens(input :I) :IAuthTokenResult;

    /**
     * to extract data for executable from external Input
     */
    protected abstract data(inputs: I) :Promise<GenericResult<EI>>;

    /**
     * to perform actions on successful executable run
     * @param result
     */
    protected abstract success(result: EO) :O;

    /**
     * handler
     */
    public async handler(inputs: I) :Promise<O> {
        let authPassResult;
        let authTokenResult :IAuthTokenResult;
        let dataResult :GenericResult<EI>;
        let runResult :GenericResult<EO>;

        if (this.authenticator) {
            try {
                //extract tokens from inputs
                authTokenResult = this.authTokens(inputs);
                if (authTokenResult.isFailure)
                    return this.fail('auth', "can't extract tokens", authTokenResult.errors);

                // identify session (check tokens/credentials)
                authPassResult = await this.authenticator.identify(authTokenResult.get(), this.options.identifyOptions);
                if (authPassResult.isFailure)
                    return this.fail('auth', 'not identified', authPassResult.errors);
            } catch (e) {
                return this.fail('auth', 'unexpected', [e]);
            }
        }

        // extract data from inputs
        try {
            dataResult = await this.data(inputs);
            if (dataResult.isFailure) return this.fail('extract', 'incorrect income', dataResult.errors);
        } catch (e) {
            return this.fail('extract', 'unexpected', [e]);
        }

        // execute
        try {
            runResult = await this.executable.run(dataResult.get(), authPassResult && authPassResult.get());
            if (runResult.isFailure) return this.fail('execution', 'execution failed', runResult.errors);
        } catch (e) {
            return this.fail('execution', 'unexpected', [e]);
        }

        // handle results
        try {
            return this.success(runResult.get());
        } catch (e) {
            return this.fail('encode', 'unexpected', [e]);
        }
    };

    static error = ioError

}
