import {IRunError, error} from "../../executable";
import {failure, result, Result} from "../../result";
import {CRUDExecutable} from "../crud";

export class DeleteExecutable<K> extends CRUDExecutable<K, any, K, never> {

    protected async _execute(key :K) :Promise<Result<any, IRunError>> {
        const response = await this._storage.erase(key);
        if (response.isFailure) {
            return failure(response.errors.map(err => error(err.description, 'erase from storage')));
        }
        return result(response.get());
    }
}
