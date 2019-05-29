import {IExecutable} from "./executable";
import {Auth, IAuthToken, IIdentityResult} from "./auth";
import {Result} from "./result";
import {IError} from "./error";

export interface IConvertError extends IError {}

export abstract class AdapterIO<I, O> {

    protected constructor(
        protected _executable :IExecutable,
        protected _authenticator? :Auth
    ) {}

    protected abstract fail(stage, message, errors);

    protected abstract authTokens(input :I) :IAuthToken;

    protected abstract data(inputs: I) :Result<any, IConvertError>;

    protected abstract success(result: any) :O;

    async handler(inputs: I) :Promise<O> {
        let authPassResult :IIdentityResult;

        if (this._authenticator) {
            // identify session (check tokens/credentials)
            authPassResult = await this._authenticator.identify(this.authTokens(inputs));

            // handle error
            if (authPassResult.isFailure) return this.fail('auth', 'not identified', authPassResult.errors);
        }

        // extract data from inputs
        const dataResult = await this.data(inputs);

        // handle error
        if (dataResult.isFailure) return this.fail('validation', 'incorrect income', dataResult.errors);

        // execute
        const runResult = await this._executable.run(dataResult.get(), authPassResult && authPassResult.get());

        // handle error
        if (runResult.isFailure) return this.fail('execution', 'execution failed', runResult.errors);

        // handle results
        return this.success(runResult.get());
    };
}
