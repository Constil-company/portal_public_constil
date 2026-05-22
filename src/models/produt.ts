import { ProductResponse } from '../api/products';

export class ProductModel {
  id?: string;
  reference?: string;
  name: string;
  price: number;
  description?: string;
  expiresAt?: string;
  createdAt?: string;
  unit?: string;
  taxes?: string[];
  discount?: number;
  observation?: string;

  constructor(
    id?: string,
    reference?: string,
    name: string = '',
    price: number = 0,
    description?: string,
    expiresAt?: string,
    createdAt?: string,
    unit?: string,
    taxes?: string[],
    discount?: number,
    observation?: string
  ) {
    this.id = id;
    this.reference = reference;
    this.name = name;
    this.price = price;
    this.description = description;
    this.expiresAt = expiresAt;
    this.createdAt = createdAt;
    this.unit = unit;
    this.taxes = taxes;
    this.discount = discount;
    this.observation = observation;
  }

  static fromResponse(response: ProductResponse): ProductModel {
    return new ProductModel(
      response.id,
      response.reference,
      response.name || '',
      response.price || 0,
      response.observation,
      response.expiresAt,
      response.createdAt,
      undefined,
      response.taxes ? [response.taxes.toString()] : [],
      response.descount
    );
  }

  static fromListResponse(responseList: ProductResponse[]): ProductModel[] {
    return responseList.map((response) => ProductModel.fromResponse(response));
  }
}
