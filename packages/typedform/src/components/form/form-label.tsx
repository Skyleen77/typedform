import React from 'react';
import type { PropsWithAs } from '../../types';
import { AsChild } from '../as-child';
import { useFormField } from './form-field';

const DEFAULT_LABEL_TAG = 'label' as const;

type FormLabelProps = PropsWithAs<
  React.ComponentPropsWithoutRef<typeof DEFAULT_LABEL_TAG>
>;

const FormLabel = React.forwardRef<
  React.ElementRef<typeof DEFAULT_LABEL_TAG>,
  FormLabelProps
>(({ as: Component = DEFAULT_LABEL_TAG, asChild = false, ...props }, ref) => {
  const { formItemId } = useFormField();
  const Element = asChild ? AsChild : Component;
  return <Element ref={ref} htmlFor={formItemId} {...props} />;
});
FormLabel.displayName = 'FormLabel';

export { FormLabel, type FormLabelProps };
