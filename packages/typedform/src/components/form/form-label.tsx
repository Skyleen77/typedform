import { AsChild } from '../as-child';
import { useFormField } from './form-field';
import { forwardRefPolymorphic } from '../../utils';

const DEFAULT_LABEL_TAG = 'label' as const;

type FormLabelProps = {};

const FormLabel = forwardRefPolymorphic<
  typeof DEFAULT_LABEL_TAG,
  FormLabelProps
>((props, ref) => {
  const {
    as: Component = DEFAULT_LABEL_TAG,
    asChild = false,
    ...restProps
  } = props;

  const { formItemId } = useFormField();

  const Element = asChild ? AsChild : Component;

  return <Element ref={ref} htmlFor={formItemId} {...restProps} />;
});

FormLabel.displayName = 'FormLabel';

export { FormLabel, type FormLabelProps };
