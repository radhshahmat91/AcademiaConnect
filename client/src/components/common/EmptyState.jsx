export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="reveal flex flex-col items-center justify-center rounded-md border border-dashed border-hairline bg-paper/50 px-6 py-16 text-center">
      {Icon && <Icon className="mb-3 h-9 w-9 text-ink-muted/50" strokeWidth={1.5} />}
      <p className="font-display text-lg font-medium text-forest-ink">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
