# Test Cases: Built-in Fixtures

## Overview

Test cases for understanding and effectively using Playwright's built-in fixtures like page, context, browser, and browserName.

## Page Fixture Test Cases

### TC-BF-001: Basic Page Fixture Usage

**Objective:** Verify the page fixture provides a functional page object.
**Steps:**

1. Use page fixture in test function parameter
2. Navigate to application URL using page.goto()
3. Verify page loads successfully
4. Perform basic page interactions

**Expected Result:** Page fixture provides fully functional page object.

### TC-BF-002: Page Fixture Auto-Cleanup

**Objective:** Verify page fixture automatically cleans up after test.
**Steps:**

1. Test 1: Use page fixture, navigate and interact
2. Test 2: Use page fixture, verify fresh page state
3. Verify no residual state from previous test

**Expected Result:** Page fixture provides clean page for each test.

### TC-BF-003: Page Fixture Navigation

**Objective:** Verify page fixture handles navigation correctly.
**Steps:**

1. Use page fixture to navigate to index.html
2. Navigate to context-a.html
3. Navigate to isolation-test.html
4. Verify navigation history and state

**Expected Result:** Page fixture handles navigation seamlessly.

### TC-BF-004: Page Fixture Element Interaction

**Objective:** Verify page fixture enables element interactions.
**Steps:**

1. Use page fixture to navigate to isolation-test page
2. Fill form using page.fill()
3. Click buttons using page.click()
4. Verify interactions work correctly

**Expected Result:** Page fixture provides full interaction capabilities.

### TC-BF-005: Page Fixture Wait Operations

**Objective:** Verify page fixture supports wait operations.
**Steps:**

1. Use page fixture to navigate to dynamic content page
2. Use page.waitForSelector() for dynamic elements
3. Use page.waitForLoadState() for page load
4. Verify wait operations work correctly

**Expected Result:** Page fixture supports all wait operations.

## Context Fixture Test Cases

### TC-BF-006: Basic Context Fixture Usage

**Objective:** Verify context fixture provides browser context.
**Steps:**

1. Use context fixture in test function parameter
2. Create page from context using context.newPage()
3. Navigate and interact with created page
4. Verify context provides expected functionality

**Expected Result:** Context fixture provides functional browser context.

### TC-BF-007: Context Fixture Isolation

**Objective:** Verify context fixture provides isolated context per test.
**Steps:**

1. Test 1: Use context, set cookies/localStorage
2. Test 2: Use context, verify clean state
3. Verify contexts are isolated between tests

**Expected Result:** Each test gets fresh, isolated context.

### TC-BF-008: Context Fixture Multiple Pages

**Objective:** Verify context fixture supports multiple pages.
**Steps:**

1. Use context fixture to create multiple pages
2. Navigate pages to different URLs
3. Verify pages share context state
4. Verify cross-page data sharing works

**Expected Result:** Multiple pages in same context share state appropriately.

### TC-BF-009: Context Fixture Configuration

**Objective:** Verify context fixture can be configured.
**Steps:**

1. Configure context with custom viewport
2. Configure context with custom user agent
3. Create pages and verify configuration applied
4. Test configuration persistence

**Expected Result:** Context configuration is properly applied and maintained.

## Browser Fixture Test Cases

### TC-BF-010: Basic Browser Fixture Usage

**Objective:** Verify browser fixture provides browser instance.
**Steps:**

1. Use browser fixture in test function parameter
2. Create context using browser.newContext()
3. Create page and navigate
4. Verify browser provides expected functionality

**Expected Result:** Browser fixture provides functional browser instance.

### TC-BF-011: Browser Fixture Multiple Contexts

**Objective:** Verify browser fixture supports multiple contexts.
**Steps:**

1. Use browser fixture to create multiple contexts
2. Create pages in each context
3. Verify contexts are isolated from each other
4. Verify browser manages multiple contexts properly

**Expected Result:** Browser supports multiple isolated contexts.

### TC-BF-012: Browser Fixture Persistence

**Objective:** Verify browser fixture persistence across tests.
**Steps:**

1. Test 1: Use browser fixture, note browser instance
2. Test 2: Use browser fixture, compare instance
3. Verify if browser is reused or fresh per test

**Expected Result:** Browser fixture behavior is consistent and documented.

## BrowserName Fixture Test Cases

### TC-BF-013: BrowserName Fixture Values

**Objective:** Verify browserName fixture provides correct browser identification.
**Steps:**

1. Use browserName fixture in test
2. Log browserName value
3. Verify value matches expected browser (chromium/firefox/webkit)
4. Use browserName for conditional test logic

**Expected Result:** BrowserName fixture accurately identifies current browser.

### TC-BF-014: BrowserName Conditional Testing

**Objective:** Verify browserName enables browser-specific test logic.
**Steps:**

