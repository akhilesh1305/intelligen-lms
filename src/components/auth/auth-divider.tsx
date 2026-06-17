export function AuthDivider({ label = "or continue with email" }: { label?: string }) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center" aria-hidden>
        <div className="w-full border-t border-border" />
      </div>
      <p className="relative mx-auto w-fit bg-panel px-3 text-xs font-medium uppercase tracking-wider text-muted">
        {label}
      </p>
    </div>
  );
}
