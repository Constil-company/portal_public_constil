import { FeeResponse } from "../api/fees";

export class FeesModel {
  id?: string;

  name: string;

  rate: number;

  type: FeeTypeModel;

  createdAt?: string;

  constructor(data: FeesModel) {
    this.id = data.id;
    this.name = data.name;
    this.rate = data.rate;
    this.type = data.type;
    this.createdAt = data.createdAt;
  }

  static fromApiResponse(response: FeeResponse): FeesModel {
    return new FeesModel({
      id: response.id,
      name: response.name ?? "",
      rate: response.rate ?? 0,
      type: response.type as FeeTypeModel,
      createdAt: response.createdAt || undefined,
    });
  }

  static fromListResponse(response: FeeResponse[]): FeesModel[] {
    return response.map((fee) => FeesModel.fromApiResponse(fee));
  }
}

enum FeeTypeModel {
  TAX = "TAX",
  DISCOUNT = "DISCOUNT",
}
