## New Resume Template Guide

Use this guide to build and register new resume templates that work seamlessly with the app’s data model, editor, and print/export flow. The examples and requirements are based on the existing `ElegantSidebar` template and the shared schema/store.

### What a template must do

- **Render data from the store**: Consume section data from `useResumeStore` slices (e.g., `workExperience`, `education`, etc.) and `settings` for styling and layout.
- **Respect user settings**: Apply `settings` for colors, fonts, capitalization, page format, font size, and line height.
- **Support pagination**: Paginate content to discrete pages using the selected `PageSize` while preserving layout across pages.
- **Handle empty states**: Do not render a section when its data is missing or empty.
- **Be print-friendly**: Use fixed page dimensions and avoid screen-only affordances that do not print well.
- **Expose a ref**: The component must accept a `ref: React.RefObject<HTMLDivElement>` prop for print/export capture.
- **Register in the template registry**: Add the template to `src/components/templates/registry.tsx` with the correct capability flags.

### File locations

- Create your component in `src/components/templates/<your-template>.tsx`.
- Register it in `src/components/templates/registry.tsx`.
- Put preview images under `public/resume/` and reference them in the registry as the `thumbnail`.

### Component contract

- The template must be a Client Component and accept a `ref` prop.
- Expected signature:

```tsx
"use client";
import React from "react";

export function MyTemplate({ ref }: { ref: React.RefObject<HTMLDivElement> }) {
  // render using the ref on the first page container
  return <div ref={ref}>...</div>;
}
```

Note: The prop name is literally `ref`, not `forwardedRef`. Follow the pattern in `elegant-sidebar.tsx` for compatibility with the registry.

### Data access

- Use `useResumeStore` from `src/store/resume/data-store.ts`:
  - `personalInfo`, `workExperience`, `education`, `skills`, `projects`, `languages`, `achievements`, `awards`, `references`, `publications`, `socialMedia`, `goals`, `voluntaryWork`, `certifications`.
  - `order`: `Array<{ id: SectionKeys, title: string }>` describing the section order.
  - `settings`: `Partial<ResumeSettings>`; see Settings below.

Example:

```tsx
import { useResumeStore } from "@/store/resume/data-store";

const settings = useResumeStore((s) => s.settings);
const order = useResumeStore((s) => s.order);
const work = useResumeStore((s) => s.workExperience);
```

### Settings the template should respect

From `src/server/db/schema.ts` (`ResumeSettings`):

- **Colors**
  - `color`: primary color. Default to `#0f172a` if missing.
  - `secondaryColor`: optional; use when you have a secondary rail or accents.
  - `background.color`: page background color (if present in `settings.background`).
- **Typography**
  - `fontFace`: body font (apply via `style={{ fontFamily: settings.fontFace }}` when present).
  - `headingFontFace`: optional override for headings.
  - `fontSize`: default text size (string; e.g., `"16px"`).
  - `lineHeight`: default line height (string; e.g., `"1.5"`).
  - `headlineCapitalization`: one of `AsTyped | Uppercase | Lowercase | Capitalize`. Apply to headings and optional subtitle text.
- **Layout**
  - `pageFormat`: `PageSize.A4` or `PageSize.Letter`. Convert to pixels at 96 DPI: A4 ≈ `794×1123`, Letter ≈ `816×1056`.
  - `pageNumber`: currently unused in `ElegantSidebar` but safe to reserve space if needed.
- **Other**
  - `iconType`, `iconVariant`: optional; only apply if your template uses icons.

Also set feature flags in the registry (see Registry section) to indicate which settings your template actually supports.

### Sections and rendering rules

Implement a mapping from `SectionKeys` to React components so the template can render sections in the user-defined order. For sections with no data, return `null`.

Required to support all keys defined in the data model (even if some are no-ops depending on layout):

- `personalInfo`
- `workExperience`
- `education`
- `skills`
- `projects`
- `languages`
- `achievements`
- `awards`
- `references`
- `publications`
- `socialMedia`
- `goals`
- `voluntaryWork`
- `certifications`

When rendering date ranges or dates, use `prettyDate` from `@/lib/utils`.

For rich-text fields (descriptions, bios), render with `dangerouslySetInnerHTML` as done in `ElegantSidebar`. The editor already manages content; do not add additional sanitation here.

