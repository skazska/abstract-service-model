import {IRunError, error} from "../../executable";
import {failure, result, Result} from "../../result";
import {IModel, IModelKey} from "../../model";
import {RecordExecutable} from "../record";

export class ReadRecordExecutable extends RecordExecutable {

    protected async _execute(params :IModelKey) :Promise<Result<IModel, IRunError>> {
        const response = await this._storage.erase(params);
        if (response.isFailure) {
            return failure(response.errors.map(err => error(err.description, 'erase from storage')));
        }
        return result(response.get());
    }
}
