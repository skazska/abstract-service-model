export interface ListOptionsInterface {
    //TODO
}

export interface ServiceInterface {

    create? (data :Object) :Promise<any>

    read? (id :any) :Promise<any>

    update? (id :any, data :Object) :Promise<any>

    delete? (id :any) :Promise<any>

    list? (options :ListOptionsInterface) :Promise<any>
}

export interface ServiceConstructor {
    new (options? :Object) :ServiceInterface;
}