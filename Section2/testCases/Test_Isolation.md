# Test Cases: Test Isolation

## Overview

Test cases for verifying proper test isolation, independence, and avoiding shared state issues in Playwright tests. These tests **prove** isolation is working by demonstrating state independence between test runs.

## Isolation Proof Test Cases

### TC-TI-P001: Prove Counter Isolation with State Verification

**Objective:** Prove that counter state doesn't leak between tests by checking actual values.
**Steps:**

1. **Test 1 (State Creator):**
   - Navigate to `/isolation-test.html`
   - Increment session counter to 7
   - Verify counter displays "7"
   - Store test completion timestamp in localStorage as `test1-completed`
2. **Test 2 (Isolation Verifier):**
   - Navigate to `/isolation-test.html`
   - Verify counter displays "0" (proves isolation)
   - Check localStorage for `test1-completed` - should be empty (proves storage isolation)
   - Increment counter to 3, verify it shows "3"
3. **Test 3 (Cross-Verification):**
   - Navigate to same page
   - Verify counter is "0" again (proves Test 2 didn't affect Test 3)

**Expected Result:** Each test sees counter at 0, proving no state carryover.

### TC-TI-P002: Prove Form Data Isolation with Content Verification

**Objective:** Prove form data doesn't persist by checking actual form field values.
**Steps:**

1. **Test 1 (Data Polluter):**
   - Navigate to `/isolation-test.html`
   - Fill name field with "John Doe"
   - Fill email field with "john@example.com"
   - Submit form and verify success message
   - Check that form fields still contain entered data
2. **Test 2 (Isolation Verifier):**
   - Navigate to `/isolation-test.html`
   - Assert name field value is empty: `expect(nameField).toHaveValue('')`
   - Assert email field value is empty: `expect(emailField).toHaveValue('')`
   - Assert no success message is displayed
   - Fill with different data: "Jane Smith", "jane@example.com"
   - Verify only new data appears
3. **Test 3 (Double Verification):**
   - Navigate to same page
   - Verify fields are empty (no data from Test 1 or Test 2)

**Expected Result:** Form fields are empty in Test 2 and Test 3, proving isolation.

### TC-TI-P003: Prove Todo List Isolation with Item Count Verification

**Objective:** Prove todo lists don't share data by counting actual items.
**Steps:**

1. **Test 1 (List Builder):**
   - Navigate to `/isolation-test.html`
   - Add todo items: "Buy milk", "Walk dog", "Code tests"
   - Verify todo count shows "3"
   - Verify all 3 items are visible in the list
   - Mark first item as completed
2. **Test 2 (Isolation Verifier):**
   - Navigate to `/isolation-test.html`
   - Assert todo count is "0": `expect(todoCount).toHaveText('0')`
   - Assert todo list is empty: `expect(todoList).toHaveCount(0)`
   - Add different items: "Study Playwright", "Write documentation"
   - Verify count shows "2" and only new items appear
3. **Test 3 (State Independence):**
   - Navigate to same page
   - Assert clean state: count "0", empty list
   - Proves Test 2's data didn't persist

**Expected Result:** Todo count is 0 and list is empty in each new test.

### TC-TI-P004: Prove Authentication Isolation with Login State Verification

**Objective:** Prove auth state doesn't persist by checking actual login status.
**Steps:**

1. **Test 1 (Login Creator):**
   - Navigate to `/shared-state.html`
   - Perform login with username "testuser"
   - Verify logged-in state: `expect(authStatus).toHaveText('Logged In')`
   - Verify username appears: `expect(loggedInUser).toHaveText('testuser')`
   - Verify login section is hidden, logged-in section is visible
2. **Test 2 (Isolation Verifier):**
   - Navigate to `/shared-state.html`
   - Assert logged-out state: `expect(authStatus).toHaveText('Not Logged In')`
   - Assert login form is visible, logged-in section is hidden
   - Assert session time shows "N/A"
   - Perform different login with "jane_user"
3. **Test 3 (Cross-Check):**
   - Navigate to same page
   - Verify logged-out state (proves Test 2's login didn't persist)

**Expected Result:** Each test starts logged out, proving auth isolation.

### TC-TI-P005: Prove LocalStorage Isolation with Direct Storage Inspection

**Objective:** Prove localStorage is isolated by directly inspecting storage contents.
**Steps:**

1. **Test 1 (Storage Polluter):**
   - Navigate to `/context-a.html`
   - Set form data and save: username "alice", theme "dark"
   - Verify localStorage contains: `expect(localStorage.getItem('username-A')).toBe('alice')`
   - Set additional data: `localStorage.setItem('test-key', 'test-value')`
   - Increment counter to 5, verify localStorage has counter data
2. **Test 2 (Storage Inspector):**
   - Navigate to `/context-a.html`
   - Assert localStorage is empty: `expect(localStorage.getItem('username-A')).toBeNull()`
   - Assert test data is gone: `expect(localStorage.getItem('test-key')).toBeNull()`
   - Assert counter localStorage is reset: `expect(localStorage.getItem('counter-a')).toBe('0')`
   - Verify form fields are empty
3. **Test 3 (Double-Check):**
   - Navigate to same page
   - Use JavaScript to inspect all localStorage keys: `Object.keys(localStorage)`
   - Assert localStorage is completely empty or only has default app data

**Expected Result:** localStorage is clean in each test, proving storage isolation.

## Browser Context Isolation Proof Cases

### TC-TI-P006: Prove Context Isolation with Parallel Context Verification

**Objective:** Prove different browser contexts are truly isolated by running parallel operations.
**Steps:**

1. Create two browser contexts simultaneously
2. **Context A Operations:**
   - Navigate to `/context-a.html`
   - Set username "ContextA_User", theme "blue"
   - Increment counter to 10
   - Set cookies via page: `context.addCookies([{name: 'context', value: 'A', domain: 'localhost'}])`
3. **Context B Operations (parallel):**
   - Navigate to `/context-b.html`
   - Set username "ContextB_User", theme "green"
   - Increment counter to 3
   - Check for Context A's cookie: `expect(cookies).not.toContainEqual(expect.objectContaining({name: 'context', value: 'A'}))`
4. **Cross-Context Verification:**
   - In Context A: Navigate to Context B's URL, verify no Context B data
   - In Context B: Navigate to Context A's URL, verify no Context A data
   - Verify each context maintains only its own state

**Expected Result:** Contexts maintain completely separate state and cannot access each other's data.

### TC-TI-P007: Prove Session Storage Isolation with Session Inspection

**Objective:** Prove sessionStorage is isolated by directly checking session data.
**Steps:**

1. **Test 1 (Session Creator):**
   - Navigate to `/isolation-test.html`
   - Use JavaScript to set sessionStorage: `sessionStorage.setItem('test-session', 'session-data')`
   - Verify data exists: `expect(sessionStorage.getItem('test-session')).toBe('session-data')`
   - Save form data that uses sessionStorage
2. **Test 2 (Session Verifier):**
   - Navigate to `/isolation-test.html`
   - Check sessionStorage is empty: `expect(sessionStorage.getItem('test-session')).toBeNull()`
   - Verify sessionStorage length is 0: `expect(sessionStorage.length).toBe(0)`
   - Set different session data to prove independence
3. **Test 3 (Session Isolation Check):**
   - Navigate to same page
   - Verify clean sessionStorage (no data from Test 1 or Test 2)

**Expected Result:** Each test has empty sessionStorage, proving session isolation.

## Failure Detection Proof Cases

### TC-TI-P008: Prove Isolation Failure Detection with Shared State Page

**Objective:** Prove we can detect when isolation fails by using the problematic shared-state page.
**Steps:**

1. **Test 1 (Create Persistent State):**
   - Navigate to `/shared-state.html` (problematic page)
   - Increment global counter to 15
   - Save persistent form data
   - Login user "persistent_user"
   - Verify all state is saved to localStorage
2. **Test 2 (Detect Isolation Failure):**
   - Navigate to `/shared-state.html`
   - **Expected Failure:** Assert global counter is 0 (it will be 15)
   - **Expected Failure:** Assert form is empty (it will have data)
   - **Expected Failure:** Assert user is logged out (they will be logged in)
   - Catch and verify these assertion failures prove isolation is broken
3. **Test 3 (Demonstrate Fix):**
   - Clear localStorage manually: `localStorage.clear()`
   - Navigate to `/shared-state.html`
   - Verify clean state now that storage is cleared

**Expected Result:** Test 2 fails as expected, demonstrating how shared state breaks isolation. Test 3 passes with manual cleanup.

### TC-TI-P009: Prove Isolation Works with Proper Context Management

**Objective:** Prove that using fresh browser contexts ensures proper isolation.
**Steps:**

1. **Test 1 (Create State in Context):**
   - Use fresh browser context
   - Navigate to `/shared-state.html`
   - Create extensive state (storage, cookies, auth)
   - Verify state exists within this context
   - Close context at end of test
2. **Test 2 (Verify Clean Context):**
   - Use fresh browser context (different from Test 1)
   - Navigate to `/shared-state.html`
   - Verify completely clean state (no localStorage, cookies, auth)
   - Assert `localStorage.length === 0`
   - Assert `document.cookie === ''` or only default cookies
3. **Test 3 (Parallel Context Isolation):**
   - Create context simultaneously with ongoing Test 2
   - Verify contexts don't interfere with each other
   - Modify state in Test 3 context, verify Test 2 context unaffected

**Expected Result:** Each fresh context provides complete isolation, proving proper context management works.

## Timing and Race Condition Proof Cases

### TC-TI-P010: Prove Isolation Under Rapid Test Execution

**Objective:** Prove isolation works even with rapid successive test execution.
**Steps:**

1. Create 5 tests that run in rapid succession (minimal delay)
2. **Each test performs:**
   - Navigate to `/isolation-test.html`
   - Check initial state is clean (counters=0, forms empty)
   - Create unique state (different data per test)
   - Verify only own state exists
   - Record completion timestamp
3. **Verification:**
   - Assert all tests completed successfully
   - Assert each test saw clean initial state
   - Assert no test saw data from previous tests
   - Verify timestamps show rapid execution

**Expected Result:** All tests pass with clean state despite rapid execution.

### TC-TI-P011: Prove Isolation with Intentional Test Pollution

**Objective:** Prove isolation by intentionally trying to pollute other tests.
**Steps:**

1. **Polluter Test:**
   - Set global JavaScript variables: `window.pollutedData = 'contaminated'`
   - Modify DOM: Add hidden elements with test data
   - Set extensive localStorage/sessionStorage
   - Create multiple timers/intervals
   - Deliberately don't clean up
2. **Victim Test 1:**
   - Check for pollution: `expect(window.pollutedData).toBeUndefined()`
   - Verify clean DOM (no hidden test elements)
   - Verify clean storage
   - Verify clean state throughout
3. **Victim Test 2:**
   - Repeat verification from Victim Test 1
   - Prove pollution didn't leak through Victim Test 1

**Expected Result:** Victim tests see no pollution, proving isolation prevents contamination.

## Concrete Verification Helpers

### TC-TI-P012: State Verification Helper Functions

**Objective:** Create reusable functions that prove clean state.
**Implementation:**

```javascript
async function verifyCleanState(page) {
  // Verify counters are zero
  await expect(page.locator('[data-testid="counter-value"]')).toHaveText("0");

  // Verify forms are empty
  await expect(page.locator('[data-testid="name-input"]')).toHaveValue("");
  await expect(page.locator('[data-testid="email-input"]')).toHaveValue("");

  // Verify storage is empty
  const localStorageLength = await page.evaluate(() => localStorage.length);
  expect(localStorageLength).toBe(0);

  const sessionStorageLength = await page.evaluate(() => sessionStorage.length);
  expect(sessionStorageLength).toBe(0);

  // Verify no authentication
  await expect(page.locator('[data-testid="auth-status"]')).toHaveText(
    "Not Logged In"
  );
}
```

**Expected Result:** Helper function provides reliable clean state verification.

## Summary

These updated test cases **prove** isolation is working by:

1. **Explicitly checking actual values** instead of just expecting clean state
2. **Using assertions** to verify specific expected vs actual states
3. **Creating contamination** in one test and verifying it doesn't appear in the next
4. **Directly inspecting storage** and DOM state
5. **Using the problematic shared-state page** to demonstrate what happens when isolation fails
6. **Implementing concrete verification helpers** that can reliably detect state leakage

The key difference is that these tests will **fail** if isolation is broken, thus proving when isolation is working correctly. 3. Verify all forms are empty 4. Verify no authentication state 5. Verify empty localStorage/sessionStorage

**Expected Result:** Application consistently starts with clean state.

### TC-TI-V002: Verify State Cleanup Completeness

**Objective:** Verify all state is properly cleaned between tests.
**Steps:**

1. Create comprehensive state (forms, storage, auth, etc.)
2. Apply cleanup procedures
3. Verify all state types are completely cleared
4. Check for any residual state

**Expected Result:** Cleanup procedures remove all traces of state.

### TC-TI-V003: Verify State Isolation Boundaries

**Objective:** Verify which state should and shouldn't persist.
**Steps:**

1. Identify what should persist (e.g., user preferences)
2. Identify what shouldn't persist (e.g., form data)
3. Verify boundaries are correctly maintained

**Expected Result:** State persistence follows expected boundaries.
