export type PropsWithAs<TProps = {}> = TProps & {
  as?: ReactTag;
  asChild?: boolean;
};

export type ReactTag =
  | keyof JSX.IntrinsicElements
  | React.JSXElementConstructor<any>;

export type PolymorphicProps<C extends ReactTag, Props = {}> =
  | (Props & { asChild: true; as?: never } & { children?: React.ReactNode })
  | (Props & { asChild?: false | undefined; as?: C } & Omit<
        React.ComponentPropsWithoutRef<C>,
        keyof Props | 'as' | 'asChild'
      >);

export type PolymorphicRef<E extends ReactTag> =
  React.ComponentPropsWithRef<E>['ref'];

export type PolymorphicComponentProps<
  C extends ReactTag,
  Props = {},
> = PolymorphicProps<C, Props> & {
  ref?: PolymorphicRef<C>;
};

export type PolymorphicForwardRefComponent<D extends ReactTag, P = {}> = {
  <C extends ReactTag = D>(
    props: PolymorphicComponentProps<C, P>,
  ): React.ReactElement | null;
  displayName?: string;
};
