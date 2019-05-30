import {IExtractOptions, Service} from "../src/storage";

export class TestService extends Service {

    async load (id :any) :Promise<any> {
        return Promise.resolve({... id, data: 'data'});
    }

    async save (id: any, data :Object) :Promise<any> {
        return Promise.resolve({... id, ... data});
    }

    async erase (id :any) :Promise<any> {
        return Promise.resolve(true);
    }

    async extract (options :IExtractOptions) :Promise<any> {
        return Promise.resolve([{id: 'id', data: 'data'}]);
    }

}