import React from 'react';

export default {
  title: 'InterPro7 Storybook',
  id: '0',
};

export const ToStorybook = () => (
  <div>
    <h3>InterPro7 Storybook</h3>
    <div>
      This is a collection of the most used components in the InterPro7 website.
    </div>
    <div>
      The tabs below can help you to include each component in the codebase.
      <dl>
        <dt>Story</dt>
        <dd>
          Includes the code of the current example. So you can see how to use
          it.
        </dd>
        <dt>Actions</dt>
        <dd>
          If the component triggers an event, it will be logged in the actions
          panel.
        </dd>
        <dt>Knobs</dt>
        <dd>
          Some interactive components to manipulate some of the attributes.
        </dd>
      </dl>
    </div>
  </div>
);

ToStorybook.story = {
  name: 'Introduction',
};
