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
    object? :string
    action? :string
    isAuthError? :boolean,
}

/**
 * Auth identity interface
 */
export interface IAuthIdentity {
    access(object: string, action?: string) :GenericResult<any>;
    readonly subject :string;
    readonly details :IAccessDetails,
}

/**
 * Auth identify options
 */
export interface IAuthIdentifyOptions {}

/**
 * Auth grant options
 */
export interface IAuthGrantOptions {}

/**
 * Auth interface
 */
export interface IAuth {
    identify (token :string, options? :IAuthIdentifyOptions) :Promise<GenericResult<IAuthIdentity>>;
    grant(info: any, subject :string, options? :IAuthGrantOptions) :Promise<GenericResult<string>>;
}

/**
 * auth error constructor
 * @param message
 * @param subject
 * @param object
 * @param action
 */
export const authError = (
    message :string,
    subject? :string,
    object? :string,
    action? :string,
) :IAuthError => {
    const err :IAuthError = error(message);
    err.isAuthError = true;
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
 * AuthIdentity constructor options
 */
export interface IAuthIdentityOptions {
}

/**
 * provides simple access control and corresponding auth data
 */
export class AuthIdentity implements IAuthIdentity {
    /**
     * @param subject - user(auth subject)
     * @param details - access details to check access from
     */
    constructor(
        public readonly subject :string,
        public readonly details :IAccessDetails,
        public readonly options? :IAuthIdentityOptions
    ) {}

    /**
     * returns access detail value by key name from obj param
     * @param obj - access detail key
     * @param act - irrelevant here
     */
    access(obj :string, act?: string) :GenericResult<any> {
        const access :any = this.details['*'] ? this.details['*'] : this.details[obj];
        return (access === null || typeof access === 'undefined')
            ? failure([AbstractAuth.error('action not permitted', this.subject, obj, act)])
            : success(access);
    };

    static getInstance(subject :string, details :IAccessDetails, options? :IAuthIdentityOptions) {
        return new AuthIdentity(subject, details, options);
    }
}

/**
 * provides regexp access check control and corresponding auth data
 */
export class RegExIdentity extends AuthIdentity {
    /**
     * returns true if there is access details key matching `object` regex which value match `operation` regex
     * @param object - regex string to check match with access details key
     * @param operation - regex string (or array) to check match with access details value by key matched with object
     */
    access(object :string, operation: string) :GenericResult<boolean> {
        let access = Object.keys(this.details).some(obj => {
            let ore = new RegExp(obj);
            if (!ore.test(object)) return false;
            let access = this.details[obj];
            if (!Array.isArray(access)) access = [access];
            return access.some(access => {
                let re = new RegExp(access);
                return re.test(operation);
            });
        });
        return access
            ? success(access)
            : failure(
                [AbstractAuth.error('action not permitted', this.subject, object, operation)]
            );
    };

    static getInstance(subject :string, details :IAccessDetails, options? :IAuthIdentityOptions) {
        return new RegExIdentity(subject, details, options);
    }
}

/**
 * Abstract Auth constructor options
 */
export interface IAuthOptions {
    secretSource?: any
}

/**
 * Auth identify options
 */
export interface IAuthVerifyOptions {
}

/**  */
export interface IAbstractAuthIdentifyOptions extends IAuthIdentifyOptions {
    verifyOptions :IAuthVerifyOptions,
    identityOptions :IAuthIdentityOptions
}

/**
 * provides identify method to get AuthIdentity by token, verifies token and returns Identity
 */
export abstract class AbstractAuth implements IAuth {
    protected constructor(
        protected identityConstructor :(subject :string, details :IAccessDetails, options? :IAuthIdentityOptions) => IAuthIdentity,
        protected options :IAuthOptions = {}
    ) {}

    protected secret() :Promise<GenericResult<any>> {
        return Promise.resolve(success(this.options.secretSource));
    };

    //TODO refactor: subject && realms -> options
    protected abstract verify(secret: any, token :string, options? :IAuthVerifyOptions) :Promise<GenericResult<IAuthData>>;

    async identify (token :string, options? :IAbstractAuthIdentifyOptions) :Promise<GenericResult<IAuthIdentity>> {
        try {
            let secret = await this.secret();
            if (secret.isFailure) return secret.asFailure();
            let details = await this.verify(secret.get(), token, options && options.verifyOptions);
            return details.transform(data => {
                let {subject, details} = data;
                return this.identityConstructor(subject, details, options && options.identityOptions);
            });
        } catch (e) {
            return Promise.resolve(failure([AbstractAuth.error('bad tokens')]));
        }
    }

    //TODO refactor: subject && realms -> options
    abstract grant(details: IAccessDetails, subject :string, realms? :string[]) :Promise<GenericResult<string>>

    static error = authError;
}