1. Create test that behaves differently per browser
2. Use browserName to implement browser-specific logic
3. Run test on different browsers
4. Verify conditional logic works correctly

**Expected Result:** BrowserName enables effective browser-specific testing.

### TC-BF-015: BrowserName Test Skipping

**Objective:** Verify browserName can be used to skip tests.
**Steps:**

1. Create test that should only run on specific browser
2. Use browserName to conditionally skip test
3. Run on multiple browsers
4. Verify test skips appropriately

**Expected Result:** Tests skip correctly based on browser type.

## Fixture Combination Test Cases

### TC-BF-016: Multiple Fixtures in Single Test

**Objective:** Verify multiple fixtures can be used together.
**Steps:**

1. Use page, context, and browserName fixtures together
2. Verify all fixtures work harmoniously
3. Access properties from each fixture
4. Verify no conflicts between fixtures

**Expected Result:** Multiple fixtures work together without conflicts.

### TC-BF-017: Fixture Dependency Chain

**Objective:** Verify fixture dependencies work correctly.
**Steps:**

1. Use page fixture (depends on context, depends on browser)
2. Access parent fixtures through child fixtures
3. Verify dependency chain is maintained
4. Verify proper cleanup order

**Expected Result:** Fixture dependencies are properly maintained.

### TC-BF-018: Nested Fixture Usage

**Objective:** Verify fixtures work in nested test structures.
**Steps:**

1. Create test suite with describe blocks
2. Use fixtures at different nesting levels
3. Verify fixture scope and availability
4. Test fixture inheritance in nested structures

**Expected Result:** Fixtures work correctly at all nesting levels.

## Custom Fixture Integration Cases

### TC-BF-019: Custom Fixture with Built-in Fixtures

**Objective:** Verify custom fixtures integrate with built-in fixtures.
**Steps:**

1. Create custom fixture that uses page fixture
2. Use both custom and built-in fixtures in test
3. Verify they work together seamlessly
4. Verify proper setup/teardown order

**Expected Result:** Custom and built-in fixtures integrate seamlessly.

### TC-BF-020: Fixture Override Testing

**Objective:** Verify built-in fixtures can be customized/overridden.
**Steps:**

1. Create custom page fixture that extends built-in page
2. Use custom fixture in tests
3. Verify custom behavior is applied
4. Verify base functionality still works

**Expected Result:** Built-in fixtures can be effectively customized.

## Error Handling Test Cases

### TC-BF-021: Fixture Error Handling

**Objective:** Verify proper error handling when fixtures fail.
**Steps:**

1. Create scenario where fixture setup might fail
2. Verify error is properly reported
3. Verify test cleanup still occurs
4. Verify subsequent tests aren't affected

**Expected Result:** Fixture errors are handled gracefully.

### TC-BF-022: Fixture Timeout Handling

**Objective:** Verify fixture timeout scenarios are handled.
**Steps:**

1. Create scenario with slow fixture setup
2. Configure appropriate timeouts
3. Verify timeout behavior
4. Verify proper error reporting

**Expected Result:** Fixture timeouts are handled appropriately.

## Performance Test Cases

### TC-BF-023: Fixture Setup Performance

**Objective:** Verify fixture setup doesn't impact test performance significantly.
**Steps:**

1. Measure test execution time with and without fixtures
2. Compare setup overhead
3. Verify reasonable performance impact
4. Test with multiple fixtures

**Expected Result:** Fixture overhead is minimal and acceptable.

### TC-BF-024: Fixture Reuse Efficiency

**Objective:** Verify fixture reuse optimizes performance.
**Steps:**

1. Run tests with fixture reuse enabled
2. Run tests with fresh fixtures per test
3. Compare performance and resource usage
4. Verify reuse provides benefits

**Expected Result:** Fixture reuse provides measurable performance benefits.

## Advanced Fixture Cases

### TC-BF-025: Fixture Scope Testing

**Objective:** Verify fixture scope (test/worker/global) works correctly.
**Steps:**

1. Test fixtures with different scopes
2. Verify isolation boundaries
3. Verify reuse patterns
4. Test cleanup behavior for each scope

**Expected Result:** Fixture scopes behave as documented.

### TC-BF-026: Fixture Auto-Use Testing

**Objective:** Verify auto-use fixtures work correctly.
**Steps:**

1. Create auto-use fixture
2. Verify it runs automatically for all tests
3. Verify setup/teardown occurs appropriately
4. Test interaction with regular fixtures

**Expected Result:** Auto-use fixtures run automatically and reliably.

### TC-BF-027: Fixture Parameter Injection

**Objective:** Verify fixture parameters are properly injected.
**Steps:**

1. Create test with multiple fixture parameters
2. Verify all parameters are properly injected
3. Test parameter order independence
4. Verify type safety if using TypeScript

**Expected Result:** Fixture parameters are reliably injected with correct types.
