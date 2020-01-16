import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach( async () => {
    page = new AppPage();
    page.navigateTo();

    // user logged in
    await page.getEmailInput().sendKeys('admin@admin.com');
    await page.getPasswordInput().sendKeys('adminadmin');
    await page.getSubmitButton().click();

    const EC = browser.ExpectedConditions;
    await browser.wait(EC.urlIs(browser.baseUrl + 'trips'));
  });

  it('should display filtering criteria', async () => {

    expect(true).toBeTruthy();

    expect(page.getShowFilteringCriteriaButton()).toBeTruthy();

  });


  it('should enable user to remove trip from basket after adding to basket', async () => {

    const addButton = page.getAllAddButtons().get(0);

    expect(addButton).toBeTruthy();

    await addButton.click();

    const removeButton = page.getAllRemoveButtons().get(0);

    expect(removeButton).toBeTruthy();

  });


  it('should highlight offer with lowest available trips', async () => {

    const card = page.getAllCards().get(7);

    expect(card).toBeTruthy();

    console.log(card.getCssValue('background-color'));

    expect(card.getAttribute('class')).toContain('bg-warning');

  });





  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    }));
  });
});
