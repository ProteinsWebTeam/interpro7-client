import config from './test_config';

export const checkForElement = async (page, selector) => {
  let status = '';
  try {
    const selection = await page.waitForSelector(selector, {
      timeout: config.fast_timeout,
    });
  } catch (e) {
    status = e.toString();
  }
  return status;
};
