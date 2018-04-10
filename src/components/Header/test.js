// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import {
  _HamburgerBtn as HamburgerBtn,
  _SideIcons as SideIcons,
  Header,
} from '.';

const renderer = new ShallowRenderer();

describe('<HamburgerBtn />', () => {
  test('open, svg, stuck', () => {
    renderer.render(<HamburgerBtn openSideNav={() => {}} open svg stuck />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  test('open, svg, unstuck', () => {
    renderer.render(
      <HamburgerBtn openSideNav={() => {}} open svg stuck={false} />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  test('open, nosvg, stuck', () => {
    renderer.render(
      <HamburgerBtn openSideNav={() => {}} open svg={false} stuck />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  test('open, nosvg, unstuck', () => {
    renderer.render(
      <HamburgerBtn openSideNav={() => {}} open svg={false} stuck />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  test('closed, svg, stuck', () => {
    renderer.render(
      <HamburgerBtn openSideNav={() => {}} open={false} svg stuck />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  test('closed, svg, unstuck', () => {
    renderer.render(
      <HamburgerBtn openSideNav={() => {}} open={false} svg stuck={false} />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  test('closed, nosvg, stuck', () => {
    renderer.render(
      <HamburgerBtn openSideNav={() => {}} open={false} svg={false} stuck />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  test('closed, nosvg, unstuck', () => {
    renderer.render(
      <HamburgerBtn
        openSideNav={() => {}}
        open={false}
        svg={false}
        stuck={false}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('<SideIcons />', () => {
  test('movedAway, stuck, lowGraphics', () => {
    renderer.render(<SideIcons movedAway stuck lowGraphics />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  test('movedAway, stuck, no lowGraphics', () => {
    renderer.render(<SideIcons movedAway stuck lowGraphics={false} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  test('movedAway, unstuck, lowGraphics', () => {
    renderer.render(<SideIcons movedAway stuck={false} lowGraphics />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  test('movedAway, unstuck, no lowGraphics', () => {
    renderer.render(<SideIcons movedAway stuck={false} lowGraphics={false} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  test('not movedAway, stuck, lowGraphics', () => {
    renderer.render(<SideIcons movedAway={false} stuck lowGraphics />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  test('not movedAway, stuck, no lowGraphics', () => {
    renderer.render(<SideIcons movedAway={false} stuck lowGraphics={false} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  test('not movedAway, unstuck, lowGraphics', () => {
    renderer.render(<SideIcons movedAway={false} stuck={false} lowGraphics />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  test('not movedAway, unstuck, no lowGraphics', () => {
    renderer.render(
      <SideIcons movedAway={false} stuck={false} lowGraphics={false} />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('<Header />', () => {
  test('stuck, signature', () => {
    renderer.render(<Header stuck isSignature stickyMenuOffset={40} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  test('stuck, not signature', () => {
    renderer.render(<Header stuck isSignature={false} stickyMenuOffset={40} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  test('unstuck, signature', () => {
    renderer.render(<Header stuck={false} isSignature stickyMenuOffset={40} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  test('unstuck, not signature', () => {
    renderer.render(
      <Header stuck={false} isSignature={false} stickyMenuOffset={40} />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
