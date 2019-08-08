import {IRunError, AbstractExecutable} from "../../executable";
import {GenericResult} from "../../result";
import {CRUDExecutable} from "../crud";

export class DeleteCRUDExecutable<K, P> extends CRUDExecutable<K, any, K, P> {

    protected async _execute(key :K) :Promise<GenericResult<any, IRunError>> {
        return (await this.storage.erase(key)).wrap(
            result => null,
            err => AbstractExecutable.error(err.description, 'erase from storage')
        );
    }
}
