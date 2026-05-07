const { allure } = require('jest-allure2-reporter/api');
const DriverFactory = require('./utils/driver.factory');

global.allure = allure;

const TEST_BROWSER = process.env.TEST_BROWSER || 'chrome';

beforeAll(async () => {
  global.driver = await DriverFactory.createDriver(TEST_BROWSER);
});

afterEach(async () => {
  const state = expect.getState();
  const testFailed = state.errors && state.errors.length > 0;
  if (global.driver && testFailed) {
    try {
      const screenshot = await global.driver.takeScreenshot();
      const currentUrl = await global.driver.getCurrentUrl();
      const html = await global.driver.getPageSource();

      await allure.attachment('URL', currentUrl, 'text/plain');
      await allure.attachment(
        'Скриншот при падении',
        Buffer.from(screenshot, 'base64'),
        'image/png'
      );
      await allure.attachment(
        'HTML при падении',
        Buffer.from(html, 'base64'),
        'text/html'
      );
    } catch (error) {
      console.error('Не удалось сделать скриншот:', error);
    }
  }
});

afterAll(async () => {
  if (global.driver) {
    await global.driver.quit();
    global.driver = null;
  }
});
