# Pacific Northwest Hiking Web App – Product Backlog

**Client:** Evan Holt, The Great Outdoors
**Team:** Hassan, Hsu, A. Johnson, D. Johnson, Mercille, Mesfin
**Timeline:** 2–4 months | **Created:** April 27, 2026

---

## 👋 New to backlogs? Start here.

A **product backlog** is just a to-do list for building an app — organized by how important each task is.

Each task in this list tells you:
- **What to build** (the task title)
- **Why it matters** (who needs it and what they get)
- **How you know it's done** (the "done checklist")
- **How long it should take** (estimate in hours)
- **What to finish first** (dependencies — tasks that must come before this one)

### Priority levels (how urgent each task is)

| Label | Meaning | Do it when? |
|-------|---------|-------------|
| 🔴 P0 – Must Have | The app won't work without these | First — always |
| 🟠 P1 – Should Have | Makes the app much better | After P0 is done |
| 🟡 P2 – Nice to Have | Helpful extras | If you have time left |
| ⚪ P3 – Future | Good ideas, but not yet | Save for a later version |

### What is an MVP?
**MVP = Minimum Viable Product.** It's the simplest version of the app that still works and delivers value to users. Think of it as: *what's the least we can build and still have something worth showing?* P0 and P1 items make up the MVP for this project.

---

## 🔴 P0 – Must Have (Build these first!) — 28 hours total

These are the core building blocks. Nothing works without them.

---

### 1. Set Up the GitHub Repository *(1 hr | No dependencies)*

**What it is:** GitHub is a website where your team stores and shares code. A "repository" (or "repo") is like a shared folder for your whole project.

**Why we need it:** Without this, the team can't collaborate — everyone would be working on separate files with no way to combine their work.

**Done when:**
- [ ] Repository created on GitHub
- [ ] All team members added with access
- [ ] A README file exists (brief description of the project)
- [ ] A `.gitignore` file is set up (tells GitHub which files to ignore, like temp files)

---

### 2. Create the Project Folder Structure *(1 hr | Needs: #1)*

**What it is:** Setting up a set of organized folders inside the repository before writing any code.

**Why we need it:** This is the Organizer — it's much easier to find things and work together when everyone knows where files go.

**Suggested folders:**
```
/frontend
  /css       ← styling files
  /js        ← JavaScript files
  /assets    ← images, icons
/data        ← trail data files
/docs        ← project documentation
```

**Done when:**
- [ ] All folders created and named clearly
- [ ] Folder structure documented in the README

---

### 3. Create the Trail Dataset *(2 hr | Needs: #2)*

**What it is:** A file full of fake (but realistic) trail information that the app can use during development. It's written in **JSON** — a simple text format that JavaScript can easily read.

**Why we need it:** We need trail data to test the search and display features before we have a real database.

**Done when:**
- [ ] At least 20 Pacific Northwest trails included
- [ ] Each trail has: name, location, GPS coordinates, distance (miles), elevation gain (feet), difficulty (Easy/Moderate/Hard), estimated time, and trail type (loop or out-and-back)
- [ ] The file is valid JSON (no typos that break the format)

**Example of what one trail looks like in JSON:**
```json
{
  "id": 1,
  "name": "Rattlesnake Ledge",
  "location": "North Bend, WA",
  "distance": 4.0,
  "elevationGain": 1200,
  "difficulty": "Moderate",
  "estimatedTime": "2-3 hours",
  "trailType": "Out-and-back"
}
```

---

### 4. Build the Search Bar *(2 hr | Needs: #2)*

**What it is:** The text box at the top of the homepage where users type a trail name or location to search.

**Why we need it:** This is how users find trails — it's the main entry point into the whole app.

