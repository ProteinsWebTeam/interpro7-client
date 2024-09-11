import React, {
  PropsWithChildren,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import {
  Editor,
  EditorState,
  ContentState,
  CompositeDecorator,
  Modifier,
  convertToRaw,
  ContentBlock,
  RawDraftContentBlock,
} from 'draft-js';

import { MAX_NUMBER_OF_SEQUENCES } from '..';

import cssBinder from 'styles/cssBinder';

import blocks from 'styles/blocks.css';
import local from '../style.css';
import searchPageCss from 'pages/Search/style.css';
import buttonCSS from 'components/SimpleCommonComponents/Button/style.css';
import InfoMessages from './InfoMessages';

const css = cssBinder(local, blocks, searchPageCss, buttonCSS);

const MIN_LENGTH = 3;

const classedSpan = (className: string) => {
  const Span = ({
    offsetKey,
    children,
  }: PropsWithChildren<{ offsetKey: string }>) => {
    return (
      <span className={className} data-offset-key={offsetKey}>
        {children}
      </span>
    );
  };
  return Span;
};

const strategy =
  (re: RegExp) =>
  (block: ContentBlock, cb: (start: number, end: number) => void) => {
    const text = block.getText();
    let match;
    while ((match = re.exec(text))) {
      cb(match.index, match.index + match[0].length);
    }
  };

const doesPreviousBlockHasContent = (
  block: ContentBlock,
  contentState: ContentState,
): boolean => {
  const before = contentState.getBlockBefore(block.getKey());
  if (!before) return true;
  const trimmed = before.getText().trim();
  if (trimmed === '' || trimmed.startsWith(';'))
    return doesPreviousBlockHasContent(before, contentState);
  return !trimmed.startsWith('>');
};

const commentsStrategy =
  (re: RegExp, forErrors = false) =>
  (
    block: ContentBlock,
    cb: (start: number, end: number) => void,
    contentState: ContentState,
  ) => {
    const text = block.getText();
    let match;
    while ((match = re.exec(text))) {
      const prevSequenceOK = doesPreviousBlockHasContent(block, contentState);
      if (!forErrors && (prevSequenceOK || text.trim().startsWith(';')))
        cb(match.index, match.index + match[0].length);
      if (forErrors && !prevSequenceOK)
        cb(match.index, match.index + match[0].length);
    }
  };

const compositeDecorator = new CompositeDecorator([
  {
    strategy: commentsStrategy(/^\s*[;].*$/gm),
    component: classedSpan(css('comment')),
  },
  {
    strategy: commentsStrategy(/^\s*[>].*$/gm),
    component: classedSpan(css('fasta-header')),
  },
  {
    strategy: commentsStrategy(/^\s*[>].*$/gm, true),
    component: classedSpan(css('invalid-comment')),
  },
  {
    strategy: strategy(/[^a-z]+/gi),
    component: classedSpan(css('invalid-letter')),
  },
]);

const headerRE = /^\s*>.*$/m;
const IUPACProtRE = /^[a-z\s]*$/im;

const trimSequenceLines = (lines: Array<string>) =>
  lines
    .map((l) => l.trim()) // trimming
    .map((l) => (l.startsWith(';') ? false : l)) // removing comments
    .filter(Boolean) as Array<string>;

const addFastAHeaderIfNeeded = (
  editorState: EditorState,
  lines: Array<string>,
) => {
  let incrementalId = 1;
  const minLengthForHeader = 3;
  const currentContent = editorState.getCurrentContent();
  if (currentContent.hasText()) {
    const firstLine = (lines?.[0] || '').trim();
    const hasHeader = firstLine.startsWith('>');
    if (!hasHeader && firstLine.length > minLengthForHeader) {
      const newHeader = `Sequence${incrementalId++}`;
      const header = `>${newHeader}`;
      // this.setState({ title: newHeader });
      lines.splice(0, 0, header);
      const newState = EditorState.createWithContent(
        ContentState.createFromText(lines.join('\n')),
        compositeDecorator,
      );
      return EditorState.moveFocusToEnd(newState);
    }
  }
  return null;
};

const hasContentInNextLine = (
  lines: Array<{ text: string }>,
  i: number,
): boolean => {
  if (i + 1 >= lines.length) return false;
  const line = lines[i + 1].text.trim();
  if (line.startsWith(';') || line === '')
    return hasContentInNextLine(lines, i + 1);
  if (line.startsWith('>')) return false;
  return true;
};

export const cleanUpBlocks = (blocks: RawDraftContentBlock[]) => {
  const headers: Record<string, number> = {};
  return blocks
    .map(({ text }, i, lines) => {
      const line = text.trim();
      if (!line) return null;
      if (line.startsWith(';')) return line;
      if (line.startsWith('>')) {
        let newLine = line;
        const header = line.slice(1).trim();
        if (header in headers) {
          headers[header]++;
          newLine += ` - ${headers[header]}`;
        } else {
          headers[header] = 1;
        }
        return hasContentInNextLine(lines, i) ? newLine : null;
      }
      return line.replace(/[^a-z\s]/gi, '').trim();
    })
    .filter(Boolean)
    .join('\n');
};

export type SequenceIssue = {
  type: 'invalidCharacters' | 'tooShort' | 'tooMany' | 'duplicatedHeaders';
  header?: string;
  detail?: string;
};

export const checkLines = (lines: Array<string>): Array<SequenceIssue> => {
  const issues: Array<SequenceIssue> = [];
  let count = 0;
  let firstLine = true;
  let currentHeader = '';
  const headersCount: Record<string, number> = {};
  let numberOfSequences = 0;
  const trimmedLines = trimSequenceLines(lines);
  for (const line of trimmedLines) {
    if (headerRE.test(line)) {
      if (!firstLine && count < MIN_LENGTH)
        issues.push({ type: 'tooShort', header: currentHeader });
      currentHeader = line;
      count = 0;
      numberOfSequences++;
      const header = line.slice(1).trim();
      if (!headersCount[header]) headersCount[header] = 1;
      else {
        headersCount[header]++;
        issues.push({
          type: 'duplicatedHeaders',
          header: `> ${header}`,
        });
      }
    } else {
      if (!IUPACProtRE.test(line)) {
        issues.push({
          type: 'invalidCharacters',
          detail: 'Invalid characters',
          header: currentHeader,
        });
      }
      count += line.trim().length;
    }
    firstLine = false;
  }
  // last sequence
  if (count < MIN_LENGTH)
    issues.push({ type: 'tooShort', header: currentHeader });
  if (numberOfSequences > MAX_NUMBER_OF_SEQUENCES) {
    issues.push({ type: 'tooMany' });
  }
  return issues;
};
type Props = {
  value?: string | null;
  onChecksChange?: (issues: Array<SequenceIssue>) => void;
};

export type SequenceInputHandle = {
  reset: (text?: string) => void;
  cleanUp: () => void;
  focusEditor: () => void;
  getContent: () => string;
  sequenceIssues: Array<SequenceIssue>;
  hasText: () => boolean;
};

const SequenceInput = React.forwardRef<SequenceInputHandle, Props>(
  ({ value, onChecksChange }: Props, ref) => {
    const editorRef = useRef<Editor>(null);
    const [editorState, setEditorState] = useState<EditorState>(
      EditorState.createEmpty(compositeDecorator),
    );
    const [issues, setIssues] = useState<Array<SequenceIssue>>([]);

    const runChecks = (lines: Array<string>) => {
      const newIssues: Array<SequenceIssue> = checkLines(lines);

      if (newIssues !== issues) {
        setIssues(newIssues);
        if (onChecksChange) {
          onChecksChange(newIssues);
        }
      }
    };
    const setNewText = (text: string) => {
      const editorState = EditorState.createWithContent(
        ContentState.createFromText(decodeURIComponent(text)),
        compositeDecorator,
      );
      const lines = convertToRaw(editorState.getCurrentContent()).blocks.map(
        (block) => block.text,
      );
      runChecks(lines);

      setEditorState(editorState);
    };
    useEffect(() => {
      if (!value) return;
      setNewText(value);
    }, [value]);

    const reset = (text?: string) => {
      setNewText(text || '');
    };

    const cleanUp = () => {
      const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
      const cleanedText = cleanUpBlocks(blocks);
      setNewText(cleanedText);
    };
    const focusEditor = () => {
      if (editorRef.current) editorRef.current.focus();
    };
    const getContent = () => {
      return convertToRaw(editorState.getCurrentContent())
        .blocks.map((block) => block.text)
        .join('\n');
    };
    const hasText = () => editorState.getCurrentContent().hasText();

    useImperativeHandle(ref, () => ({
      reset,
      cleanUp,
      focusEditor,
      getContent,
      sequenceIssues: issues,
      hasText,
    }));

    const handleChange = (newEditorState: EditorState): void => {
      const lines = convertToRaw(newEditorState.getCurrentContent()).blocks.map(
        (block) => block.text,
      );
      const stateWithHeader = addFastAHeaderIfNeeded(newEditorState, lines);
      if (stateWithHeader) {
        handleChange(stateWithHeader);
        return;
      }
      runChecks(lines);
      setEditorState(newEditorState);
    };

    const handlePastedText = (pasted: string): 'handled' => {
      const blockMap = ContentState.createFromText(pasted).getBlockMap();
      const newEditorState = EditorState.push(
        editorState,
        Modifier.replaceWithFragment(
          editorState.getCurrentContent(),
          editorState.getSelection(),
          blockMap,
        ),
        'insert-fragment',
      );
      handleChange(newEditorState);
      return 'handled';
    };
    const allOk = issues.length === 0;

    return (
      <section>
        <div onClick={focusEditor} role="presentation">
          <div
            className={css('editor', {
              'invalid-block': !allOk && hasText(),
              'valid-block': allOk && hasText(),
            })}
          >
            <Editor
              placeholder="Enter your sequence"
              editorState={editorState}
              // handleDroppedFiles={handleDroppedFiles}
              onChange={handleChange}
              handlePastedText={handlePastedText}
              ref={editorRef}
            />
          </div>
        </div>
        {hasText() && <InfoMessages sequenceIssues={issues} />}
      </section>
    );
  },
);

SequenceInput.displayName = 'SequenceInput';

export default SequenceInput;
