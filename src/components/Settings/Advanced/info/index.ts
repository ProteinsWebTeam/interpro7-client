type gitInfo = {
  branch?: string;
  commit?: string;
  tag?: string;
};

export type devInfo = {
  build?: { time: number };
  mode?: string;
  git?: gitInfo;
};

type ExtendedProcess = NodeJS.Process & { info: devInfo };

export default (process as ExtendedProcess).info;
