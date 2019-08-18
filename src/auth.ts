import {failure, GenericResult, success} from "./result";
import {IError, error} from "./error";

export interface IAccessDetails {
    [obj :string] :any
}

export interface IAuthData {
    subject :string,
    realms? :string[],
    details? :IAccessDetails
}


export interface IAuthError extends IError {
    subject? :string
    realm? :string
    object? :string
    action? :string
}

export interface IAuthIdentity {
    access(object: string, action?: string) :GenericResult<any, IAuthError>;
    subject :string;
}

export interface IAuth {
    identify (token :string, realm? :string) :Promise<GenericResult<IAuthIdentity, IAuthError>>;
    grant(info: any, subject :string, realms: string[]) :Promise<GenericResult<string, IAuthError>>;
}

export const authError = (
    message :string,
    subject? :string,
    realm? :string,
    object? :string,
    action? :string,
) :IAuthError => {
    const err :IAuthError = error(message);
    if (realm) err.realm = realm;
    if (object) err.realm = realm;
    if (action) err.action = action;
    return err;
};

export class AuthIdentity implements IAuthIdentity {
    constructor(public subject :string, protected details :IAccessDetails, protected realm? :string) {}

    access(obj :string, act?: string) :GenericResult<any, IAuthError> {
        const access :any = obj ? this.details[obj] : '*';
        return (access === null || typeof access === 'undefined')
            ? failure([AbstractAuth.error('action not permitted', this.subject, this.realm, obj, act)])
            : success(access);
    };

    static getInstance(subject :string, details :IAccessDetails, realm? :string) {
        return new AuthIdentity(subject, details, realm);
    }
}

export class RegExIdentity extends AuthIdentity {
    access(obj :string, act: string) :GenericResult<boolean, IAuthError> {
        let accessResult = super.access(obj);
        if (accessResult.isFailure) return success(false);
        let access = accessResult.get();
        if (access === '*') return success(true);
        let re = new RegExp(access);
        return success(re.test(act));
    };

    static getInstance(subject :string, details :IAccessDetails, realm? :string) {
        return new RegExIdentity(subject, details, realm);
    }
}

export interface IAuthOptions {
    secretSource?: any
}

export abstract class AbstractAuth implements IAuth {
    protected constructor(
        protected identityConstructor :(subject :string, details :IAccessDetails, realm? :string) => IAuthIdentity,
        protected options :IAuthOptions = {}
    ) {}

    protected secret() :Promise<GenericResult<any, IAuthError>> {
        return Promise.resolve(success(this.options.secretSource));
    };

    protected abstract verify(secret: any, token :string, realm? :string) :Promise<GenericResult<IAuthData, IAuthError>>;

    async identify (token :string, realm? :string) :Promise<GenericResult<IAuthIdentity, IAuthError>> {
        try {
            let secret = await this.secret();
            if (secret.isFailure) return failure(secret.errors);
            let details = await this.verify(secret.get(), token, realm);
            return details.wrap(data => {
                let {subject, details} = data;
                return this.identityConstructor(subject, details, realm);
            });
        } catch (e) {
            return Promise.resolve(failure([AbstractAuth.error('bad tokens')]));
        }
    }

    abstract grant(details: IAccessDetails, subject :string, realms? :string[]) :Promise<GenericResult<string, IAuthError>>

    static error = authError;
}
