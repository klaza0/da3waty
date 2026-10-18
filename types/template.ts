import type { EventType, TemplateComponentKey, TemplateStyleTag } from "./invitation";

export interface InvitationTemplate {
  id: string;
  name: string;
  slug: TemplateComponentKey;
  componentKey: TemplateComponentKey;
  category: EventType;
  style: TemplateStyleTag;
  description: string;
  previewAccent: string;
  isPremium: boolean;
  isActive: boolean;
}
