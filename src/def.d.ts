type DecodeInput<V = Record<string, unknown>> = {
  bytes: number[];
  fPort: number;
  variables: V;
};

type DecodeOutput<T = Record<string, unknown>> = {
  data: T;
};

type EncodeInput<V = Record<string, unknown>> = {
  bytes: number[];
  fPort: number;
  variables: V;
};

type EncodeOutput = {
  bytes: number[];
};
