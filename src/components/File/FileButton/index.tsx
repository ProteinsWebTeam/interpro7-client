import React from 'react';

import ProgressButton from 'components/ProgressButton';
import Link from 'components/generic/Link';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import { HARD_LIMIT } from 'components/DownloadForm/Controls';

import TooltipContent from '../TooltipContent';

import cssBinder from 'styles/cssBinder';
import local from './style.css';
import ipro from 'styles/interpro-vf.css';
import buttonCSS from 'components/SimpleCommonComponents/Button/style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(local, ipro, buttonCSS, fonts);

const SMALL = 0.01;

const EXTENSIONS = {
  accession: 'txt',
  fasta: 'fasta',
  json: 'json',
  tsv: 'tsv',
};

export type SupportedExtensions = keyof typeof EXTENSIONS;

export type FileButtonProps = {
  fileType: DownloadFileTypes;
  url?: string;
  subpath?: string;
  count: number;
  name: string;
  progress?: number;
  minWidth?: number | string;
  successful?: boolean | null;
  blobURL?: string;
  label?: string;
  className?: string;
  handleClick: (event: Event) => void;
  shouldLinkToResults?: boolean;
  showIcon?: boolean;
  search?: InterProLocationSearch;
} & ({ url: string } | { blobURL: string });

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
  showIcon,
  minWidth,
  search,
}: FileButtonProps) => {
  const downloading = Number.isFinite(progress) && !successful;
  const failed = successful === false;

  let title = 'Click icon to generate';
  if (count > HARD_LIMIT) {
    title = 'Selected data is too large to download';
  }

  title += ` ${fileType} file`;

  const filename =
    name || `${fileType}.${EXTENSIONS[fileType as SupportedExtensions]}`;

  const buttonclassName = showIcon
    ? []
    : ['vf-button', 'vf-button--link', 'vf-button--sm'];

  const downloadButton = (
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
        className={css('file-button', ...buttonclassName, className, {
          downloading,
          failed,
        })}
      >
        <ProgressButton
          downloading={downloading}
          success={!!successful}
          failed={failed}
          iconType={fileType}
          progress={progress || SMALL}
        />
      </div>
    </Link>
  );
  return (
    <>
      {count > HARD_LIMIT ? (
        <Tooltip
          interactive
          useContext
          html={
            <TooltipContent
              title={title}
              count={count}
              subpath={subpath}
              fileType={fileType}
            />
          }
        >
          {downloadButton}
        </Tooltip>
      ) : (
        downloadButton
      )}
    </>
  );
};

export default FileButton;
