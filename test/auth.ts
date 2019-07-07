import {AbstractAuth, IAuthError, IAuthIdentity, IIdentityResult} from "../src/auth";
import {failure, result, GenericResult} from "../src/result";

export interface IAuthTokenTest {
    key: string
}

export class AuthIdentityTest implements IAuthIdentity {
    access(realm :string, op: string) :Promise<GenericResult<boolean, IAuthError>> {
        let res = (!!realm && !!op);
        return Promise.resolve(result(res));
    };
}

export class AuthTest extends AbstractAuth {
    identify (tokens :IAuthTokenTest) :Promise<IIdentityResult> {
        if (!tokens.key) return Promise.resolve(failure([AbstractAuth.error('bad tokens')]));
        return Promise.resolve(result(new AuthIdentityTest()));
    }
}
