import React from 'react';
import { useFormField } from './form-field';
import { AsChild } from '../as-child';
import type { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { forwardRefPolymorphic } from '../../utils';

const DEFAULT_CONTROL_TAG = 'div' as const;

type FormControlProps = {
  /** Children components or a render function that provides field props for controlled input */
  children?:
    | React.ReactNode
    | ((args: {
        field: ControllerRenderProps<FieldValues, string>;
      }) => React.ReactNode);
};

/**
 * `FormControl` is a polymorphic component that wraps a form control element,
 * linking it to a field in the form context and providing accessibility attributes.
 *
 * @param {FormControlProps} props - Properties for configuring the form control, including child elements or a render function.
 * @param {React.Ref<HTMLElement>} ref - Ref forwarded to the rendered control element.
 * @template D - The tag type for the control component, defaults to `div`.
 * @returns {React.ReactElement} - The rendered control element.
 */
const FormControl = forwardRefPolymorphic<
  typeof DEFAULT_CONTROL_TAG,
  FormControlProps
>((props, ref) => {
  const {
    as: Component = DEFAULT_CONTROL_TAG,
    asChild = false,
    children,
    ...restProps
  } = props;

  const { error, field, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  const Element = asChild ? AsChild : Component;

  return (
    <Element
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      data-error={!!error}
      {...restProps}
      {...(!children ? { ...field } : {})}
      ref={ref}
    >
      {typeof children === 'function'
        ? children({ field })
        : React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement, { ...field })
          : children}
    </Element>
  );
});
FormControl.displayName = 'FormControl';

export { FormControl, type FormControlProps };
