import {AbstractIO, IIOError, IAuthTokenResult} from "../src/i-o";
import {failure, success, GenericResult} from "../src/result";
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


    protected fail(options) :IOutputTest {
        return options;
    };

    protected authTokens(input :IInputTest) :IAuthTokenResult {
        return success({key: input.auth});
    };

    protected data(inputs: IInputTest) :GenericResult<any, IIOError> {
        return success(inputs.data);
    };

    protected success(result: IModel) :IOutputTest {
        return { result: result };
    };

}
