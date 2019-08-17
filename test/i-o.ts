import {AbstractIO, IAuthTokenResult, HandleResult} from "../src/i-o";
import {success, GenericResult} from "../src/result";
import {IModel} from "../src/model";
import {IError} from "../src/error";
import {ITestModelKey} from "./model";


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

export class IOTest extends AbstractIO <IInputTest, ITestModelKey, IModel, IOutputTest> {
    constructor(_executable, _authenticator?) {
        super(_executable, _authenticator);
    }


    protected fail(stage, message, options) :HandleResult<IOutputTest> {
        return super.fail(stage, message, options);
    };

    protected authTokens(input :IInputTest) :IAuthTokenResult {
        return success(input.auth);
    };

    protected data(inputs: IInputTest) :GenericResult<ITestModelKey, IError> {
        return success(inputs.data);
    };

    protected success(result: IModel) :IOutputTest {
        return { result: result };
    };

}
