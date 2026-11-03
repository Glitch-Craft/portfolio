import type { CapabilityIconKind } from '@/content/capabilities';

export function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h16m-6-6 6 6-6 6'}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function CrosshairIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M12 2v6m0 8v6M2 12h6m8 0h6" stroke="currentColor" />
      <path d="M8 8h8v8H8z" stroke="currentColor" />
    </svg>
  );
}

export function CapabilityIcon({ kind }: { kind: CapabilityIconKind }) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
      {kind === 'design' ? (
        <>
          <path d="M10 10h27v27H10zM20 20h27v27H20z" stroke="currentColor" strokeWidth="1.5" />
          <path d="m7 48 41-41M37 7h11v11" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10 10h9v9h-9z" fill="currentColor" />
        </>
      ) : kind === 'motion' ? (
        <>
          <path d="m30 5-20 26h16l-2 20 22-29H30l5-17Z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 16h12M1 23h8m32 16h12m-9 7h9" stroke="currentColor" />
        </>
      ) : (
        <>
          <path d="m28 7 22 12-22 12L6 19 28 7Z" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="m6 28 22 12 22-12M6 37l22 12 22-12M28 31v18"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </>
      )}
    </svg>
  );
}
