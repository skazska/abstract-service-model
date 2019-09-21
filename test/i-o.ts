import {AbstractIO, IAuthTokenResult} from "../src/i-o";
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

export class OutputTest extends GenericResult<IModel> {
    message? :string;
    stage? :string;
}

export class IOTest extends AbstractIO <IInputTest, ITestModelKey, IModel, OutputTest> {
    constructor(_executable, _authenticator?) {
        super(_executable, _authenticator);
    }


    protected fail(stage, message, errors) :OutputTest {
        const failure = new OutputTest(null, errors);
        failure.message = message;
        failure.stage = stage;
        return failure;
    };

    protected authTokens(input :IInputTest) :IAuthTokenResult {
        return success(input.auth);
    };

    protected data(inputs: IInputTest) :GenericResult<ITestModelKey> {
        return success(inputs.data);
    };

    protected success(result: IModel) :OutputTest {
        return success(result);
    };

}
