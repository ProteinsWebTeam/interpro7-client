import React, { ComponentType } from 'react';

type Props = {
  obj: Record<string, unknown>;
  component: ComponentType<{ value: unknown; k: string }>;
};

// Probably never used as it is a placeholder for normally unreachable related pieces.
const ObjectToList = ({ obj, component: Component }: Props) => {
  return (
    <ul>
      {Object.entries(obj)
        .filter(
          ([_, v]) =>
            // value !== 0 or, if object, contains values
            v && (typeof v !== 'object' || Object.keys(v).length)
        )
        .map(([k, value]) => (
          <li key={k}>
            {typeof value === 'object' ? (
              <span>
                {`${k}: `}
                <ObjectToList
                  obj={value as Record<string, unknown>}
                  component={Component}
                />
              </span>
            ) : (
              <Component value={value} k={k} />
            )}
          </li>
        ))}
    </ul>
  );
};

export default ObjectToList;
