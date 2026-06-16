# Great Outdoors – QA Checklist & Test Cases

## QA Review Information

| Field | Value |
|---------|---------|
| Tester | |
| Date | |
| Version | |

---

# QA Checklist

- [ ] Basic Search Tested
- [ ] Empty Search Tested
- [ ] No-Match Search Tested
- [ ] Case-Insensitive Search Tested
- [ ] Difficulty Filter (Single Select) Tested
- [ ] Difficulty Filter (Multi Select) Tested
- [ ] Search + Filter Combination Tested
- [ ] Mobile Navigation Tested
- [ ] Trail Details Page Tested
- [ ] Featured Trails Section Tested
- [ ] Safety Tips Page Tested
- [ ] Team Review Completed

---

# Test Cases

## TC-01: Basic Search

**Objective:** Verify users can search for an existing trail.

### Steps
1. Open the Trails page.
2. Enter a valid trail name in the search box.
3. Click **Search** or press **Enter**.

### Expected Result
- Matching trail(s) appear in the results list.
- Trail information displays correctly.

### Result
- [ ] Pass
- [ ] Fail

### Notes
____________________________________________

---

## TC-02: Empty Search

**Objective:** Verify behavior when no search term is entered.

### Steps
1. Open the Trails page.
2. Leave the search field blank.
3. Click **Search**.

### Expected Result
- All trails remain visible or a message prompts the user to enter a search term.
- No errors occur.

### Result
- [ ] Pass
- [ ] Fail

### Notes
____________________________________________

---

## TC-03: No-Match Search

**Objective:** Verify searches with no matching trails are handled correctly.

### Steps
1. Open the Trails page.
2. Enter a search term that does not exist.
3. Click **Search**.

### Expected Result
- No matching trails are displayed.
- A "No trails found" message appears.

### Result
- [ ] Pass
- [ ] Fail

### Notes
____________________________________________

---

## TC-04: Case-Insensitive Search

**Objective:** Verify search ignores capitalization.

### Steps
1. Search for a trail using lowercase letters.
2. Search for the same trail using uppercase letters.
3. Compare the results.

### Expected Result
- Both searches return identical results.

### Result
- [ ] Pass
- [ ] Fail

### Notes
____________________________________________

---

## TC-05: Difficulty Filter (Single Select)

**Objective:** Verify filtering by one difficulty level.

### Steps
1. Open the Trails page.
2. Select a single difficulty level.
3. Review the displayed results.

### Expected Result
- Only trails matching the selected difficulty are shown.

### Result
- [ ] Pass
- [ ] Fail

### Notes
____________________________________________

---

## TC-06: Difficulty Filter (Multi Select)

**Objective:** Verify filtering by multiple difficulty levels.

### Steps
1. Open the Trails page.
2. Select two or more difficulty levels.
3. Review the displayed results.

### Expected Result
- Results include trails matching any selected difficulty.
- No unrelated trails appear.

### Result
- [ ] Pass
- [ ] Fail

### Notes
____________________________________________

---

## TC-07: Search Combined with Difficulty Filter

**Objective:** Verify search and filtering work together.

### Steps
1. Enter a search term.
2. Select a difficulty level.
3. Review the results.

### Expected Result
- Results match both the search term and difficulty filter.

### Result
- [ ] Pass
- [ ] Fail

### Notes
____________________________________________

---

## TC-08: Mobile Navigation

**Objective:** Verify navigation functions properly on mobile devices.

### Steps
1. Open the website in mobile view.
2. Open the navigation menu.
3. Visit each page using the menu.

### Expected Result
- Navigation menu opens and closes correctly.
- Links navigate to the correct pages.
- No layout issues occur.

### Result
- [ ] Pass
- [ ] Fail

### Notes
____________________________________________

---

## TC-09: Trail Details Page

**Objective:** Verify trail details display correctly.

### Steps
1. Open a trail details page.
2. Review all displayed information.

### Expected Result
- Trail name displays correctly.
- Trail description displays correctly.
- Difficulty, distance, and other information appear correctly.

### Result
- [ ] Pass
- [ ] Fail

### Notes
____________________________________________

---

## TC-10: Featured Trails Section

**Objective:** Verify featured trails are displayed correctly.

### Steps
1. Open the homepage.
2. Locate the Featured Trails section.
3. Review the displayed trails.

### Expected Result
- Featured trails are visible.
- Trail information is accurate.
- Links navigate correctly.

### Result
- [ ] Pass
- [ ] Fail

### Notes
____________________________________________

---

## TC-11: Safety Tips Page

**Objective:** Verify the Safety Tips page displays correctly.

### Steps
1. Open the Safety Tips page.
2. Review all content and links.

### Expected Result
- Safety information is displayed correctly.
- Images and text load properly.
- No broken links are present.

### Result
- [ ] Pass
- [ ] Fail

### Notes
____________________________________________

---

# Team Review

## Reviewers

- ____________________
- ____________________
- ____________________

## Issues Found

- 
- 
- 

## Final Approval

- [ ] Approved
- [ ] Needs Fixes

**Reviewed By:** ____________________

**Date:** ____________________