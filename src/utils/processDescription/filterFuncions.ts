

export const findIn = (
  description: InterProDescription,
  fn: ({isFilter, order}:EndpointPartialLocation)=> boolean,
) =>
  Object.entries(description)
    .find(([_key, value]) => fn(value as EndpointPartialLocation)) || [];

export const filterIn = (
  description: InterProDescription,
  fn: ({isFilter, order}:EndpointPartialLocation)=> boolean,
) =>
  Object.entries(description) 
    .filter(([_key, value]) => fn(value as EndpointPartialLocation)) || [];
