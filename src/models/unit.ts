import { UnitResponse } from "../api/unit";

export class UnitModel {
    id: string;
    abbreviation: string;
    name: string;

    constructor(id: string = '', abbreviation: string = '', name: string = '') {
        this.id = id;
        this.abbreviation = abbreviation;
        this.name = name;
    }

    static fromResponse(response: UnitResponse): UnitModel {
        return new UnitModel(response.id, response.abbreviation, response.name);
    }

    static fromListResponse(response: UnitResponse[]): UnitModel[] {
        return response.map((unit) => UnitModel.fromResponse(unit));
    }
}