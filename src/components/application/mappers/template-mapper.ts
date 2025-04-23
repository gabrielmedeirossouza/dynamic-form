import { Template } from "../../domain/form/template";
import { Metadata } from "../../domain/metadata/metadata";
import { RowMapper } from "./row-mapper";
import { TemplateLayoutMapper } from "./template-layout-mapper";

export type TemplateDto = ReturnType<typeof TemplateMapper.map>

export class TemplateMapper {
  public static map(template: Template, metadataList: Metadata[]) {
    return {
      id: template.id,
      layout: TemplateLayoutMapper.map(template.layout),
      breakpoint: template.breakpoint,
      rows: template.rows.map(row => RowMapper.map(row, metadataList))
    };
  }
}
