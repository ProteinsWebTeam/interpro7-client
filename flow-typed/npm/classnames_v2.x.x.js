// flow-typed signature: 459665f9f4a22212c955ae9e8c6180ae
// flow-typed version: 02d4f1d2c5/classnames_v2.x.x/flow_>=v0.104.x <=v0.200.x

type $npm$classnames$Classes =
  | string
  | number
  | { [className: string]: *, ... }
  | boolean
  | void
  | null
  | $ReadOnlyArray<$npm$classnames$Classes>;

declare module "classnames" {
  declare module.exports: (...classes: Array<$npm$classnames$Classes>) => string;
}

declare module "classnames/bind" {
  declare module.exports: $Exports<"classnames">;
}

declare module "classnames/dedupe" {
  declare module.exports: $Exports<"classnames">;
}
