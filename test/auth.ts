import {Auth, IAuthError, IAuthIdentity, IIdentityResult} from "../src/auth";
import {failure, result, Result} from "../src/result";

export interface IAuthTokenTest {
    key: string
}

export class AuthIdentityTest implements IAuthIdentity {
    access(realm :string, op: string) :Promise<Result<boolean, IAuthError>> {
        let res = (!!realm && !!op);
        return Promise.resolve(result(res));
    };
}

export class AuthTest extends Auth {
    identify (tokens :IAuthTokenTest) :Promise<IIdentityResult> {
        if (!tokens.key) return Promise.resolve(failure([Auth.error('bad tokens')]));
        return Promise.resolve(result(new AuthIdentityTest()));
    }
}
