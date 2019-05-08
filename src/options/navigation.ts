export interface INavPosition {
}

export interface INavRange {
}

export interface INavCapacity {
}

export interface INavDirection {
}

export interface INavigation {
    position :INavPosition,
    direction: INavDirection
    range: INavRange,
}

export interface IOrientation {
    position :INavPosition,
    direction: INavDirection
    capacity: INavCapacity,
}

