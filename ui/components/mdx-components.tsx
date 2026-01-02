import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MDXTable } from "./mdx-table";

export function MDXComponent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      className="prose max-w-2xl overflow-y-hidden text-foreground dark:text-foreground"
      remarkPlugins={[remarkGfm]}
      components={{
        strong: (props) => (
          <strong className="text-foreground" {...props} />
        ),
        h1: (props) => (
          <h1 className="text-foreground" {...props} />
        ),
        h2: (props) => (
          <h2 className="text-foreground" {...props} />
        ),
        h3: (props) => (
          <h3 className="text-foreground" {...props} />
        ),
        h4: (props) => (
          <h4 className="text-foreground" {...props} />
        ),
        h5: (props) => (
          <h5 className="text-foreground" {...props} />
        ),
        h6: (props) => (
          <h6 className="text-foreground" {...props} />
        ),
        ol: (props) => (
          <ol className="mdx-ol" {...props} />
        ),
        ul: (props) => (
          <ul className="mdx-ul" {...props} />
        ),
        p: (props) => (
          <p className="mdx-p" {...props} />
        ),
        table: (props) => (
          <MDXTable {...props} />
        ),
        thead: (props) => (
          <thead className="font-normal px-6 bg-muted" {...props} />
        ),
        th: (props) => (
          <th
            className="whitespace-nowrap px-6 py-3 text-left text-xs text-muted-foreground uppercase tracking-wider border-b border-muted"
            {...props}
          />
        ),
        td: (props) => (
          <td
            className="whitespace-nowrap px-6 py-3 text-sm text-muted-foreground border-b border-muted"
            {...props}
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
