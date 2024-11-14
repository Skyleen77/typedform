import React from 'react';
import { AsChild } from '../as-child';
import { useFormField } from './form-field';
import { forwardRefPolymorphic } from '../../utils';
import { FieldError } from 'react-hook-form';

const DEFAULT_MESSAGE_TAG = 'p' as const;

interface FormMessageProps {
  /** Child content, which can be a node or a function that receives the error object */
  children?:
    | React.ReactNode
    | ((error: { error: FieldError | undefined }) => React.ReactNode);
}

/**
 * `FormMessage` is a polymorphic component that displays a form error message based on the `FieldError`
 * received from the React Hook Form context. It allows for custom rendering of error messages
 * and provides flexibility in choosing the HTML tag or child component to display the message.
 *
 * @param {FormMessageProps} props - Properties for configuring the error message display.
 * @param {React.Ref<HTMLElement>} ref - Ref forwarded to the rendered message element.
 * @template D - The tag type for the message component, defaults to `p`.
 * @returns {React.ReactElement | null} - The rendered error message component or `null` if no message is available.
 */
const FormMessage = forwardRefPolymorphic<
  typeof DEFAULT_MESSAGE_TAG,
  FormMessageProps
>((props, ref) => {
  const {
    as: Component = DEFAULT_MESSAGE_TAG,
    asChild = false,
    children,
    ...restProps
  } = props;

  const { error, formMessageId } = useFormField();
  const errorMessage = error ? String(error.message) : undefined;

  if (!errorMessage && !children) return null;

  const Element = asChild ? AsChild : Component;

  return (
    <Element ref={ref} id={formMessageId} {...restProps}>
      {typeof children === 'function'
        ? children({ error })
        : errorMessage
          ? asChild
            ? React.cloneElement(
                children as React.ReactElement,
                {},
                errorMessage,
              )
            : errorMessage
          : children}
    </Element>
  );
});

FormMessage.displayName = 'FormMessage';

export { FormMessage, type FormMessageProps };
