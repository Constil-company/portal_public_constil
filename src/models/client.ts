import { ClientResponse } from "../api/client";

export class ClientModel {
  id?: string;
  name: string;
  email: string;
  address?: string;
  phone?: string;
  website?: string;
  observation?: string;

  constructor(id:string,name: string, email: string, address?: string, phone?: string, website?: string, observation?: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.address = address;
    this.phone = phone;
    this.website = website;
    this.observation = observation;
  }

  static fromResponse(response: ClientResponse): ClientModel {
    return new ClientModel(
      response.id ?? '',
      response.name ?? '',
      response.email ?? '',
      response.address ?? '',
      response.phone ?? '',
      response.website ?? '',
      response.observation ?? ''
    );
  }

  static fromListResponse(response: ClientResponse[]): ClientModel[] {
    return response.map((item) => this.fromResponse(item));
  }
}
