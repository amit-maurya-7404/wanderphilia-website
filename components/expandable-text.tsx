'use client'

import { useMemo, useState } from 'react'

interface ExpandableTextProps {
  text: string
  lines?: number
}

export function ExpandableText({ text, lines = 4 }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false)

  const shouldShowToggle = useMemo(() => {
    return text.trim().replace(/\s+/g, ' ').length > 220
  }, [text])

  return (
    <>
      <p className={`text-slate-700 leading-relaxed ${!expanded ? 'line-clamp-4' : ''}`}>
        {text}
      </p>
      {shouldShowToggle ? (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-3 text-sm font-semibold text-primary"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      ) : null}
    </>
  )
}
