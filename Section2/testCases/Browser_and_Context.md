# Test Cases: Browser and Context

## Overview

Test cases for understanding browser instances, browser contexts, and their isolation properties in Playwright.

## Positive Test Cases

### TC-BC-001: Create Single Browser Instance

**Objective:** Verify that a single browser instance can be created successfully.
**Steps:**

1. Launch a new browser instance using `playwright.chromium.launch()`
2. Verify browser instance is created
3. Close the browser

**Expected Result:** Browser launches successfully and closes without errors.

### TC-BC-002: Create Multiple Browser Contexts

**Objective:** Verify that multiple browser contexts can be created within a single browser.
**Steps:**

1. Launch a browser instance
2. Create first browser context using `browser.newContext()`
3. Create second browser context using `browser.newContext()`
4. Verify both contexts exist independently
5. Close contexts and browser

**Expected Result:** Both contexts are created successfully and operate independently.

### TC-BC-003: Navigate Different Pages in Different Contexts

**Objective:** Verify that different contexts can navigate to different pages simultaneously.
**Steps:**

1. Launch browser and create two contexts
2. Create page in context A, navigate to `/context-a.html`
3. Create page in context B, navigate to `/context-b.html`
4. Verify both pages loaded correctly
5. Verify contexts maintain separate navigation history

**Expected Result:** Each context navigates independently without affecting the other.

### TC-BC-004: Verify Context Storage Isolation

**Objective:** Verify that localStorage and sessionStorage are isolated between contexts.
**Steps:**

1. Create two browser contexts
2. In context A: Navigate to shared-state page, set localStorage value
3. In context B: Navigate to same page, check localStorage
4. Verify context B cannot access context A's localStorage

**Expected Result:** Storage is completely isolated between contexts.

### TC-BC-005: Verify Cookie Isolation Between Contexts

**Objective:** Verify that cookies are isolated between different browser contexts.
**Steps:**

1. Create two browser contexts
2. In context A: Set a cookie via browser or page interaction
3. In context B: Navigate to same domain, check for cookie
4. Verify context B doesn't have context A's cookie

**Expected Result:** Cookies are not shared between contexts.

### TC-BC-006: Context State Persistence During Navigation

**Objective:** Verify that context state persists when navigating between pages within the same context.
**Steps:**

1. Create browser context
2. Navigate to context-a page, fill form data
3. Navigate to isolation-test page within same context
4. Navigate back to context-a page
5. Verify form data is still present

**Expected Result:** State persists within the same context across navigation.

### TC-BC-007: Multiple Pages in Single Context

**Objective:** Verify that multiple pages can exist within a single context.
**Steps:**

1. Create browser context
2. Create first page, navigate to `/context-a.html`
3. Create second page in same context, navigate to `/context-b.html`
4. Verify both pages exist and share context state
5. Interact with localStorage on page 1, verify page 2 can access it

**Expected Result:** Multiple pages in same context share state and storage.

## Negative Test Cases

### TC-BC-N001: Access Closed Browser Context

**Objective:** Verify proper error handling when trying to use a closed context.
**Steps:**

1. Create browser context
2. Create page in context
3. Close the context
4. Attempt to create new page in closed context

**Expected Result:** Appropriate error is thrown when accessing closed context.

### TC-BC-N002: Access Closed Browser

**Objective:** Verify proper error handling when trying to create context on closed browser.
**Steps:**

1. Launch browser instance
2. Close browser
3. Attempt to create new context on closed browser

**Expected Result:** Appropriate error is thrown when accessing closed browser.

### TC-BC-N003: Cross-Context Data Access Attempt

**Objective:** Verify that contexts cannot directly access each other's data.
**Steps:**

1. Create two contexts
2. Set data in context A
3. Attempt to access context A's data from context B using JavaScript
4. Verify access is denied/undefined

**Expected Result:** Cross-context data access fails or returns undefined.

## Edge Test Cases

### TC-BC-E001: Maximum Number of Contexts

**Objective:** Test browser behavior with multiple contexts (stress test).
**Steps:**

1. Launch browser
2. Create 10+ browser contexts
3. Create pages in each context
4. Navigate to different pages in each context
5. Verify all contexts work independently

**Expected Result:** Browser handles multiple contexts without performance degradation.

### TC-BC-E002: Context Creation with Custom Options

**Objective:** Verify context creation with specific browser context options.
**Steps:**

1. Create context with custom viewport size
2. Create context with specific user agent
3. Create context with custom locale
4. Verify each context respects its configuration

**Expected Result:** Each context operates with its specified configuration.

### TC-BC-E003: Rapid Context Creation and Destruction

**Objective:** Test rapid creation and destruction of contexts.
**Steps:**

1. In a loop, create and immediately close browser contexts
2. Verify no memory leaks or errors occur
3. Check that resources are properly released

**Expected Result:** Contexts are created and destroyed cleanly without resource leaks.

### TC-BC-E004: Context State After Browser Navigation

**Objective:** Verify context state behavior during browser-level navigation.
**Steps:**

1. Create context with multiple pages
2. Perform browser back/forward actions
3. Verify context state remains consistent
4. Check that navigation history is maintained per context

**Expected Result:** Context maintains proper state during navigation operations.

## Browser-Specific Test Cases

### TC-BC-B001: Cross-Browser Context Behavior

**Objective:** Verify context behavior is consistent across different browsers.
**Steps:**

1. Repeat core context tests on Chromium, Firefox, and WebKit
2. Compare behavior across browsers
3. Verify isolation works the same way

**Expected Result:** Context behavior is consistent across all supported browsers.

### TC-BC-B002: Headless vs. Headed Context Behavior

**Objective:** Verify context behavior is identical in headless and headed modes.
**Steps:**

1. Run context isolation tests in headless mode
2. Run same tests in headed mode
3. Compare results

**Expected Result:** Context behavior is identical regardless of headless/headed mode.

## Integration Test Cases

### TC-BC-I001: Context Integration with Test Framework

**Objective:** Verify contexts work properly within test suite structure.
**Steps:**

1. Create test suite with beforeEach/afterEach hooks
2. Create fresh context in beforeEach
3. Run test using the context
4. Clean up context in afterEach
5. Verify no state leakage between tests

**Expected Result:** Contexts integrate cleanly with test lifecycle management.

### TC-BC-I002: Context with Authentication State

**Objective:** Verify context isolation with authentication scenarios.
**Steps:**

1. Create context A, log in user
2. Create context B, verify user is not logged in
3. Log in different user in context B
4. Verify both contexts maintain separate auth state

**Expected Result:** Authentication state is properly isolated between contexts.
