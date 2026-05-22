import { TemplateResponse } from '../api/documents';

export class TemplateModel {
  templateId: string;
  name: string;
  description: string;
  url: string;
  constructor(templateId: string, name: string, description: string, url: string) {
    this.templateId = templateId;
    this.name = name;
    this.description = description;
    this.url = url;
  }

  static fromResponse(response: TemplateResponse): TemplateModel {
    return new TemplateModel(
      response.templateId ?? '',
      response.name ?? '',
      response.description ?? '',
      response.url ?? ''
    );
  }

    static fromListResponse(response: TemplateResponse[]): TemplateModel[] {
        return response.map((template) => TemplateModel.fromResponse(template));
    }
}
