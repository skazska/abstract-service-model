import {IServiceListOptions, Service} from "../src/service";

export class TestService extends Service {
    async create (data :Object) :Promise<any> {
        return undefined;
    }

    async read (id :any) :Promise<any> {
        return Promise.resolve({... id, data: 'data'});
    }

    async update (id :any, data :Object) :Promise<any> {
        return Promise.resolve({... id, ... data});
    }

    async delete (id :any) :Promise<any> {
        return Promise.resolve(true);
    }

    async list (options :IServiceListOptions) :Promise<any> {
        return Promise.resolve([{id: 'id', data: 'data'}]);
    }

}