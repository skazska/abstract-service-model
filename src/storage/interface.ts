export interface IQueryOptions {
    //TODO
}

export interface IStorage {

    create? (data :Object) :Promise<any>

    read? (id :any) :Promise<any>

    update? (id :any, data :Object) :Promise<any>

    delete? (id :any) :Promise<any>

    query? (options :IQueryOptions) :Promise<any>
}

export interface IServiceConstructor {
    new (options? :Object) :IStorage;
}