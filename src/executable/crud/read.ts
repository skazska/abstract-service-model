import {IRunError, AbstractExecutable} from "../../executable";
import {GenericResult} from "../../result";
import {CRUDExecutable} from "../crud";

export class ReadCRUDExecutable<K, P> extends CRUDExecutable<K, any, K, P> {

    protected async _execute(key :K) :Promise<GenericResult<any, IRunError>> {
        return (await this.storage.load(key)).wrap(
            (model) => model,
            (error) => AbstractExecutable.error(error.message, 'read from storage')
        );
    }
}
