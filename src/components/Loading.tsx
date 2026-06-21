export default function Loading() {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          border: '3px solid var(--surface2)',
          borderTopColor: 'var(--accent)',
          animation: 'vbSpin .8s linear infinite',
        }}
      />
      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)' }}>Loading words…</span>
    </div>
  )
}
