export const splitSequenceByChunks = (
  sequence: string,
  id: string,
  encode: boolean = true
) => {
  const start = 1;
  const end = sequence.length;
  // Split lines
  const formattedSequence = sequence
    .slice(Math.max(0, start - 1), end)
    .replace(/(.{1,80})/g, '$1\n');
  const meta = `>${id} ${start}-${end}`.trim();
  const output = `${meta}\n${formattedSequence}`;
  return encode ? encodeURIComponent(output) : output;
};
