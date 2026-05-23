import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  GeoPoint,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


export { query, where, orderBy, collection, addDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
export { doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ── Re-use your existing firebaseConfig ──────────────────────
export const firebaseConfig = {
  apiKey: "AIzaSyABZKs8MP6NwOjgnKB7qNdh11FOftnDxCk",
  authDomain: "great-outdoors-user-accounts.firebaseapp.com",
  projectId: "great-outdoors-user-accounts",
  storageBucket: "great-outdoors-user-accounts.firebasestorage.app",
  messagingSenderId: "703767712918",
  appId: "1:703767712918:web:e759ca183f0db213bc5eb7",
  measurementId: "G-496BHP4EK8",
};

const app = initializeApp(firebaseConfig);
export const db  = getFirestore(app);
export const auth = getAuth(app);

// ── Collection reference ─────────────────────────────────────
const TRAILS = collection(db, "trails");

// ============================================================
//  SCHEMA  (for reference — Firestore is schemaless but this
//           is what every trail document should look like)
// ============================================================
//
//  trails/{auto-id}
//  ├── name            string          REQUIRED
//  ├── length_mi       number (float)  REQUIRED  — miles
//  ├── elevation_gain  number (int)    REQUIRED  — feet
//  ├── trail_type      string          REQUIRED
//  │       one of: "loop" | "out_and_back" | "point_to_point" | "lollipop"
//  ├── location        GeoPoint        REQUIRED  — (lat, lng)
//  ├── start_elev_ft   number (int)    optional  — feet
//  ├── roughness       number (int)    optional  — 1–10
//  ├── opening_hours   object          optional
//  │       { open: "06:00", close: "20:00", notes: "Closed Dec–Mar" }
//  ├── est_time_hr     number (float)  optional  — hours (±50 %)
//  ├── description     string          optional  — max 2000 chars
//  ├── surfaces        string[]        optional  — multiselect
//  │       e.g. ["dirt", "rocks", "asphalt", "gravel", "snow"]
//  ├── associated_org  string          optional  — e.g. "Mt Rainier National Park"
//  ├── biomes          string[]        optional
//  │       e.g. ["forest", "mountain_rock", "river", "alpine_meadow"]
//  ├── images          string[]        optional  — URLs
//  ├── created_at      Timestamp       auto-set on create
//  └── updated_at      Timestamp       auto-set on update

// ============================================================
//  CONSTANTS  (use these in your UI dropdowns / checkboxes)
// ============================================================
export const TRAIL_TYPES = [
  "loop",
  "out_and_back",
  "point_to_point",
  "lollipop",
];

export const SURFACE_OPTIONS = [
  "dirt",
  "gravel",
  "rocks",
  "asphalt",
  "paved",
  "sand",
  "snow",
  "boardwalk",
  "roots",
];

export const BIOME_OPTIONS = [
  "forest",
  "river",
  "lake",
  "mountain_rock",
  "alpine_meadow",
  "desert",
  "coastal",
  "wetland",
  "canyon",
];

// ============================================================
//  VALIDATION
// ============================================================
function validateTrail(data) {
  const errors = [];

  if (!data.name || typeof data.name !== "string" || !data.name.trim())
    errors.push("name is required (string)");

  if (typeof data.length_mi !== "number" || isNaN(data.length_mi) || data.length_mi <= 0)
    errors.push("length_mi is required (positive number, miles)");

  if (!Number.isInteger(data.elevation_gain) || data.elevation_gain < 0)
    errors.push("elevation_gain is required (non-negative integer, feet)");

  if (!TRAIL_TYPES.includes(data.trail_type))
    errors.push(`trail_type must be one of: ${TRAIL_TYPES.join(", ")}`);

  if (
    !data.location ||
    typeof data.location.lat !== "number" ||
    typeof data.location.lng !== "number"
  )
    errors.push("location is required: { lat: float, lng: float }");

  // Optional field bounds
  if (data.roughness !== undefined) {
    if (!Number.isInteger(data.roughness) || data.roughness < 1 || data.roughness > 10)
      errors.push("roughness must be an integer 1–10");
  }

  if (data.description !== undefined && data.description.length > 2000)
    errors.push("description must be 2000 characters or fewer");

  if (data.est_time_hr !== undefined && (typeof data.est_time_hr !== "number" || data.est_time_hr <= 0))
    errors.push("est_time_hr must be a positive number (hours)");

  if (errors.length) throw new Error("Trail validation failed:\n• " + errors.join("\n• "));
}

// ============================================================
//  HELPERS
// ============================================================

/** Convert your { lat, lng } shorthand → Firestore GeoPoint */
function toGeoPoint({ lat, lng }) {
  return new GeoPoint(lat, lng);
}

/** Strip undefined values so Firestore doesn't complain */
function clean(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null)
  );
}

