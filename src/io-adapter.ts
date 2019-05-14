import {IServiceExecutable, IServiceLogger} from "./interface";
import {IModelFactory} from "./model";
import {IAuth, IAuthCredentials, IAuthPass} from "./auth";

export abstract class IoAdapter {
    protected _modelFactory: IModelFactory;
    protected _authenticator: IAuth;
    protected _executable: IServiceExecutable;


    constructor(
        modelFactory: IModelFactory,
        authenticator: IAuth,
        executable: IServiceExecutable
    ) {
        this._modelFactory = modelFactory;
        this._authenticator = authenticator;
        this._executable = executable;
    }

    abstract credentials(input :any) :IAuthCredentials;

    async handler(inputs: any) :any {
        const authPass :IAuthPass = await this._authenticator.identify(this.credentials(inputs));

        if (authPass.isFailure) throw new Error('ACCESS_DENIED');


    };
}
