import {AbstractIO, IConvertError, IAuthTokenResult} from "../src/i-o";
import {failure, result, GenericResult} from "../src/result";
import {IModel} from "../src/model";
import {IAuthTokenTest} from "./auth";
import {IError} from "../src/error";
import {AbstractAuth, IExecutable} from "../src";


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

export class IOTest extends AbstractIO <IInputTest, IOutputTest> {
    constructor(_executable, _authenticator?) {
        super(_executable, _authenticator);
    }


    protected fail(stage, message, errors) {
        return {
            message: '' + stage + ' ' + message,
            errors: errors
        }
    };

    protected authTokens(input :IInputTest) :IAuthTokenResult {
        return result({key: input.auth});
    };

    protected data(inputs: IInputTest) :GenericResult<any, IConvertError> {
        return result(inputs.data);
    };

    protected success(result: IModel) :IOutputTest {
        return { result: result };
    };

}
