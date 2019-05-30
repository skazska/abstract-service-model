import {IO, IConvertError} from "../src/i-o";
import {result, Result} from "../src/result";
import {IModel} from "../src/model";
import {IAuthTokenTest} from "./auth";
import {IError} from "../src/error";

type TKey = string;
type TData = {
    val :string
}

export interface IInputTest {
    auth: string,
    key: TKey,
    data: TData
}

export interface IOutputTest {
    result? :IModel,
    message? :string,
    errors? :IError[]
}

export abstract class IOTest extends IO <IInputTest, IOutputTest> {
    protected fail(stage, message, errors) {
        return {
            message: '' + stage + ' ' + message,
            errors: errors
        }
    };

    protected authTokens(input :IInputTest) :IAuthTokenTest {
        return {key: input.auth};
    };

    protected data(inputs: IInputTest) :Result<TData, IConvertError> {
        return result(inputs.data);
    };

    protected success(result: IModel) :IOutputTest {
        return { result: result };
    };

}
