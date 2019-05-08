import {IOrientation, INavigation} from "./navigation";
import {IFiltration} from "./filtration";
import {IProjection} from "./projection";

export interface IListOptions {
    nav: INavigation,
    filter: IFiltration,
    project: IProjection
}

export interface IDataOptions {
    orientations: IOrientation,
}