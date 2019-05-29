import {Auth, IAuthError, IAuthIdentity, IAuthToken, IIdentityResult} from "../auth";
import {result, Result} from "../result";

export interface IAuthPassToken {
    key: string
}

export class AuthPassIdentity implements IAuthIdentity {
    access(realm :string, op: string) :Promise<Result<boolean, IAuthError>> {
        return Promise.resolve(result(true));
    };
}

export class AuthPass extends Auth {
    identify (tokens :IAuthPassToken) :Promise<IIdentityResult> {
        return Promise.resolve(result(new AuthPassIdentity()));
    }
}
