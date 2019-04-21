export interface ListOptionsInterface {
    //TODO
}

export interface ServiceInterface {

    create? (data :object) :Promise<any>

    read? (id :any) :Promise<any>

    update? (id :any, data :object) :Promise<any>

    delete? (id :any) :Promise<any>

    list? (options :ListOptionsInterface) :Promise<any>
}

export interface ServiceConstructor {
    new (options :object) :ServiceInterface;
}