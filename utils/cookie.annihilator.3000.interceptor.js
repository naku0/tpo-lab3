class CookieAnnihilator3000Interceptor {
  static async annihilate(driver) {
    try {
      console.log('[COOKIE] Waiting Usercentrics');

      const exists = await driver.wait(async () => {
        return await driver.executeScript(`
                    return !!document.querySelector(
                        '#usercentrics-cmp-ui'
                    );
                `);
      }, 5000);

      if (!exists) {
        console.log('[COOKIE] Banner not found');

        return false;
      }

      console.log('[COOKIE] Removing overlay');

      await driver.executeScript(`

                const host =
                    document.querySelector(
                        '#usercentrics-cmp-ui'
                    );

                if (host) {
                    host.remove();
                }

            `);

      await driver.sleep(300);

      console.log('[COOKIE] Cookie annihilated');

      return true;
    } catch (e) {
      console.log('[COOKIE] Failed:', e.message);

      return false;
    }
  }
}

module.exports = CookieAnnihilator3000Interceptor;
