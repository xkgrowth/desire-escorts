import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  
  // Test Desktop Viewport
  console.log('\n=== DESKTOP VIEWPORT (1280x720) ===\n');
  const desktopPage = await browser.newPage();
  await desktopPage.setViewport({ width: 1280, height: 720 });
  await desktopPage.goto('http://localhost:3000/escorts', { waitUntil: 'networkidle0' });
  
  // Check for desktop filter panel
  const desktopFilterPanel = await desktopPage.$('aside.lg\\:block');
  const desktopFilterHeading = await desktopPage.$eval(
    'aside.lg\\:block h2',
    el => el.textContent
  ).catch(() => null);
  
  const desktopAgeSlider = await desktopPage.$('aside.lg\\:block div:has-text("Age")');
  const desktopHeightSlider = await desktopPage.$('aside.lg\\:block div:has-text("Height")');
  const desktopCupSlider = await desktopPage.$('aside.lg\\:block div:has-text("Cup Size")');
  const desktopBuildDropdown = await desktopPage.$('aside.lg\\:block button:has-text("Build Type")');
  const desktopResetButton = await desktopPage.$('aside.lg\\:block button:has-text("Reset Filter")');
  const desktopMobileButton = await desktopPage.$('button:has-text("Filters").lg\\:hidden');
  
  console.log('Desktop Filter Panel Visible:', !!desktopFilterPanel);
  console.log('Desktop Filter Heading:', desktopFilterHeading);
  console.log('Desktop Age Control:', !!desktopAgeSlider);
  console.log('Desktop Height Control:', !!desktopHeightSlider);
  console.log('Desktop Cup Size Control:', !!desktopCupSlider);
  console.log('Desktop Build Type Dropdown:', !!desktopBuildDropdown);
  console.log('Desktop Reset Filter Button:', !!desktopResetButton);
  console.log('Desktop Mobile Filter Button Hidden:', !desktopMobileButton || !(await desktopMobileButton.isVisible()));
  
  await desktopPage.close();
  
  // Test Mobile Viewport
  console.log('\n=== MOBILE VIEWPORT (375x667) ===\n');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 375, height: 667 });
  await mobilePage.goto('http://localhost:3000/escorts', { waitUntil: 'networkidle0' });
  
  // Check for mobile filter button
  const mobileFilterButton = await mobilePage.$('button:has-text("Filters")');
  const mobileFilterButtonVisible = mobileFilterButton ? await mobileFilterButton.isVisible() : false;
  const mobileFilterPanel = await mobilePage.$('aside.lg\\:block');
  const mobileFilterPanelVisible = mobileFilterPanel ? await mobileFilterPanel.isVisible() : false;
  
  console.log('Mobile Filter Button Visible:', mobileFilterButtonVisible);
  console.log('Mobile Desktop Panel Hidden:', !mobileFilterPanelVisible);
  
  // Click the mobile filter button to open modal
  if (mobileFilterButton) {
    await mobileFilterButton.click();
    await mobilePage.waitForTimeout(500); // Wait for modal animation
    
    const modalOpen = await mobilePage.$('div.fixed.inset-0.z-50');
    const modalHeading = await mobilePage.$eval(
      'div.fixed.inset-0 h2',
      el => el.textContent
    ).catch(() => null);
    const modalAgeControl = await mobilePage.$('div.fixed.inset-0 div:has-text("Age")');
    const modalResetButton = await mobilePage.$('div.fixed.inset-0 button:has-text("Wissen")');
    const modalShowButton = await mobilePage.$('div.fixed.inset-0 button:has-text("Toon")');
    
    console.log('\nMobile Modal After Click:');
    console.log('Modal Open:', !!modalOpen);
    console.log('Modal Heading:', modalHeading);
    console.log('Modal Age Control Present:', !!modalAgeControl);
    console.log('Modal Reset Button Present:', !!modalResetButton);
    console.log('Modal Show Results Button Present:', !!modalShowButton);
  }
  
  await mobilePage.close();
  await browser.close();
  
  console.log('\n=== VERIFICATION COMPLETE ===\n');
})();
