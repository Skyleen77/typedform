import React from 'react';
import { useFormField } from './form-field';
import { AsChild } from '../as-child';
import type { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { forwardRefPolymorphic } from '../../utils';

const DEFAULT_CONTROL_TAG = 'div' as const;

type FormControlProps = {
  children:
    | React.ReactNode
    | ((args: {
        field: ControllerRenderProps<FieldValues, string>;
      }) => React.ReactNode);
};

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
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      data-error={!!error}
      {...restProps}
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
