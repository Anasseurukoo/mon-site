/** Quiet SVG silhouettes; the parent is hidden from assistive technology. */
export function MemorialDoves() {
  return (
    <span className="memorial-decoration" aria-hidden="true">
      <svg className="memorial-dove memorial-dove--left" viewBox="0 0 40 28" focusable="false">
        <path d="M2 19c7-7 12-11 18-11-3 2-4 4-4 6 7-4 14-4 22 0-6 0-10 2-13 6-3 4-8 5-13 3-3 2-6 3-10 2 2-2 4-4 7-5-3 0-5 0-7-1Zm19-12 4-5 2 6" />
      </svg>
      <svg className="memorial-dove memorial-dove--right" viewBox="0 0 40 28" focusable="false">
        <path d="M2 19c7-7 12-11 18-11-3 2-4 4-4 6 7-4 14-4 22 0-6 0-10 2-13 6-3 4-8 5-13 3-3 2-6 3-10 2 2-2 4-4 7-5-3 0-5 0-7-1Zm19-12 4-5 2 6" />
      </svg>
    </span>
  );
}
