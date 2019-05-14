export interface IAuthCredentials {

}


export interface IAuthRealm {
}

export interface IAuthAccess {
}

export interface IAuthPass extends IResult {
    identity :any;
    access(realm :IAuthRealm) :IAuthAccess;
}

export interface IAuth {
    identify (credentials :IAuthCredentials) :IAuthPass;

}
