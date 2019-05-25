import {IRunError, error} from "../../executable";
import {failure, result, Result} from "../../result";
import {IModel, IModelKey} from "../../model";
import {RecordExecutable} from "../record";

export class ReadRecordExecutable extends RecordExecutable {

    protected async _execute(key :IModelKey) :Promise<Result<IModel, IRunError>> {
        const record = await this._storage.load(key);
        if (record.isFailure) {
            return failure(record.errors.map(err => error(err.description, 'read from storage')));
        }
        return result(record.get());
    }
}
