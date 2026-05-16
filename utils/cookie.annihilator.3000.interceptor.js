class CookieAnnihilator3000Interceptor {
  static async annihilate(driver) {
    try {
      console.log('[COOKIE] Waiting Usercentrics host');

      await driver.wait(async () => {
        return await driver.executeScript(`
                    return !!document.querySelector(
                        '#usercentrics-cmp-ui'
                    );
                `);
      }, 3000);

      console.log('[COOKIE] Host found');

      const clicked = await driver.executeScript(`

                const host =
                    document.querySelector(
                        '#usercentrics-cmp-ui'
                    );

                if (!host) {
                    return false;
                }

                const root = host.shadowRoot;

                if (!root) {
                    return false;
                }

                const button = root.querySelector(
                    'button[data-action-type="accept"]'
                );

                if (!button) {
                    return false;
                }

                button.click();

                return true;
            `);

      if (!clicked) {
        console.log('[COOKIE] Accept button not found');

        return false;
      }

      console.log('[COOKIE] Clicked accept');

      await driver.wait(async () => {
        return await driver.executeScript(`

                    const host =
                        document.querySelector(
                            '#usercentrics-cmp-ui'
                        );

                    if (!host) {
                        return true;
                    }

                    return host.offsetParent === null;

                `);
      }, 10000);

      console.log('[COOKIE] Cookie annihilated');

      return true;
    } catch (e) {
      console.log('[COOKIE] Failed:', e.message);

      return false;
    }
  }
}

module.exports = CookieAnnihilator3000Interceptor;
