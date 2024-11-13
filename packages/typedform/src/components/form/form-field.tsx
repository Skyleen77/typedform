import React from 'react';
import {
  Controller,
  useFormContext,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { AsChild } from '../as-child';
import { PropsWithAs } from '../../types';

const DEFAULT_FIELD_TAG = 'div' as const;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
  id: string;
  field: ControllerRenderProps<FieldValues, string>;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

export const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { name, id, field } = fieldContext;

  return {
    id,
    name,
    field,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = PropsWithAs<
  {
    name: TName;
    as?: React.ElementType;
    asChild?: boolean;
    children:
      | React.ReactNode
      | ((field: {
          field: ControllerRenderProps<FieldValues, string>;
        }) => React.ReactNode);
  } & Omit<React.ComponentPropsWithoutRef<typeof DEFAULT_FIELD_TAG>, 'children'>
>;

const FormField = React.forwardRef<
  React.ElementRef<typeof DEFAULT_FIELD_TAG>,
  FormFieldProps<FieldValues, string>
>(({ name, as: Component = 'div', asChild = false, children }, ref) => {
  const { control } = useFormContext();
  const id = React.useId();

  const Element = asChild ? AsChild : Component;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormFieldContext.Provider value={{ name, id, field }}>
          <Element ref={ref}>
            {typeof children === 'function'
              ? children({ field })
              : React.isValidElement(children)
                ? React.cloneElement(children as React.ReactElement)
                : children}
          </Element>
        </FormFieldContext.Provider>
      )}
    />
  );
});
FormField.displayName = 'FormField';

export { FormField, type FormFieldProps };