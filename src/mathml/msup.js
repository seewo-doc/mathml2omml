import { walker } from '../walker.js'
import { getNary, getNaryTarget } from '../ooml/index.js'

export function msup (element, targetParent, previousSibling, nextSibling, ancestors) {
  // Superscript
  if (element.elements.length !== 2) {
    // treat as mrow
    return targetParent
  }
  ancestors = [...ancestors]
  ancestors.unshift(element)
  const base = element.elements[0]
  const superscript = element.elements[1]

  let topTarget
  //
  // m:nAry
  //
  // Conditions:
  // 1. base text must be nary operator
  // 2. no accents
  const naryChar = getNary(base)
  if (
    naryChar &&
    element.attributes?.accent?.toLowerCase() !== 'true' &&
    element.attributes?.accentunder?.toLowerCase() !== 'true'
  ) {
    topTarget = getNaryTarget(naryChar, element, 'subSup', true)
    element.isNary = true
    topTarget.elements.push({ type: 'element', name: 'm:sub' })
  } else {
    const baseTarget = {
      name: 'm:e',
      type: 'element',
      elements: []
    }
    walker(
      base,
      baseTarget,
      false,
      false,
      ancestors
    )

    topTarget = {
      type: 'element',
      name: 'm:sSup',
      elements: [
        {
          type: 'element',
          name: 'm:sSupPr',
          elements: [{
            type: 'element',
            name: 'm:ctrlPr'
          }]
        },
        baseTarget
      ]
    }
  }

  const superscriptTarget = {
    name: 'm:sup',
    type: 'element',
    elements: []
  }

  walker(
    superscript,
    superscriptTarget,
    false,
    false,
    ancestors
  )

  topTarget.elements.push(superscriptTarget)
  if (element.isNary) {
    topTarget.elements.push({ type: 'element', name: 'm:e', elements: [] })
  }
  targetParent.elements.push(topTarget)
  // Don't iterate over children in the usual way.
}
