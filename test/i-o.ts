import {IO, IConvertError, IAuthTokenResult} from "../src/i-o";
import {failure, result, Result} from "../src/result";
import {IModel} from "../src/model";
import {IAuthTokenTest} from "./auth";
import {IError} from "../src/error";


type TKey = string;

export interface IInputTest {
    auth: string,
    key: TKey,
    data: any
}

export interface IOutputTest {
    result? :IModel,
    message? :string,
    errors? :IError[]
}

export class IOTest extends IO <IInputTest, IOutputTest> {
    protected fail(stage, message, errors) {
        return {
            message: '' + stage + ' ' + message,
            errors: errors
        }
    };

    protected authTokens(input :IInputTest) :IAuthTokenResult {
        return result({key: input.auth});
    };

    protected data(inputs: IInputTest) :Result<any, IConvertError> {
        return result(inputs.data);
    };

    protected success(result: IModel) :IOutputTest {
        return { result: result };
    };

}
