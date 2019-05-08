import {IStorage} from "./storage";
import {IIOAdapter} from "./io-adapter";

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


    read? (key :any, options?: any) :Promise<any>;

    list? (params :any, options? :any) :Promise<any>;

    create? (data :any, key? :any, options? :any) :Promise<any>;

    update? (data :any, key? :any, options? :any) :Promise<any>;

    delete? (key :any, options? :any) :Promise<any>;
}

export interface IServiceModelConstructor {
    new (storage :IStorage, ioAdapter :IIOAdapter) :IServiceModel;
}