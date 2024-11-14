import React from 'react';
import {
  PolymorphicComponentProps,
  PolymorphicForwardRefComponent,
  PolymorphicProps,
  PolymorphicRef,
  ReactTag,
} from './types';

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

export function getInstanceOf<T>(
  instance: any,
  className: string,
): instance is T {
  return (
    instance &&
    instance.constructor &&
    instance.constructor.name === className &&
    typeof instance === 'object'
  );
}

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
