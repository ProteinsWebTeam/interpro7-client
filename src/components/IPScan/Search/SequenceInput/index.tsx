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

import getId from 'utils/cheap-unique-id';

import { MAX_NUMBER_OF_SEQUENCES } from '..';

import cssBinder from 'styles/cssBinder';

import blocks from 'styles/blocks.css';
import local from '../style.css';
import searchPageCss from 'pages/Search/style.css';
import buttonCSS from 'components/SimpleCommonComponents/Button/style.css';
import InfoMessages from './InfoMessages';

const css = cssBinder(local, blocks, searchPageCss, buttonCSS);

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

export const checkValidity = (lines: Array<string>) => {
  let numberOfSequences = 0;
  let gotContentYet = false;
  const trimmedLines = trimSequenceLines(lines);
  if (!headerRE.test(trimmedLines[0]) && !IUPACProtRE.test(trimmedLines[0]))
    return false;
  for (const line of trimmedLines) {
    if (headerRE.test(line)) {
      if (numberOfSequences > 0 && !gotContentYet) return false;
      gotContentYet = false;
      numberOfSequences++;
    } else if (IUPACProtRE.test(line)) {
      gotContentYet = true;
    } else {
      return false;
    }
  }
  return numberOfSequences <= MAX_NUMBER_OF_SEQUENCES && gotContentYet;
};

const MIN_LENGTH = 3;

export const isTooShort = (lines: Array<string>) => {
  let count = 0;
  let firstLine = true;
  const trimmedLines = trimSequenceLines(lines);
  for (const line of trimmedLines) {
    if (headerRE.test(line)) {
      if (!firstLine && count < MIN_LENGTH) return true;
      count = 0;
    } else {
      count += line.trim().length;
    }
    firstLine = false;
  }
  return count < MIN_LENGTH;
};

const hasHeaderIssues = (lines: Array<string>) => {
  const trimmedLines = trimSequenceLines(lines);
  const isFirstLineAComment =
    trimmedLines.length && trimmedLines[0].startsWith('>');
  const numberOfHeaders = trimmedLines.filter((l) => l.startsWith('>')).length;
  if (numberOfHeaders === 0) return false;
  if (numberOfHeaders === 1 && isFirstLineAComment) return false;
  for (let x = 1; x < lines.length; x++) {
    if (lines[x - 1].startsWith('>') && lines[x].startsWith('>')) return true; // it has 2 consecutive headers
  }
  return false;
};

const hasTooManySequences = (lines: Array<string>) => {
  const trimmedLines = trimSequenceLines(lines);
  return (
    trimmedLines.filter((line) => line.startsWith('>')).length >
    MAX_NUMBER_OF_SEQUENCES
  );
};

const addFastAHeaderIfNeeded = (
  editorState: EditorState,
  lines: Array<string>,
) => {
  const minLengthForHeader = 3;
  const currentContent = editorState.getCurrentContent();
  if (currentContent.hasText()) {
    const firstLine = (lines?.[0] || '').trim();
    const hasHeader = firstLine.startsWith('>');
    if (!hasHeader && firstLine.length > minLengthForHeader) {
      const newHeader = `Sequence${getId()}`;
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
  return blocks
    .map(({ text }, i, lines) => {
      const line = text.trim();
      if (!line) return null;
      if (line.startsWith(';')) return line;
      if (line.startsWith('>'))
        return hasContentInNextLine(lines, i) ? line : null;

      return line.replace(/[^a-z\s]/gi, '').trim();
    })
    .filter(Boolean)
    .join('\n');
};

export type SequenceChecks = {
  valid: boolean;
  hasText: boolean;
  tooShort: boolean;
  tooMany: boolean;
  headerIssues: boolean;
};
type Props = {
  value?: string | null;
  onChecksChange?: (tests: SequenceChecks) => void;
};

export type SequenceInputHandle = {
  reset: (text?: string) => void;
  cleanUp: () => void;
  focusEditor: () => void;
  getContent: () => string;
  sequenceTests: SequenceChecks;
};

const SequenceInput = React.forwardRef<SequenceInputHandle, Props>(
  ({ value, onChecksChange }: Props, ref) => {
    const editorRef = useRef<Editor>(null);
    const [editorState, setEditorState] = useState<EditorState>(
      EditorState.createEmpty(compositeDecorator),
    );
    const [tests, setTests] = useState<SequenceChecks>({
      valid: true,
      hasText: false,
      tooShort: true,
      tooMany: false,
      headerIssues: false,
    });

    const runChecks = (lines: Array<string>) => {
      const result = {
        valid: checkValidity(lines),
        hasText: editorState.getCurrentContent().hasText(),
        tooShort: isTooShort(lines),
        tooMany: hasTooManySequences(lines),
        headerIssues: hasHeaderIssues(lines),
      };
      if (result !== tests) {
        setTests(result);
        if (onChecksChange) {
          onChecksChange(result);
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

    useImperativeHandle(ref, () => ({
      reset,
      cleanUp,
      focusEditor,
      getContent,
      sequenceTests: tests,
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

    return (
      <section>
        <div onClick={focusEditor} role="presentation">
          <div
            className={css('editor', {
              'invalid-block':
                !tests.valid && editorState.getCurrentContent().hasText(),
              'valid-block':
                tests.valid &&
                editorState.getCurrentContent().hasText() &&
                !tests.tooShort &&
                !tests.headerIssues,
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
        {editorState.getCurrentContent().hasText() && (
          <InfoMessages
            valid={tests.valid}
            tooShort={tests.tooShort}
            headerIssues={tests.headerIssues}
            tooMany={tests.tooMany}
          />
        )}
      </section>
    );
  },
);

SequenceInput.displayName = 'SequenceInput';

export default SequenceInput;
