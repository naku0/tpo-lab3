const CookieAnnihilator3000Interceptor = require('../../utils/cookie.annihilator.3000.interceptor');
const { createDriver } = require('../../utils/driver.factory');
const { getExistingUser } = require('../../utils/user.provider');
const LoginPage = require('../UC-02/login.po');
const ProfilePage = require('./profile.po');
const HomePage = require('../../utils/sharedPageObjects/home.po');
const ProfileSettingsPage = require('./profile.settings.po');
const ImageProvider = require('../../utils/image.provider');
const LocationSettingsPage = require('./location.settings.po');

let loginPage;
let profilePage;
let profilePersonalPage;
let homePage;
let locationSettingsPage;
let driver;
let existingUser;

describe('UC-04', () => {
  beforeAll(async () => {
    driver = await createDriver();
    existingUser = getExistingUser();

    loginPage = new LoginPage(driver);
    profilePage = new ProfilePage(driver);
    profilePersonalPage = new ProfileSettingsPage(driver);
    homePage = new HomePage(driver);
    locationSettingsPage = new LocationSettingsPage(driver);

    await driver.get('https://login.xing.com');
    await loginPage.waitForPageLoad();
    await CookieAnnihilator3000Interceptor.annihilate(driver);

    await loginPage.login(existingUser);
    await homePage.waitForPageLoad();
    await CookieAnnihilator3000Interceptor.annihilate(driver);
  });

  beforeEach(async () => {
    await driver.get('https://www.xing.com/jobs/find');
    await homePage.waitForPageLoad();
    await CookieAnnihilator3000Interceptor.annihilate(driver);
    await homePage.openProfile();
    await profilePage.waitForPageLoad();
    await CookieAnnihilator3000Interceptor.annihilate(driver);
  });

  afterAll(async () => {
    await driver.quit();
  });

  describe('UC-04.1: Edit personal info', () => {
    beforeEach(async () => {
      await profilePage.waitForPageLoad();
      await CookieAnnihilator3000Interceptor.annihilate(driver);
      await profilePage.pushEditButton();
      await CookieAnnihilator3000Interceptor.annihilate(driver);
      await profilePage.openSettings();
      await profilePersonalPage.waitForPersonalPageLoad();
      await CookieAnnihilator3000Interceptor.annihilate(driver);
    });

    it.skip('should enable save button after changing name', async () => {
      // Arrange
      const isDisabledInitially =
        await profilePersonalPage.isSaveButtonDisabled();

      // Act
      await profilePersonalPage.enterName('New Test Name');

      // Assert
      const isEnabled = await profilePersonalPage.isSaveButtonEnabled();

      expect(isDisabledInitially).toBe(true);
      expect(isEnabled).toBe(true);
    });

    it.skip('should enable save button after changing last name', async () => {
      // Arrange
      const isDisabledInitially =
        await profilePersonalPage.isSaveButtonDisabled();

      // Act
      await profilePersonalPage.enterLastName('Test Lastname');

      // Assert
      expect(isDisabledInitially).toBe(true);
      expect(await profilePersonalPage.isSaveButtonEnabled()).toBe(true);
    });

    it.skip('should enable save button after changing title', async () => {
      // Arrange
      const isDisabledInitially =
        await profilePersonalPage.isSaveButtonDisabled();

      // Act
      await profilePersonalPage.selectTitle('Dr.');

      // Assert
      expect(isDisabledInitially).toBe(true);
      expect(await profilePersonalPage.isSaveButtonEnabled()).toBe(true);
    });

    it.skip('should disable save button when reverting changes', async () => {
      // Arrange
      const newName = 'Temporary Name';
      await profilePersonalPage.enterName(newName);

      // Act
      const isDisabledAfterRevert =
        await profilePersonalPage.isSaveButtonDisabled();

      //Assert
      expect(isDisabledAfterRevert).toBe(true);
    });
  });

  describe('UC-04.2 Edit Business info', () => {});

  describe('UC-04.3 Edit location info', () => {
    beforeEach(async () => {
      await profilePage.waitForPageLoad();
      await CookieAnnihilator3000Interceptor.annihilate(driver);
      await profilePage.pushEditButton();
      await CookieAnnihilator3000Interceptor.annihilate(driver);
      await profilePage.openLocation();
      await locationSettingsPage.waitForPersonalPageLoad();
      await CookieAnnihilator3000Interceptor.annihilate(driver);
    });

    it('should change city', async () => {
      let newCity = 'Saint Petersburg';
      await locationSettingsPage.enterCity(newCity);
      await locationSettingsPage.pushSaveButton();
      await profilePage.waitForPageLoad();
      await CookieAnnihilator3000Interceptor.annihilate(driver);
      let updatedCity = await profilePage.getCity();
      expect(updatedCity).toBe(newCity);
    });
  });

  describe('UC-04.4', () => {});

  describe('UC-04.5', () => {});
});
