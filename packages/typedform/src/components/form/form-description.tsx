import React from 'react';
import type { PropsWithAs } from '../../types';
import { AsChild } from '../as-child';
import { useFormField } from './form-field';

const DEFAULT_DESCRIPTION_TAG = 'p' as const;

type FormDescriptionProps = PropsWithAs<
  React.ComponentPropsWithoutRef<typeof DEFAULT_DESCRIPTION_TAG>
>;

const FormDescription = React.forwardRef<
  React.ElementRef<typeof DEFAULT_DESCRIPTION_TAG>,
  FormDescriptionProps
>(({ as: Component = 'p', asChild = false, ...props }, ref) => {
  const { formDescriptionId } = useFormField();
  const Element = asChild ? AsChild : Component;
  return <Element ref={ref} id={formDescriptionId} {...props} />;
});
FormDescription.displayName = 'FormDescription';

export { FormDescription, type FormDescriptionProps };
