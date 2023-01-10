import { VDomRenderer } from '@jupyterlab/apputils';
import { ThemeEditorModel } from './model';
import React, { useState } from 'react';
import Form from '@rjsf/core';
import { ChromePicker } from '@hello-pangea/color-picker';
import { requestAPI } from './handler';

function sendPostRequest(cssProperties: any) {
  requestAPI('send_cssProperties', {
    body: JSON.stringify(cssProperties),
    method: 'POST'
  })
    .then(data => {
      console.log('cssProperties sent to the server:', data);
    })
    .catch(reason => {
      console.error(
        `The jupyter_theme_editor server extension appears to be missing.\n${reason}`
      );
    });
}

interface IProps {
  formData: any;
  schema: any;
  uiSchema: any;
  cssProperties: any;
  onSubmit: () => void;
  setformData: (value: any) => void;
}

function FormComponent(props: IProps) {
  return (
    <Form
      schema={props.schema}
      formData={props.formData}
      uiSchema={props.uiSchema}
      onSubmit={(formData, event) => sendPostRequest(props.cssProperties)}
      onChange={event => {
        props.setformData(event.formData);
      }}
    />
  );
}

function ColorPicker(props: any) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="jp-theme-editor-button-color"
        type="button"
        style={{ backgroundColor: props.value }}
        onClick={() => {
          setOpen(!open);
        }}
      ></button>
      {open && (
        <ChromePicker
          className="jp-theme-editor-color-picker"
          color={props.value}
          onChange={color => props.onChange(color.hex)}
        />
      )}
    </>
  );
}

export class ThemeEditorView extends VDomRenderer<ThemeEditorModel> {
  public uiSchema: any;

  constructor(model: ThemeEditorModel) {
    super(model);
    this.addClass('jp-theme-editor-panel');
    this.uiSchema = {
      classNames: 'form-class',
      'ui:submitButtonOptions': {
        norender: false
      },
      'ui-font-size': {
        'ui:widget': 'range'
      },
      'content-font-size': {
        'ui:widget': 'range'
      },
      'code-font-size': {
        'ui:widget': 'range'
      },
      'border-width': {
        'ui:widget': 'range'
      },
      'border-radius': {
        'ui:widget': 'range'
      },
      'layout-color': {
        'ui:widget': ColorPicker
      },
      'accent-color': {
        'ui:widget': ColorPicker
      },
      'border-color': {
        'ui:widget': ColorPicker
      },
      'brand-color': {
        'ui:widget': ColorPicker
      },
      'error-color': {
        'ui:widget': ColorPicker
      },
      'info-color': {
        'ui:widget': ColorPicker
      },
      'success-color': {
        'ui:widget': ColorPicker
      },
      'warn-color': {
        'ui:widget': ColorPicker
      }
    };
  }
  render() {
    return (
      <FormComponent
        schema={this.model.schema}
        formData={this.model.formData}
        cssProperties={this.model.cssProperties}
        uiSchema={this.uiSchema}
        onSubmit={() => {
          console.log('Form is submitted');
        }}
        setformData={(value: any) => {
          this.model.formData = value;
        }}
      />
    );
  }
}
