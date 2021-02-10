// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import ResizeObserverComponent from 'wrappers/ResizeObserverComponent';

import { Stage, ColormakerRegistry } from 'ngl';

import { foundationPartial } from 'styles/foundation';
import fonts from 'EBI-Icon-fonts/fonts.css';
import style from './style.css';

const f = foundationPartial(style, fonts);
/*:: type Props = {
  id: string,
  elementId: string,
  onStructureLoaded?: function,
  isSpinning?: boolean,
  shouldResetViewer?: boolean,
  selections: Array<Array<string>>,
}; */

class StructureView extends PureComponent /*:: <Props> */ {
  /*:: _structureViewer: { current: ?HTMLElement }; */
  /*:: stage: Object; */
  /*:: name: Object; */

  static propTypes = {
    id: T.oneOfType([T.string, T.number]).isRequired,
    elementId: T.string,
    onStructureLoaded: T.func,
    isSpinning: T.bool,
    shouldResetViewer: T.bool,
    selections: T.array,
  };

  constructor(props /*: Props */) {
    super(props);

    this.stage = null;
    this.name = `${this.props.id}`;
    this._structureViewer = React.createRef();
  }

  async componentDidMount() {
    this.stage = new Stage(this._structureViewer.current);
    this.stage.setParameters({ backgroundColor: 0xfcfcfc });
    this.loadURLInStage(`rcsb://${this.name}.mmtf`);
  }
  componentDidUpdate() {
    if (this.name !== `${this.props.id}`) {
      this.name = `${this.props.id}`;
      this.stage.removeAllComponents();
      this.loadURLInStage(`rcsb://${this.name}.mmtf`);
    }
    if (this.stage) {
      this.stage.setSpin(this.props.isSpinning);
      if (this.props.shouldResetViewer) {
        this.stage.autoView();
      }
      if (this.props.selections?.length) {
        this.highlightSelections(this.props.selections);
      } else {
        this.clearSelections();
      }
    }
  }
  loadURLInStage(url) {
    this.stage
      .loadFile(url, { defaultRepresentation: false })
      .then((component) => {
        component.addRepresentation('cartoon', { colorScheme: 'chainname' });
        component.autoView();
      })
      .then(() => {
        this.stage.handleResize();
        if (this.props?.onStructureLoaded) this.props?.onStructureLoaded();
      });
  }

  highlightSelections(selections) {
    if (!this.stage) return;
    const components = this.stage.getComponentsByName(this.name);
    if (components) {
      components.forEach((component) => {
        const theme = ColormakerRegistry.addSelectionScheme(
          selections,
          'highlight',
        );
        component.addRepresentation('cartoon', { color: theme });
      });
    }
  }
  clearSelections() {
    if (!this.stage) return;
    const components = this.stage.getComponentsByName(this.name);
    if (components) {
      components.forEach((component) => {
        component.addRepresentation('cartoon', {
          colorScheme: 'chainname',
        });
      });
    }
  }

  render() {
    return (
      <ResizeObserverComponent
        element="div"
        updateCallback={() => {
          if (this.stage) this.stage.handleResize();
        }}
        measurements={['width', 'height']}
        className={f('viewer-resizer')}
      >
        {() => {
          return (
            <div
              id={this.props.elementId || 'structure-viewer'}
              ref={this._structureViewer}
              className={f('structure-viewer-ref')}
            />
          );
        }}
      </ResizeObserverComponent>
    );
  }
}

export default StructureView;
