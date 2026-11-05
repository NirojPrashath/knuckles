import * as React from 'react'

/**
 * One-shot viewport observer: true the first time an element is meaningfully
 * on screen, then disconnected. Motion in this project is CSS-only, so this is
 * all the JS a reveal needs.
 */
export function useInView<T extends HTMLElement>(margin = '-12% 0px -8% 0px') {
  const ref = React.useRef<T>(null)
  const [inView, setInView] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true)
            io.disconnect()
          }
        }
      },
      { rootMargin: margin, threshold: 0.01 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [margin])

  return { ref, inView }
}
