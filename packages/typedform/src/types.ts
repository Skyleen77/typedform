export type ReactTag =
  | keyof React.JSX.IntrinsicElements
  | React.JSXElementConstructor<any>;

export type PropsWithAs<TProps = {}> = TProps & {
  as?: ReactTag;
  asChild?: boolean;
};
