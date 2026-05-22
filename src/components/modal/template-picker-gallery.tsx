import { Eye, Loader2 } from "lucide-react";

export type TemplatePickerItem = {
  id: number;
  src: string;
  alt: string;
};

interface TemplatePickerGalleryProps {
  templates: TemplatePickerItem[];
  documentLabel: string;
  loadingTemplateId: number | null;
  currentTemplateId?: number | null;
  onSelect: (templateId: number) => void;
}

export function TemplatePickerGallery({
  templates,
  documentLabel,
  loadingTemplateId,
  currentTemplateId,
  onSelect,
}: TemplatePickerGalleryProps) {
  return (
    <div>
      <div className="mb-5 sm:mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          Step 1 of 2
        </p>
        <h3 className="text-base font-semibold text-gray-900 mt-1">
          Choose a {documentLabel.toLowerCase()} template
        </h3>
        <p className="text-sm text-gray-500 mt-1 max-w-lg">
          Pick a layout to preview your document. You can download a PDF or send it by email
          after selecting a template.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          {templates.length} templates available
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {templates.map((template) => {
          const isLoading = loadingTemplateId === template.id;
          const isCurrent = currentTemplateId === template.id;

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template.id)}
              disabled={isLoading}
              className={`group text-left rounded-xl border bg-white p-3 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-70 ${
                isCurrent
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-gray-200 hover:border-primary/50 hover:bg-blue-50/30"
              }`}
            >
              <div className="relative aspect-[3/4] rounded-lg bg-gray-50 border border-gray-100 overflow-hidden mb-3">
                <img
                  src={template.src}
                  alt={template.alt}
                  className="w-full h-full object-contain p-2 transition-transform group-hover:scale-[1.02]"
                  loading="lazy"
                  draggable={false}
                />
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                )}
                {isCurrent && !isLoading && (
                  <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md bg-primary text-white">
                    Current
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-gray-900">Template {template.id}</p>
              <p className="text-xs text-gray-500 truncate mt-0.5">{template.alt}</p>

              <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-3.5 h-3.5" />
                Preview
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
