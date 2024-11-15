import React from 'react';
import {
  PolymorphicComponentProps,
  PolymorphicForwardRefComponent,
  PolymorphicRef,
  ReactTag,
} from './types';

/**
 * Combines multiple refs into a single ref callback function.
 * Useful for allowing multiple components or elements to access the same ref.
 *
 * @param {...Array<React.Ref<T> | undefined>} refs - A list of React refs, which can be functions or objects.
 * @returns {React.RefCallback<T>} - A combined ref callback function that calls each ref with the node.
 * @template T
 */
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

/**
 * Creates a polymorphic component with `forwardRef` that accepts an HTML or React element
 * as the tag and applies associated props.
 *
 * @param {(props: PolymorphicComponentProps<D, P>, ref: PolymorphicRef<D>) => React.ReactElement | null} render - The render function for the component.
 * @returns {PolymorphicForwardRefComponent<D, P>} - A polymorphic forwardRef component.
 * @template D, P
 */
export function forwardRefPolymorphic<D extends ReactTag, P = {}>(
  render: (
    props: PolymorphicComponentProps<D, P>,
    ref: PolymorphicRef<D>,
  ) => React.ReactElement | null,
): PolymorphicForwardRefComponent<D, P> {
  return React.forwardRef(render) as unknown as PolymorphicForwardRefComponent<
    D,
    P
  >;
}
