import {APIGatewayProxyEvent, Context} from "aws-lambda";
import {AbstractIO} from "../../i-o";
import {GenericResult} from "../../result";
import {IError} from "../../error";


export interface IAwsApiGwInput {
    event :APIGatewayProxyEvent,
    context :Context
}

export abstract class AwsApiGw<EI, EO, O> extends AbstractIO<IAwsApiGwInput, EI, EO, O> {
    protected abstract data(inputs: IAwsApiGwInput) :GenericResult<EI, IError>;
}
