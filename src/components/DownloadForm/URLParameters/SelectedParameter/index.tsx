import React, { useRef, useEffect, useState, FormEvent } from 'react';
import { noop } from 'lodash-es';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import { Button } from 'components/SimpleCommonComponents/Button';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from '../../style.css';
import InputGroup from '../../InputGroup';

const css = cssBinder(local, fonts);

export const getTextAfterLastSlash = (text: string) =>
  text.slice(1 + text.lastIndexOf('/'));

type Props = {
  data?: OpenAPIParameter;
  dataComponents?: OpenAPIComponents;
  value?: string;
  onRemove: () => void;
  onChange: (event: FormEvent) => void;
};

const SelectedParameter = ({
  data,
  dataComponents,
  value,
  onRemove,
  onChange,
}: Props) => {
  const buttonEl = useRef(null);
  useEffect(() => {
    onChange({ target: buttonEl.current } as unknown as FormEvent);
  }, []);
  if (!data || !dataComponents) return null;
  let schema = data.schema;
  const isValid = (value?: string) => {
    if (!value) return false;
    const pattern = (schema as OpenAPIParameterSchema)?.pattern;
    if (pattern) {
      const regex = RegExp(pattern || '');
      return regex.test(value);
    }
    return true;
  };
  const [valid, setValid] = useState(isValid(value));
  let inputType = 'text';
  const ref = (data.schema as OpenAPIReference).$ref;
  if (ref) {
    const key = getTextAfterLastSlash(ref || '');
    schema = dataComponents.schemas[key];
  }
  const type = (schema as OpenAPIParameterSchema).type;
  const options = (schema as OpenAPIParameterSchema).enum;
  if (type === 'string' && options) {
    inputType = options.length === 1 ? 'checkbox' : 'select';
  }

  const validatePattern = (event: FormEvent) => {
    setValid(isValid((event.target as HTMLInputElement).value));
  };

  const name = `search.${data.name}`;
  return (
    <InputGroup
      label={
        <>
          {data.name}{' '}
          <Tooltip title={`<pre>${data.description}</pre>`}>
            <span
              className={css('small', 'icon', 'icon-common')}
              data-icon="&#xf129;"
              aria-label={`description for attribute: ${data.name}`}
            />
          </Tooltip>
        </>
      }
      input={
        <>
          {inputType === 'select' && (
            <select
              className={css('new-input-group-field')}
              name={name}
              value={value}
              onChange={noop}
              onBlur={noop}
            >
              {(schema as OpenAPIParameterSchema).enum?.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          )}
          {inputType === 'checkbox' && (
            <input
              name={name}
              type="text"
              readOnly
              className={css('new-input-group-field')}
              value={data.name}
            />
          )}
          {inputType === 'text' && (
            <input
              value={value}
              onChange={validatePattern}
              onBlur={noop}
              name={name}
              type="text"
              style={{
                backgroundColor: valid ? 'inherit' : '#fa7e6e',
              }}
              className={css('new-input-group-field')}
            />
          )}
        </>
      }
      button={
        <Button onClick={onRemove} ref={buttonEl}>
          Remove
        </Button>
      }
    />
  );
};

export default SelectedParameter;
