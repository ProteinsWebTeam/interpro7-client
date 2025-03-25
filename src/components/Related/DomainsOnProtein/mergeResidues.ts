const PIRSR_ACCESSION_LENGTH = 11;
const PIRSF_PREFIX_LENGTH = 5;

type FeatureWithResidues = MinimalFeature & {
  residues?: Array<ResidueMetadata>;
};
type ResidueEntry = ResidueMetadata & {
  linked?: boolean;
  type?: string;
};

/**
 * PIRSR residues associated with the same family can come from several models
 * which accession correspond to the family followed by the model. e.g. PIRSR000001-1 and PIRSR000001-2
 * This function groups those two model into a single residue with multiple locations.
 * @param {object} residues list of residues
 * @returns {object} list of residues with the PIRSR ones grouped
 */
const mergePIRSFRResidues = (residues: Record<string, ResidueMetadata>) => {
  const newResidues: Record<string, ResidueMetadata> = {};
  Object.keys(residues).forEach((acc) => {
    if (acc.startsWith('PIRSR')) {
      const newAcc = acc.substring(0, PIRSR_ACCESSION_LENGTH);

      if (!newResidues[newAcc]) {
        newResidues[newAcc] = {
          ...residues[acc],
          accession: newAcc,
          locations: [] as Array<ProtVistaLocation>,
        };
      }
      residues[acc].locations?.forEach(
        (location) => (location.accession = acc),
      );
      newResidues[newAcc].locations?.push(...(residues[acc].locations || []));
    } else {
      newResidues[acc] = { ...residues[acc] };
    }
  });
  return newResidues;
};

const mergeResidues = (
  data: ProteinViewerDataObject<MinimalFeature>,
  residuesPayload: ResiduesPayload,
) => {
  const residuesWithEntryDetails: Array<FeatureWithResidues> = [];
  const residues: Record<string, ResidueEntry> =
    mergePIRSFRResidues(residuesPayload);

  const { representative_domains: _, ...otherGroups } = data;
  Object.values(otherGroups).forEach(
    (
      group /*: Array<{accession:string, residues: Array<Object>, children: any}> */,
    ) =>
      group.forEach((entry) => {
        const resAccession = entry.accession.startsWith('PIRSF')
          ? `PIRSR${entry.accession.substring(
              PIRSF_PREFIX_LENGTH,
              PIRSR_ACCESSION_LENGTH,
            )}`
          : entry.accession;
        if (residues[resAccession]) {
          const matchedEntry: FeatureWithResidues = { ...entry };
          matchedEntry.accession = `residue:${entry.accession}`;
          matchedEntry.residues = [residues[resAccession]];
          residuesWithEntryDetails.push(matchedEntry);
          residues[resAccession].linked = true;
        }

        if (entry.children && entry.children.length)
          entry.children.forEach((child) => {
            const childResAccession = child.accession.startsWith('PIRSF')
              ? `PIRSR${child.accession.substring(
                  PIRSF_PREFIX_LENGTH,
                  PIRSR_ACCESSION_LENGTH,
                )}`
              : child.accession;
            if (residues[childResAccession]) {
              const matchedEntry: FeatureWithResidues = { ...child };
              matchedEntry.accession = `residue:${child.accession}`;
              matchedEntry.residues = [residues[childResAccession]];
              residuesWithEntryDetails.push(matchedEntry);
              residues[childResAccession].linked = true;
            }
          });
      }),
  );

  const unlinkedResidues: ResidueEntry[] = [];
  Object.values(residues)
    .filter(({ linked }) => !linked)
    .forEach((residue) => {
      residue.locations.forEach((location, i) => {
        const residueEntry = { ...residue };
        residueEntry.accession = `${
          location.accession || residue.accession
        }.${i}`;
        residueEntry.type = 'residue';
        residueEntry.locations = [location];
        unlinkedResidues.push(residueEntry);
      });
    });

  data.residues = (residuesWithEntryDetails as ResidueEntry[]).concat(
    unlinkedResidues,
  );
};

export default mergeResidues;
