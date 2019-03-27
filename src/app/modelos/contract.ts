export interface Contract {
    type: string;
    entity: string;
    startDate: Date | '';
    endDate: Date | '';
    creationDate: Date | '';
}

export function createNewContract(): Contract {
    const type = 'Algo';
    const entity = 'Otro Algo';
    const startDate = new Date(Math.round(Math.random() * (2019 - 1)), Math.round(Math.random() * (13 - 1)));
    const endDate = new Date(Math.round(Math.random() * (2019 - 1)), Math.round(Math.random() * (13 - 1)));
    const creationDate = new Date();

    return {
        type: type,
        entity: entity,
        startDate: startDate,
        endDate: endDate,
        creationDate: creationDate
    }
}