// ============================================================
//  CREATE  — addTrail(data) → docId (string)
// ============================================================
//
//  Minimal required call:
//    await addTrail({
//      name: "Skyline Trail",
//      length_mi: 5.4,
//      elevation_gain: 1200,
//      trail_type: "loop",
//      location: { lat: 46.9787, lng: -121.7269 },
//    });
//
//  Full example:
//    await addTrail({
//      name: "Skyline Trail",
//      length_mi: 5.4,
//      elevation_gain: 1200,
//      trail_type: "loop",
//      location: { lat: 46.9787, lng: -121.7269 },
//      start_elev_ft: 5400,
//      roughness: 6,
//      opening_hours: { open: "06:00", close: "20:00", notes: "Closed Nov–Apr" },
//      est_time_hr: 3.5,
//      description: "Stunning subalpine loop around Rainier with wildflower meadows.",
//      surfaces: ["dirt", "rocks"],
//      associated_org: "Mt Rainier National Park",
//      biomes: ["alpine_meadow", "mountain_rock"],
//      images: ["https://example.com/skyline1.jpg"],
//    });

export async function addTrail(data) {
  validateTrail(data);

  const doc_data = clean({
    name:            data.name.trim(),
    length_mi:       data.length_mi,
    elevation_gain:  data.elevation_gain,
    trail_type:      data.trail_type,
    location:        toGeoPoint(data.location),  // stored as GeoPoint
    start_elev_ft:   data.start_elev_ft,
    roughness:       data.roughness,
    opening_hours:   data.opening_hours,
    est_time_hr:     data.est_time_hr,
    description:     data.description?.trim(),
    surfaces:        data.surfaces        ?? [],
    associated_org:  data.associated_org?.trim(),
    biomes:          data.biomes          ?? [],
    images:          data.images          ?? [],
    created_at:      serverTimestamp(),
    updated_at:      serverTimestamp(),
  });

  const ref = await addDoc(TRAILS, doc_data);
  console.log("Trail created with ID:", ref.id);
  return ref.id;
}

// ============================================================
//  READ — getTrail(id) → trail object (or null)
// ============================================================
export async function getTrail(id) {
  const snap = await getDoc(doc(db, "trails", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

// ============================================================
//  READ ALL — getAllTrails() → trail[]
//  Optional filters: { trail_type, associated_org, sortBy }
//  sortBy options: "name" | "length_mi" | "elevation_gain"
// ============================================================
export async function getAllTrails({ trail_type, associated_org, sortBy = "name" } = {}) {
  let q = TRAILS;
  const constraints = [];

  if (trail_type)      constraints.push(where("trail_type",     "==", trail_type));
  if (associated_org)  constraints.push(where("associated_org", "==", associated_org));
  constraints.push(orderBy(sortBy));

  q = query(TRAILS, ...constraints);

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ============================================================
//  UPDATE — updateTrail(id, partialData)
//  Pass only the fields you want to change.
// ============================================================
export async function updateTrail(id, partialData) {
  // Re-run validation on what would be the merged result
  // (only validate required fields if they're being changed)
  const updates = clean({
    ...partialData,
    // Convert location if provided
    ...(partialData.location ? { location: toGeoPoint(partialData.location) } : {}),
    updated_at: serverTimestamp(),
  });

  await updateDoc(doc(db, "trails", id), updates);
  console.log("Trail updated:", id);
}

// ============================================================
//  DELETE — deleteTrail(id)
// ============================================================
export async function deleteTrail(id) {
  await deleteDoc(doc(db, "trails", id));
  console.log("Trail deleted:", id);
}


// AUTH
// SIGN UP
window.signUp = async function () {

  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;

  const usernameLower = username.toLowerCase();

  if (!username || !email || !password) {
    alert("Please fill out username, email, and password.");
    return;
  }

  if (username.length < 3) {
    alert("Username must be at least 3 characters long.");
    return;
  }

  try {
    // Check if username already exists
    const usernameQuery = query(
      collection(db, "users"),
      where("usernameLower", "==", usernameLower)
    );

    const usernameSnapshot = await getDocs(usernameQuery);

    if (!usernameSnapshot.empty) {
      alert("That username is already taken. Please choose another one.");
      return;
    }

    // Create Firebase Auth account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save public user profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      username: username,
      usernameLower: usernameLower,
      email: email,
      created_at: serverTimestamp()
    });

    alert("Account Created!");
    window.location.href = "dashboard.html";

  } catch (error) {
    alert(error.message);
  }
};

// GET CURRENT USERNAME
export async function getCurrentUsername() {
  const user = auth.currentUser;

  if (!user) {
    return null;
  }

  const userSnap = await getDoc(doc(db, "users", user.uid));

  if (userSnap.exists()) {
    return userSnap.data().username;
  }

  return null;
}

// GET USERNAME BY USER ID
export async function getUsernameByUid(uid) {
  const userSnap = await getDoc(doc(db, "users", uid));

  if (userSnap.exists()) {
    return userSnap.data().username;
  }

  return "Unknown User";
}

// LOGIN
window.login = function () {

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Logged In!");
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect");
      window.location.href = redirect ?? "dashboard.html";
    })
    .catch((error) => {
      alert(error.message);
    });
};



// LOGOUT
window.logout = function () {

  signOut(auth)
    .then(() => {
      alert("Logged Out");
      window.location.href = "login.html";
    });
};


// Protect Dashboard
onAuthStateChanged(auth, (user) => {

  if (
    window.location.pathname.includes("dashboard.html")
    && !user
  ) {
    window.location.href = "login.html";
  }
});




function showAlt(x) {
  document.getElementById("alttext").innerHTML=x.alt;
}

function hideAlt(x) {
  document.getElementById("alttext").innerHTML="";
}
