import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {AbstractIO, IIOError} from "../../i-o";
import {AbstractExecutable} from "../../executable";
import {AbstractAuth} from "../../auth";
import {GenericResult} from "../../result";
import {IError} from "../../error";


export interface IAwsApiGwInput {
    event :APIGatewayProxyEvent,
    context :Context
}

export abstract class AwsApiGw<EI, EO, O> extends AbstractIO<IAwsApiGwInput, O> {

    protected constructor(
        protected _executable :AbstractExecutable<EI, EO>,
        protected _authenticator? :AbstractAuth
    ) {
        super(_executable, _authenticator)
    }

    protected abstract fail(stage: string, message: string, errors: IError[]) :Error|string;

    protected abstract data(inputs: IAwsApiGwInput) :GenericResult<EI, IIOError>;

    protected abstract success(result: EO) :O;


}