**Done when:**
- [ ] Search bar is visible on the homepage on both phones and desktop computers
- [ ] Has placeholder text like: *"Search by trail name or location..."*
- [ ] Has a clear button (to erase what's typed) or a search button
- [ ] Looks good and matches the app's style

---

### 5. Make the Search Bar Capture Typed Text *(1.5 hr | Needs: #4)*

**What it is:** The JavaScript code that "listens" to what the user types and saves it so the app can use it for searching.

**Why we need it:** The search bar looks like a text box, but without this code, nothing happens when you type — the app won't know what you're searching for.

**Done when:**
- [ ] Text is captured as the user types (no need to press Enter)
- [ ] Works on both keyboard and phone touchscreen
- [ ] Clears properly when the user deletes their text

---

### 6. Write the Search Logic *(2 hr | Needs: #3, #5)*

**What it is:** The JavaScript function that looks through the trail dataset and returns trails that match what the user typed.

**Why we need it:** This is the "brain" of the search — it takes the user's input and decides which trails to show.

**Done when:**
- [ ] Finds trails that match by name OR location
- [ ] Works even if the user types in ALL CAPS or all lowercase (*"rattlesnake"* matches *"Rattlesnake Ledge"*)
- [ ] If the search box is empty, shows all trails (or a prompt to search)
- [ ] If nothing matches, shows a friendly message like *"No trails found"*
- [ ] Fast — returns results in under half a second

---

### 7. Display the Search Results *(1.5 hr | Needs: #6)*

**What it is:** The list of trails that appears below the search bar after the user types something.

**Why we need it:** The search logic finds matching trails, but without this, the user has no way to see them.

**Done when:**
- [ ] Results appear as the user types (live updates)
- [ ] Each result shows the trail name and location
- [ ] If no results, shows a helpful message instead of a blank page
- [ ] Looks good on both phones and desktop

---

### 8. Build the Trail Details Page *(2 hr | Needs: #2)*

**What it is:** A separate page (or view) that shows all the information about one specific trail when a user clicks on it.

**Why we need it:** Search results only show basic info. Users need a dedicated page to get the full details before deciding to hike a trail.

**Done when:**
- [ ] Page has clear sections for: trail name, location, distance/elevation, and difficulty
- [ ] Has a "Back to results" button so users can return to their search
- [ ] Works well on phones and desktop
- [ ] Consistent styling with the rest of the app

---

### 9. Show Trail Name and Location on Details Page *(1 hr | Needs: #3, #8)*

**What it is:** Displaying the trail's name and location at the top of the details page.

**Why we need it:** Users need to immediately confirm they clicked on the right trail.

**Done when:**
- [ ] Trail name is displayed prominently at the top
- [ ] Location (city/region) is shown clearly just below
- [ ] GPS coordinates are included (useful for navigation apps)
- [ ] All visible without needing to scroll

---

### 10. Show Distance and Elevation on Details Page *(1 hr | Needs: #3, #8)*

**What it is:** Displaying how long the trail is and how much uphill climbing is involved.

**Why we need it:** These two numbers are the most important factors for a hiker deciding if a trail is right for them.

**Done when:**
- [ ] Distance shown in miles with a label (e.g., *"4.0 miles"*)
- [ ] Elevation gain shown in feet (e.g., *"1,200 ft gain"*)
- [ ] Estimated hiking time shown (e.g., *"2–3 hours"*)
- [ ] Easy to read at a glance on a phone screen

---

### 11. Build the Difficulty Filter Buttons *(1.5 hr | Needs: #7)*

**What it is:** A row of clickable buttons — Easy, Moderate, Hard — that let users filter search results by difficulty level.

**Why we need it:** A beginner and an experienced hiker have very different needs. Filtering by difficulty helps people quickly find trails suited to their skill level, which is a safety priority for the client.

**Done when:**
- [ ] Three buttons visible: Easy, Moderate, Hard
- [ ] Selected button is visually highlighted (so users know which filter is active)
- [ ] Users can select multiple difficulty levels at once
- [ ] A "Clear filters" option resets the selection
- [ ] Works on both phone and desktop

---

### 12. Write the Difficulty Filter Logic *(2 hr | Needs: #6, #11)*

**What it is:** The JavaScript code that actually filters the trail list based on which difficulty button(s) the user clicked.

**Why we need it:** The buttons are just visuals — this is the code that makes them actually do something.

**Done when:**
- [ ] Clicking a difficulty button hides trails that don't match
- [ ] Works *together* with the search bar (e.g., search "loop" AND filter by "Easy")
- [ ] Results update immediately when a button is clicked
- [ ] If no trails match, shows a helpful message

---

### 13. Make Search Results Clickable *(2 hr | Needs: #7, #8)*

**What it is:** Turning each result in the search list into a link that takes the user to that trail's details page.

**Why we need it:** Search results are useless if you can't click on them to learn more.

**Done when:**
- [ ] Every trail result is clickable
- [ ] Clicking loads the correct trail's details page
- [ ] Pressing "Back" returns to the search results (with the search still intact)
- [ ] Buttons/links are large enough to tap on a phone (at least 44×44 pixels)

---

### 14. Make the App Work on Mobile Phones *(2 hr | Needs: #4, #8, #11)*

**What it is:** Using CSS (the code that controls how things look) to make the app look good and work properly on small screens.

**Why we need it:** Many hikers will use this app on their phones on the trail. If it doesn't work on mobile, it's not useful in the field.

**Done when:**
- [ ] App looks good on screens as small as 320px wide (small phone)
- [ ] No sideways scrolling on mobile
- [ ] All text is readable without zooming in
- [ ] Buttons and links are large enough to tap comfortably

> 💡 **What are breakpoints?** These are screen-width thresholds where the layout adjusts:
> - Phone: under 576px wide
> - Tablet: 576px – 992px
> - Desktop: over 992px

---

### 15. Fix the Mobile Menu/Navigation *(1.5 hr | Needs: #14)*

**What it is:** Making sure the navigation menu (links to different sections of the app) is accessible and easy to use on a small phone screen.

**Why we need it:** Desktop navigation menus are often too wide for phones. This task ensures phone users can still get around the app easily.

**Done when:**
- [ ] Navigation is accessible on mobile (often a "hamburger menu" — the ☰ icon)
- [ ] All links are easy to tap
- [ ] Nothing overlaps or gets cut off on small screens

---

### 16. Build the "Featured Trails" Section *(2 hr | Needs: #3, #8)*

**What it is:** A section on the homepage that showcases a hand-picked selection of trails — specifically lesser-known hidden gems.

**Why we need it:** This is a key client goal. Not everyone knows what to search for — this section lets new visitors discover great trails without having to search.

**Done when:**
- [ ] Section appears on the homepage with 4–8 trail "cards"
- [ ] Each card shows: a photo, trail name, difficulty level, and distance
- [ ] Clicking a card goes to that trail's details page
- [ ] Looks good in a grid layout on both phone and desktop
- [ ] Trails are pulled from the data file (easy to update later)

---

### 17. Add Trail Data to the Featured Section *(1 hr | Needs: #3, #16)*

**What it is:** Choosing which trails from the mock dataset should appear as "Featured" and making sure they show up correctly.

**Why we need it:** The featured section needs actual trail data loaded into it or it will appear empty.

**Done when:**
- [ ] 6–8 lesser-known Pacific Northwest trails are selected and displayed
- [ ] Mix of Easy, Moderate, and Hard trails represented
- [ ] All data (name, distance, difficulty) displays correctly

---

### 18. Build the Homepage *(2 hr | Needs: #4, #16)*

**What it is:** The first page users see when they visit the app.

**Why we need it:** First impressions matter. The homepage needs to clearly communicate what the app does and make it easy to start searching.

**Done when:**
- [ ] Big headline at the top (e.g., *"Discover Pacific Northwest Trails"*)
- [ ] Search bar is prominently placed
- [ ] Featured trails section is visible below
- [ ] Short description of what the app does (1–2 sentences)
- [ ] Navigation links to other sections
- [ ] Looks good on mobile and desktop

---

### 19. Write the README Documentation *(1 hr | Needs: #2)*

**What it is:** A text file (called `README.md`) in the GitHub repository that explains what the project is and how to use it.

**Why we need it:** Anyone visiting the repository — team members, the client, future developers — should be able to quickly understand what this project is and how to get it running.

**Done when:**
- [ ] Explains what the app is and who it's for
- [ ] Lists all the key features
- [ ] Includes setup instructions (how to download and run it)
- [ ] Lists the technology used (HTML, CSS, JavaScript)
- [ ] Credits all team members
- [ ] Describes what features are planned for the future

---

## 🟠 P1 – Should Have — 8 hours total

Do these after all P0 tasks are done. They make the app significantly better.

---

### 20. Create a Style Guide *(2 hr | No dependencies)*

**What it is:** A reference document (and/or CSS file) that defines how the app should look: colors, fonts, button styles, spacing, etc.

**Why we need it:** Without this, each team member might style things differently and the app will look inconsistent. A style guide keeps everything cohesive.

**Done when:**
- [ ] Main colors chosen and documented (e.g., primary green, accent orange)
- [ ] Fonts chosen and documented
- [ ] Button styles defined (size, color, hover effect)
- [ ] Spacing rules documented
- [ ] Examples of each component provided

---

### 21. Add a Safety Tips Page *(2 hr | Needs: navigation structure)*

**What it is:** A page with practical safety advice for hikers — things like staying hydrated, checking the weather, and what to do if you encounter wildlife.

**Why we need it:** The client's mission includes promoting safe, responsible hiking. This page directly supports that goal.

**Done when:**
- [ ] Page accessible from the main navigation
- [ ] Covers: hydration, weather awareness, wildlife safety, and emergency preparation
- [ ] Written in plain, easy-to-understand language
- [ ] Works well on mobile

---

### 22. Deploy the App to a Hosting Platform *(2 hr | Needs: #1, #18)*

**What it is:** Publishing the app to the internet so anyone with a link can access it.

**Why we need it:** Right now the app only works on your own computer. Deploying it lets the client and real users test it.

> 💡 **Free hosting options for this project:** GitHub Pages, Netlify, or Vercel — all free and easy to set up.

**Done when:**
- [ ] Hosting platform chosen and connected to the GitHub repo
- [ ] App is live at a public URL
- [ ] HTTPS is enabled (the padlock icon — means the connection is secure)
- [ ] Page loads in under 3 seconds

---

### 23. Speed Up the Search *(2 hr | Needs: #6)*

**What it is:** Improving the search code so results appear almost instantly as the user types.

**Why we need it:** Slow search feels broken. Fast search feels polished. This task makes the experience feel smooth and responsive.

**Done when:**
- [ ] Results appear in under 200 milliseconds (that's 0.2 seconds — barely noticeable)
- [ ] No lag or stuttering while typing
- [ ] Works well even on older/slower phones

---

## 🟡 P2 – Nice to Have — 4 hours total

These improve quality and team process. Do them if time allows.

---

### 24. Write Test Cases for Search *(1.5 hr | Needs: #6)*

**What it is:** A written document listing specific scenarios to test the search feature and confirm it works correctly.

**Why we need it:** Without test cases, bugs slip through. This document gives your team a checklist to run through before calling the feature done.

**Example test cases:**
- Search for "rattlesnake" → should show Rattlesnake Ledge
- Search for "RATTLESNAKE" (all caps) → should still work
- Search for "" (nothing typed) → should show all trails or a prompt
- Search for "xyzabc" → should show "No trails found"

**Done when:**
- [ ] Test cases written and saved in the docs folder
- [ ] Each case has: what to type, what result to expect, pass/fail result

---

### 25. Create a Bug Report Template *(0.5 hr | Needs: #1)*

**What it is:** A pre-filled form in GitHub Issues that team members fill out when they find a problem.

**Why we need it:** Without a template, bug reports are often missing key information ("it's broken" isn't helpful). A template ensures every report has enough detail to fix the bug.

**Done when:**
- [ ] Template created in GitHub Issues
- [ ] Includes fields for: what went wrong, steps to reproduce it, what you expected vs. what actually happened, and screenshots

---

### 26. Create a Feature Request Template *(0.5 hr | Needs: #1)*

**What it is:** A pre-filled form in GitHub Issues for submitting ideas for new features.

**Why we need it:** Good ideas come from users. This makes it easy for anyone — client, user, or teammate — to suggest a new feature in a structured way.

**Done when:**
- [ ] Template created in GitHub Issues
- [ ] Includes fields for: feature description, who needs it and why, what "done" looks like

---

### 27. Trail Comparison Feature *(2 hr | Needs: #8)*

**What it is:** A feature that lets users select 2–3 trails and view them side-by-side to compare stats.

**Why we need it:** Makes it easier to decide between trails without opening each one separately.

**Done when:**
- [ ] User can select 2–3 trails to compare
- [ ] Comparison shows distance, elevation, difficulty, and estimated time side-by-side
- [ ] Works on mobile

---

## ⚪ P3 – Future Features (not in MVP)

These are good ideas that have been intentionally set aside for now. They either require more infrastructure than the MVP supports, or the client has marked them as lower priority.

| # | Feature | Why it's deferred |
|---|---------|------------------|
| 28 | **User Accounts & Login** | Needs a backend server and database — too complex for MVP |
| 29 | **Trail Reviews & Ratings** | Requires user accounts first (#28) |
| 30 | **Guided Hike Registration** | Needs a booking system and email service |
| 31 | **Donations & Membership** | Needs payment processing (Stripe/PayPal integration) |
| 32 | **Live Weather Integration** | Requires a paid weather API |
| 33 | **Interactive Trail Maps** | Requires a paid maps API (Google Maps or Mapbox) |
| 34 | **Filter by Trail Type** | Nice extra filter (loop/out-and-back); lower priority than core MVP |

---

## 📅 Build Order (Week by Week)

| Week | What to work on | Tasks |
|------|-----------------|-------|
| Week 1 | Get set up | GitHub repo (#1), folder structure (#2), trail data (#3), style guide (#20) |
| Weeks 2–3 | Build the core app | Homepage (#18), search bar (#4–#7), trail details page (#8–#10) |
| Weeks 3–4 | Add filtering and navigation | Difficulty filter (#11–#12), clickable results (#13), featured trails (#16–#17) |
| Week 4 | Make it work on phones | Responsive styling (#14), mobile navigation (#15) |
| Week 5 | Test and launch | Test cases (#24), bug/feature templates (#25–#26), deploy (#22), README (#19) |
| Future | Build v2 features | Everything in P3 |

---

## ✅ How This Backlog Meets the Client's Goals

| What the client asked for | Which tasks deliver it |
|---------------------------|------------------------|
| Users can search for trails | #4, #5, #6, #7 |
| Trail pages show full details | #8, #9, #10 |
| Users can filter by difficulty | #11, #12 |
| App works on mobile phones | #14, #15 |
| Homepage features lesser-known trails | #16, #17 |
| Safety tips are available | #21 |
| No expensive paid APIs in MVP | Weather and Maps pushed to P3 |

---

## 📝 Key Assumptions

- **Trail data:** We're using made-up (but realistic) trail data for now. The client will confirm where real data comes from later.
- **Tech stack:** This is a frontend-only app — just HTML, CSS, and JavaScript files. No server or database needed for MVP.
- **Hosting:** We'll use GitHub Pages, Netlify, or Vercel (all free). Client to confirm preference.
- **Timeline:** About 4–5 weeks for P0 items; 5–6 weeks if P1 is included.
- **No payments:** Donation features are out of scope for MVP.

---
