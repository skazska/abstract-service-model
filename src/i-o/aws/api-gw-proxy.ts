import {APIGatewayProxyResult} from "aws-lambda";
import {AbstractIO, IIOError} from "../../i-o";
import {AbstractExecutable} from "../../executable";
import {AbstractAuth} from "../../auth";
import {GenericResult, success} from "../../result";
import {AwsApiGw} from "./api-gw";
import {IAwsApiGwProxyInput} from "../../../dist/i-o/aws/api-gw-proxy";

// statusCode: number;
// headers?: {
//     [header: string]: boolean | number | string;
// };
// multiValueHeaders?: {
//     [header: string]: Array<boolean | number | string>;
// };
// body: string;
// isBase64Encoded?: boolean;

export abstract class AwsApiGwProxy<EI, EO> extends AwsApiGw<EI, EO, APIGatewayProxyResult> {

    protected constructor(
        protected _executable :AbstractExecutable<EI, EO>,
        protected _authenticator? :AbstractAuth
    ) {
        super(_executable, _authenticator)
    }

    protected fail(stage: string, message: string, errors: IIOError[]) :Error|string {
    };

    protected abstract data(inputs: IAwsApiGwProxyInput) :GenericResult<EI, IIOError>;

    protected success(result: EO) :APIGatewayProxyResult {
    };


}
