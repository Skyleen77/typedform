import React from 'react';
import type { PropsWithAs } from '../../types';
import { AsChild } from '../as-child';
import { useFormField } from './form-field';

const DEFAULT_MESSAGE_TAG = 'p' as const;

type FormMessageProps = PropsWithAs<
  React.ComponentPropsWithoutRef<typeof DEFAULT_MESSAGE_TAG>
>;

const FormMessage = React.forwardRef<
  React.ElementRef<typeof DEFAULT_MESSAGE_TAG>,
  FormMessageProps
>(
  (
    {
      as: Component = DEFAULT_MESSAGE_TAG,
      asChild = false,
      children,
      ...props
    },
    ref,
  ) => {
    const { error, formMessageId } = useFormField();
    const message = error ? <span>{String(error.message)}</span> : children;
    if (!message) return null;
    const Element = asChild ? AsChild : Component;
    return (
      <Element ref={ref} id={formMessageId} {...props}>
        {message}
      </Element>
    );
  },
);
FormMessage.displayName = 'FormMessage';

export { FormMessage, type FormMessageProps };
