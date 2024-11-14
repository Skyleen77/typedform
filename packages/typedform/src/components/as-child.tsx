import React, { forwardRef } from 'react';
import { composeRefs } from '../utils';

type AsChildProps = {
  /** The child component that will receive additional props */
  children?: React.ReactNode;
  /** Additional CSS classes to apply to the child component */
  className?: string;
  /** Any other props to be passed down to the child component */
  [key: string]: any;
};

/**
 * `AsChild` is a component that takes a single React element as its `children`
 * and applies additional props to it, such as `className` and other attributes.
 *
 * It allows composition of multiple refs and ensures that the child element is a valid React element.
 *
 * @param {AsChildProps} props - Props to be applied to the child component.
 * @param {React.Ref<HTMLElement>} ref - A ref to be forwarded to the child component.
 * @returns {React.ReactElement | null} - The modified child element or `null` if `children` is not a valid React element.
 */
const AsChild = forwardRef<HTMLElement, AsChildProps>(
  ({ children, className, ...props }, ref) => {
    if (!React.isValidElement(children)) {
      console.warn('AsChild: the children prop must be a valid React element');
      return null;
    }

    const childProps = {
      ...(children.props as any),
      ...props,
      className: [(children.props as any).className, className]
        .filter(Boolean)
        .join(' '),
      ref: composeRefs(ref, (children as any).ref),
    };

    return React.cloneElement(children, childProps);
  },
);

AsChild.displayName = 'AsChild';

export { AsChild, type AsChildProps };
