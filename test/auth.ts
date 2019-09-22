import {AbstractAuth, IAuthData, IAccessDetails, IAuthError} from "../src/auth";
import {failure, success, GenericResult} from "../src/result";

export class AuthTest extends AbstractAuth {
    _data: IAuthData;

    constructor (identityConstructor, options?) {
        super(identityConstructor, options);
    }

    protected verify(secret: any, token :string, realm? :string) :Promise<GenericResult<IAuthData>> {
        let result :GenericResult<IAuthData>;
        if (token === 'right' ) {
            result = success(this._data);
        } else {
            result = failure([AbstractAuth.error('bad tokens', 'any')]);
        }
        return Promise.resolve(result);
    };

    grant(details: IAccessDetails, subject: string): Promise<GenericResult<string>> {
        this._data = {details: details, subject: subject};
        return Promise.resolve(success('right'));
    }
}
