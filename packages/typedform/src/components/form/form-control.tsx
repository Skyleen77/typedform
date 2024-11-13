import React from 'react';
import { useFormField } from './form-field';
import { AsChild } from '../as-child';
import type { PropsWithAs } from '../../types';
import type { ControllerRenderProps, FieldValues } from 'react-hook-form';

const DEFAULT_CONTROL_TAG = 'div' as const;

type FormControlProps = Omit<
  PropsWithAs<React.ComponentPropsWithoutRef<typeof DEFAULT_CONTROL_TAG>>,
  'children'
> & {
  children:
    | React.ReactNode
    | ((args: {
        field: ControllerRenderProps<FieldValues, string>;
      }) => React.ReactNode);
};

const FormControl = React.forwardRef<
  React.ElementRef<typeof DEFAULT_CONTROL_TAG>,
  FormControlProps
>(({ as: Component = 'div', asChild = false, children, ...props }, ref) => {
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
      {...props}
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
