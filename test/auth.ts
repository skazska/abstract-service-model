import {AbstractAuth, IAuthData, IAccessDetails, IAuthError} from "../src/auth";
import {failure, success, GenericResult} from "../src/result";

export class AuthTest extends AbstractAuth {
    _data: IAuthData;
    _realms: string[];

    constructor (identityConstructor) {
        super(identityConstructor);
    }

    protected secret() :Promise<GenericResult<any, IAuthError>> {
        return Promise.resolve(success('secret'));
    };

    protected verify(secret: any, token :string, realm? :string) :Promise<GenericResult<IAuthData, IAuthError>> {
        let result :GenericResult<IAuthData, IAuthError>;
        if (token === 'right' ) {
            result = success(this._data);
        } else {
            result = failure([AbstractAuth.error('bad tokens', 'any', realm)]);
        }
        return Promise.resolve(result);
    };

    grant(details: IAccessDetails, subject: string, realms?: string[]): Promise<GenericResult<string, IAuthError>> {
        this._data = {details: details, subject: subject, realms: realms};
        this._realms = realms;
        return Promise.resolve(success('right'));
    }
}
