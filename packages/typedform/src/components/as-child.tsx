import React, { forwardRef } from 'react';
import { composeRefs } from '../utils';

type AsChildProps = {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
};

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
