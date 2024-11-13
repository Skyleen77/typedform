import React from 'react';

export function composeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (node: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref != null) {
        // @ts-ignore
        ref.current = node;
      }
    });
  };
}
