import {IStorage} from "./storage";
import {IIOAdapter} from "./io-adapter";

export interface TASMOptionsRecursive {
}

export interface IASMOptions {
    recursive? : TASMOptionsRecursive;
}

export interface IASMListOptions extends IASMOptions {
}

export interface IASMReadOptions extends IASMOptions {
}

export interface IASMCreateOptions extends IASMOptions {
}

export interface IASMUpdateOptions extends IASMOptions {
}

export interface IASMDeleteOptions extends IASMOptions {
}

export interface IServiceModel {

    /**
     * @property
     * storage service
     */
    readonly storage :IStorage;

    /**
     * @property
     * IO adapter
     */
    readonly ioAdapter :IIOAdapter;


    read? (key :any, options?: IASMReadOptions) :Promise<any>;

    list? (params :any, options? :IASMListOptions) :Promise<any>;

    create? (data :any, key? :any, options? :IASMCreateOptions) :Promise<any>;

    update? (data :any, key? :any, options? :IASMUpdateOptions) :Promise<any>;

    delete? (key :any, options? :IASMDeleteOptions) :Promise<any>;
}

export interface IServiceModelConstructor {
    new (storage :IStorage, ioAdapter :IIOAdapter) :IServiceModel;
}