### Pagination model

Your template must paginate content to page-sized containers:

1. Compute page dimensions based on `settings.pageFormat` (see Settings).
2. Pre-render each section in a hidden, off-screen measurement container that mimics the actual content width context.
3. Measure each section’s height (`offsetHeight`) and pack sections onto pages until the remaining vertical space is insufficient; then start a new page.
4. Render an array of pages where each page is a fixed-size container with the measured content.

Key implementation details from `ElegantSidebar`:

- Hidden measurement container:
  - Absolutely positioned off-screen (e.g., `left: -99999`) so it does not affect layout.
  - Its inner width must match the actual content column width to get accurate heights. Example: if your main content spans 2/3 of a 3-column grid with padding, measure at `mainWidth = pageWidth * (2/3) - padding`.
- Page container styling:
  - Fixed CSS size to match the computed pixel dimensions.
  - Apply `backgroundColor`, `fontSize`, `lineHeight`, and body font.
- Print polish: add `shadow print:shadow-none` to avoid shadow in print.

### Layout patterns

- Sidebar or header-only sections are fine. `ElegantSidebar` shows `personalInfo`, `contact`, `education`, `skills`, `languages` in the left rail on the first page, and renders only a blank rail on subsequent pages to preserve column widths.
- If you use special placement (like a hero header), map `personalInfo` to a no-op in the main flow and render an explicit header block.

### Typography and capitalization

- Apply `settings.headingFontFace` to headings if provided; otherwise fall back to body font.
- Apply `settings.headlineCapitalization` to headings and (optionally) sub-headings.
- Use primary color for headings and accent bars.

### Images and links

- Use `next/image` for avatars or decorative images.
- Provide sensible fallbacks (e.g., `/avatars/user-image.png`).
- Render social links with `target="_blank"` and `rel="noreferrer"`.

### Performance and correctness tips

- Build the list of section elements with `useMemo` to avoid unnecessary re-renders.
- Store measurement refs in an array (`useRef<Array<HTMLDivElement | null>>([])`).
- Recompute pagination in a single `useEffect` when section elements or `pageHeight` change.
- Use early returns for empty sections (e.g., `if (!items?.length) return null`).

### Minimal skeleton

