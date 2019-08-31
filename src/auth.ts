import {failure, GenericResult, success} from "./result";
import {IError, error} from "./error";

/**
 * module provides Authentication classes templates and interfaces
 * main concept entities are Auth and AuthIdentity
 * Auth is to check token and provide relative AuthIdentity, as well as generate token for auth data
 * AuthIdentity is to provide access control and corresponding auth data
 */

/**
 * Common access details data details structure
 */
export interface IAccessDetails {
    [obj :string] :any
}

/**
 * authentication data structure
 */
export interface IAuthData {
    subject :string,
    realms? :string[],
    details? :IAccessDetails
}

/**
 * authentication failure data structure
 */
export interface IAuthError extends IError {
    subject? :string
    realm? :string
    object? :string
    action? :string
    isAuthError? :boolean,
}

/**
 * Auth identity interface
 */
export interface IAuthIdentity {
    access(object: string, action?: string) :GenericResult<any, IAuthError>;
    readonly subject :string;
    readonly details :IAccessDetails,
    readonly realm? :string
}

/**
 * Auth interface
 */
export interface IAuth {
    identify (token :string, realm? :string) :Promise<GenericResult<IAuthIdentity, IAuthError>>;
    grant(info: any, subject :string, realms: string[]) :Promise<GenericResult<string, IAuthError>>;
}

/**
 * auth error constructor
 * @param message
 * @param subject
 * @param realm
 * @param object
 * @param action
 */
export const authError = (
    message :string,
    subject? :string,
    realm? :string,
    object? :string,
    action? :string,
) :IAuthError => {
    const err :IAuthError = error(message);
    err.isAuthError = true;
    if (realm) err.realm = realm;
    if (object) err.object = object;
    if (action) err.action = action;
    return err;
};

/**
 * authError type guard
 * @param error
 */
export const isAuthError = (error :IError) :error is IAuthError => {
    return 'isAuthError' in error;
};

/**
 * provides simple access control and corresponding auth data
 */
export class AuthIdentity implements IAuthIdentity {
    /**
     * @param subject - user(auth subject)
     * @param details - access details to check access from
     * @param realm - realm
     */
    constructor(
        public readonly subject :string,
        public readonly details :IAccessDetails,
        public readonly realm? :string
    ) {}

    /**
     * returns access detail value by key name from obj param
     * @param obj - access detail key
     * @param act - irrelevant here
     */
    access(obj :string, act?: string) :GenericResult<any, IAuthError> {
        const access :any = this.details['*'] ? this.details['*'] : this.details[obj];
        return (access === null || typeof access === 'undefined')
            ? failure([AbstractAuth.error('action not permitted', this.subject, this.realm, obj, act)])
            : success(access);
    };

    static getInstance(subject :string, details :IAccessDetails, realm? :string) {
        return new AuthIdentity(subject, details, realm);
    }
}

/**
 * provides regexp access check control and corresponding auth data
 */
export class RegExIdentity extends AuthIdentity {
    /**
     * returns true if there is access details key matching `object` regex which value match `operation` regex
     * @param object - regex string to check match with access details key
     * @param operation - regex string to check match with access details value by key matched with object
     */
    access(object :string, operation: string) :GenericResult<boolean, IAuthError> {
        let access = Object.keys(this.details).some(obj => {
            let ore = new RegExp(obj);
            if (!ore.test(object)) return false;
            let access = this.details[obj];
            let re = new RegExp(access);
            return re.test(operation);
        });
        return access
            ? success(access)
            : failure(
                [AbstractAuth.error('action not permitted', this.subject, this.realm, object, operation)]
            );
    };

    static getInstance(subject :string, details :IAccessDetails, realm? :string) {
        return new RegExIdentity(subject, details, realm);
    }
}

/**
 * Abstract Auth constructor options
 */
export interface IAuthOptions {
    secretSource?: any
}

/**
 * provides identify method to get AuthIdentity by token, verifies token and returns Identity
 */
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
