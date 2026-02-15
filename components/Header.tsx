interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary tracking-wider uppercase text-glow">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 text-text-muted text-[11px] font-mono tracking-wider uppercase">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      <div className="mt-3 h-px bg-gradient-to-r from-primary/50 via-secondary/30 to-transparent" />
    </div>
  );
}