```tsx
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useResumeStore } from "@/store/resume/data-store";
import {
  type SectionKeys,
  PageSize,
  HeadlineCapitalization,
} from "@/server/db/schema";
import { prettyDate } from "@/lib/utils";

export function MyTemplate({ ref }: { ref: React.RefObject<HTMLDivElement> }) {
  const settings = useResumeStore((s) => s.settings);
  const order = useResumeStore((s) => s.order);

  const primary = settings?.color ?? "#0f172a";
  const bg = settings?.background?.color ?? "#ffffff";
  const bodyFont = settings?.fontFace
    ? { fontFamily: settings.fontFace }
    : undefined;

  const sectionMap = useMemo<Record<SectionKeys, React.ComponentType>>(
    () => ({
      personalInfo: () => null,
      workExperience: WorkExperience,
      education: Education,
      skills: Skills,
      languages: Languages,
      projects: Projects,
      certifications: Certifications,
      achievements: Achievements,
      goals: Goals,
      voluntaryWork: VoluntaryWork,
      awards: Awards,
      references: References,
      publications: Publications,
      socialMedia: SocialMedia,
    }),
    [],
  );

  const { pageWidth, pageHeight } = useMemo(() => {
    const size = settings?.pageFormat ?? PageSize.A4;
    if (size === PageSize.Letter) return { pageWidth: 816, pageHeight: 1056 };
    return { pageWidth: 794, pageHeight: 1123 };
  }, [settings?.pageFormat]);

  const sectionKeys = useMemo(() => order?.map((s) => s.id) ?? [], [order]);
  const sectionElements = useMemo(
    () =>
      sectionKeys.map((key) => {
        const C = sectionMap[key as SectionKeys];
        return <C key={key} />;
      }),
    [sectionKeys, sectionMap],
  );

  const measureRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [pages, setPages] = useState<React.ReactNode[][]>([]);

  useEffect(() => {
    const paddingY = 32 * 2;
    const innerHeight = pageHeight - paddingY;
    const gap = 32;
    const heights = measureRefs.current.map((el) => el?.offsetHeight ?? 0);
    const result: React.ReactNode[][] = [];
    let current: React.ReactNode[] = [];
    let used = 0;
    sectionElements.forEach((el, i) => {
      const h = heights[i] ?? 0;
      const needed = current.length === 0 ? h : h + gap;
      if (used + needed > innerHeight && current.length > 0) {
        result.push(current);
        current = [el];
        used = h;
      } else {
        current.push(el);
        used += needed;
      }
    });
    if (current.length) result.push(current);
    setPages(result);
  }, [sectionElements, pageHeight]);

  const pageStyle: React.CSSProperties = {
    width: `${pageWidth}px`,
    height: `${pageHeight}px`,
    backgroundColor: bg,
    ...(bodyFont ?? {}),
    fontSize: settings?.fontSize ?? "16px",
    lineHeight: settings?.lineHeight ?? "1.5",
  };

  return (
    <div className="mx-auto flex w-full max-w-full flex-col items-center gap-6">
      {/* Hidden measurement container; width should mimic actual content width */}
      <div
        style={{
          position: "absolute",
          left: -99999,
          top: 0,
          width: `${pageWidth - 64}px`,
        }}
      >
        {sectionElements.map((el, i) => (
          <div
            key={`m-${i}`}
            ref={(node) => (measureRefs.current[i] = node)}
            className="mb-8"
          >
            <div className="p-0">{el}</div>
          </div>
        ))}
      </div>

      {pages.map((content, pageIndex) => (
        <div
          key={`page-${pageIndex}`}
          className="shadow print:shadow-none"
          style={pageStyle}
          ref={pageIndex === 0 ? ref : undefined}
        >
          <main className="h-full p-8">
            <div className="flex flex-col gap-8">{content}</div>
          </main>
        </div>
      ))}
    </div>
  );
}

function WorkExperience() {
  const work = useResumeStore((s) => s.workExperience);
  if (!work?.items?.length) return null;
  return <section>...</section>;
}

// Implement the rest of the section components similarly, returning null when empty
```

### Registry entry

Register your template in `src/components/templates/registry.tsx`:

```tsx
import { MyTemplate } from "@/components/templates/my-template";

export const TEMPLATES: TemplateDefinition[] = [
  // ...other templates
  {
    id: "my-template",
    name: "My Template",
    thumbnail: "/resume/my-template.png",
    component: MyTemplate,
    supports: {
      colors: true,
      headingFont: true,
      bodyFont: true,
      capitalization: true,
      backgroundColor: true,
      iconVariant: false,
    },
  },
];
```

Set the `supports` flags truthfully so the UI only exposes controls that your template implements:

- `colors`: primary/secondary/accent color support.
- `headingFont`: separate heading font support.
- `bodyFont`: body font support.
- `capitalization`: headline capitalization support.
- `backgroundColor`: page background color support.
- `iconVariant`: icon weight/variant support (only if your template uses icons).

### Section implementation notes

- Prefer a small wrapper like `SectionWrapper` and `SectionTitle` to keep consistency.
- Use `prettyDate` for dates and ranges:

```tsx
{prettyDate(item?.startDate)} - {item?.isCurrent ? "Present" : prettyDate(item?.endDate)}
```

- For rich text fields (e.g., `description`, `bio`):

```tsx
{
  item?.description && (
    <div
      className="prose-sm mt-2 text-sm"
      dangerouslySetInnerHTML={{ __html: item.description }}
    />
  );
}
```

### Print and layout checklist

- Fixed page width/height based on `PageSize`.
- `shadow print:shadow-none` on page containers.
- Hidden measurement container positioned off-screen; measurement width matches content column.
- Avoid sticky/positioned elements that may break printing.

### Final QA checklist

- The template compiles as a Client Component and accepts the `ref` prop.
- All sections render correctly and disappear when empty.
- Colors, fonts, capitalization, font size, and line height respond to `settings`.
- Pagination splits content correctly with consistent spacing.
- The template is registered with accurate `supports` flags and a valid `thumbnail`.
- Print preview shows proper page sizing without cut-offs.
