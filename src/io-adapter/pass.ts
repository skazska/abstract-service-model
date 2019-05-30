import {AdapterIO, IConvertError} from "../adapter-i-o";
import {result, Result} from "../result";
import {IModel} from "../model";
import {IAuthPassToken} from "../auth/pass";
import {IError} from "../error";

type TKey = string;
type TData = {
    val :string
}

export interface IPassInput {
    auth: string,
    key: TKey,
    data: TData
}

export interface IPassOutput {
    result? :IModel,
    message? :string,
    errors? :IError[]
}

export abstract class AdapterIOPass extends AdapterIO <IPassInput, IPassOutput> {
    protected fail(stage, message, errors) {
        return {
            message: '' + stage + ' ' + message,
            errors: errors
        }
    };

    protected authTokens(input :IPassInput) :IAuthPassToken {
        return {key: input.auth};
    };

    protected data(inputs: IPassInput) :Result<TData, IConvertError> {
        return result(inputs.data);
    };

    protected success(result: IModel) :IPassOutput {
        return { result: result };
    };

}
