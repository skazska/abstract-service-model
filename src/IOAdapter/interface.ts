import {IModelConstructor, IModel, IModelKey, IModelProperties} from "../model";

export interface IListOptions {
    //TODO
}

export interface IListResult {
    items: IModel[];
    //TODO
}

export interface IIOAdapter {

    /**
     * @property
     * holds key field names
     */
    readonly modelConstructor :IModelConstructor;


    read (key :any) :Promise<any>;

    list(options :IListOptions) :Promise<IListResult>;

    create (properties :IModelProperties, key? :IModelKey) :Promise<IModel>;

    update (model :IModel) :Promise<IModel>;

    delete (key :IModelKey) :Promise<boolean>;
}

export interface IIOAdapterConstructor {
    new () :IIOAdapter;
}