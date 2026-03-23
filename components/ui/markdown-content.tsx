type MarkdownContentProps = {
  content: string;
};

export function MarkdownContent({ content }: MarkdownContentProps) {
  const blocks = content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="space-y-6">
      {blocks.map((block) => {
        if (block.startsWith("### ")) {
          return (
            <h3 key={block} className="heading-md text-2xl">
              {block.replace(/^###\s+/, "")}
            </h3>
          );
        }

        if (block.startsWith("## ")) {
          return (
            <h2 key={block} className="heading-md text-3xl">
              {block.replace(/^##\s+/, "")}
            </h2>
          );
        }

        if (block.startsWith("- ")) {
          const items = block
            .split("\n")
            .map((line) => line.replace(/^-\s+/, "").trim())
            .filter(Boolean);

          return (
            <ul key={block} className="space-y-3">
              {items.map((item) => (
                <li key={item} className="flex gap-3 text-base leading-7 text-muted">
                  <span className="mt-3 h-2 w-2 rounded-full bg-brand" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={block} className="body-lg">
            {block.replace(/^#\s+/, "")}
          </p>
        );
      })}
    </div>
  );
}
