import React from 'react';

import ProgressButton from 'components/ProgressButton';
import Link from 'components/generic/Link';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import { HARD_LIMIT } from 'components/DownloadForm/Controls';

import TooltipContent from '../TooltipContent';

import cssBinder from 'styles/cssBinder';
import local from './style.css';
import ipro from 'styles/interpro-vf.css';

const css = cssBinder(local, ipro);

const SMALL = 0.01;

const EXTENSIONS = {
  accession: 'txt',
  fasta: 'fasta',
  json: 'json',
  tsv: 'tsv',
};

export type SupportedExtensions = keyof typeof EXTENSIONS;

export type FileButtonProps = {
  fileType: SupportedExtensions;
  url: string;
  subpath?: string;
  count: number;
  name: string;
  progress?: number;
  minWidth?: number | string;
  successful?: boolean;
  blobURL?: string;
  label?: string;
  className?: string;
  handleClick: (event: Event) => void;
  shouldLinkToResults?: boolean;
  showIcon?: boolean;
  search?: Record<string, string>;
};

const FileButton = ({
  fileType,
  url,
  subpath,
  count,
  name,
  progress,
  successful,
  blobURL,
  handleClick,
  label,
  className,
  shouldLinkToResults = true,
  showIcon,
  minWidth,
  search,
}: FileButtonProps) => {
  const downloading = Number.isFinite(progress) && !successful;
  const failed = successful === false;
  let stateLabel = 'Generate';
  let title = 'Click icon to generate';
  if (count > HARD_LIMIT) {
    title = 'Direct download disabled for this';
    stateLabel = 'Disabled';
  } else if (downloading) {
    title = 'Generating';
    stateLabel = 'Generating';
  } else if (failed) {
    title = 'Failed generating';
    stateLabel = 'Failed';
  } else if (successful) {
    title = 'Download';
    stateLabel = 'Download';
  }
  title += ` ${fileType} file`;
  const labelToShow = label || stateLabel;

  const filename = name || `${fileType}.${EXTENSIONS[fileType]}`;

  const buttonClass = showIcon
    ? []
    : ['vf-button', 'vf-button--secondary', 'vf-button--sm'];
  return (
    <Tooltip
      interactive
      useContext
      html={
        <TooltipContent
          title={title}
          count={count}
          shouldLinkToResults={shouldLinkToResults}
          subpath={subpath}
          fileType={fileType}
          search={search}
        />
      }
    >
      <Link
        download={filename}
        href={blobURL || url}
        disabled={downloading || count > HARD_LIMIT || count === 0}
        onClick={downloading || successful ? undefined : handleClick}
        data-url={url}
        data-type={fileType}
        className={css('no-decoration')}
      >
        <div
          className={css('file-button', ...buttonClass, className, {
            downloading,
            failed,
          })}
          style={{ minWidth }}
        >
          <ProgressButton
            downloading={downloading}
            success={successful}
            failed={failed}
            progress={progress || SMALL}
          />
          {labelToShow && !showIcon && (
            <span className={css('file-label')}>{labelToShow}</span>
          )}
        </div>
      </Link>
    </Tooltip>
  );
};

export default FileButton;
