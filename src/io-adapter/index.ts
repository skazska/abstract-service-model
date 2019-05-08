import {IModelConstructor, IModel, IModelKey} from "../model/interface";
import {Model} from "../model";
import {IIOAdapter, IFromModelOptions, IToModelOptions} from "./interface";
import {INavigate} from "../navigate/interface";

export * from "./interface";

export class IOAdapter implements IIOAdapter {
    _modelConstructor :IModelConstructor;

    constructor (modelConstructor? :IModelConstructor) {
        if (!modelConstructor) {
            this._modelConstructor = Model;
        } else {
            this._modelConstructor = modelConstructor;
        }
    }

    protected validateKey (key: any) {
        return
    }


    get modelConstructor () :IModelConstructor {
        return this._modelConstructor;
    }

    key(raw: any, options?: IToModelOptions): IModelKey {
        return undefined;
    }

    model(key: any, data: any, options?: IToModelOptions): IModel {
        return undefined;
    }

    data(model: IModel, options?: IFromModelOptions): any {
    }

    listData(list: Array<IModel>, options?: IFromModelOptions) {
    }

    nav (raw: any) :INavigate {
        return undefined;
    }

    navData (raw: INavigate) :any {

    }


    //
    // model (id: any, data :any) :IModel {
    //     let props = {... data, ... id};
    //     let keys = this._modelConstructor.keyNames
    //         .reduce((keys, name) => {
    //             keys[name] = data[name];
    //             delete props[name];
    //             return keys;
    //         }, {});
    //     return new this._modelConstructor(keys, props);
    // }
    //
    // protected updateModel (model :IModel, data :any) :IModel {
    //     let props = {... data};
    //     this._modelConstructor.keyNames.forEach(name => { delete props[name]; });
    //     model.update(props);
    //     return model;
    // }
    //
    // keyProp (data: any)
    //
    // async read (key :IModelKey) :Promise<IModel> {
    //     let data = await this._service.load(key);
    //     return this.model(data);
    // }
    //
    // async list (options :IListOptions) :Promise<IListResult> {
    //     let data = await this._service.extract(options);
    //     return {items: data.map(item => this.model(item))};
    // }
    //
    // create (key :IModelKey, properties :IModelProperties) :Promise<IModel> {
    //
    //     let model = new this._modelConstructor(key, properties);
    //     return Promise.resolve(model);
    // }
    //
    // async delete (key :IModelKey) :Promise<any> {
    //     let data = await this._service.erase(key);
    //     return data;
    // }
    //
    // async update (model :IModel) :Promise<IModel> {
    //     let data = await this._service.save(model.key, model.properties);
    //     return this.updateModel(model, data);
    // }

}