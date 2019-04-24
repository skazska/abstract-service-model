export interface IServiceListOptions {
    //TODO
}

export interface IService {

    create? (data :Object) :Promise<any>

    read? (id :any) :Promise<any>

    update? (id :any, data :Object) :Promise<any>

    delete? (id :any) :Promise<any>

    list? (options :IServiceListOptions) :Promise<any>
}

export interface IServiceConstructor {
    new (options? :Object) :IService;
}