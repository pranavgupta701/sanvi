# Private choices dashboard

The dashboard is at `/dashboard.html`. Collection is OFF while `dist/firebase-config.js` exports null. The main site and pen animation work independently.

## Connect Firebase

1. Create or select a dedicated project at https://console.firebase.google.com/ and register a Web app. Copy its public `firebaseConfig` object into `dist/firebase-config.js`.
2. Authentication → Sign-in method: enable Anonymous (visitor writes) and Email/Password (owner login).
3. Authentication → Users → Add user: create your owner email/password account. Put that user's UID in `ownerUid` in the config file and replace `REPLACE_WITH_OWNER_UID` in `firestore.rules`. Never put the password or a service-account key in this repository.
4. Create a Firestore database in production mode. Publish this repository's `firestore.rules` in the Rules tab before enabling collection. These grant read access only to the owner UID; anonymous visitors can only create validated events under their own UID. No one can update or delete events through the client.
5. Publish the collection-group descending index on `events.createdAt` from `firestore.indexes.json`. With Firebase CLI signed in, deploy to the selected project using `firebase deploy --only firestore --project YOUR_PROJECT_ID`. Alternatively add this single-field collection-group index in Firestore's indexes settings.
6. Authentication → Settings → Authorized domains: add `sanvi.neuralagent.dev`, `pranavgupta701.github.io`, the ngrok hostname if used, and `localhost` for local checks.
7. Deploy the updated static files to GitHub Pages. Visit `/dashboard.html` and sign in as the owner.

## What is saved

Explicit clicks: opening the surprise/letter/gate, date selection, each bubble, and the final Yes. Each event has its type, choice and server timestamp, stored beneath a Firebase anonymous browser UID. Defaults and replay resets are not selections. A small note tells the visitor that taps and choices are shared. A status shows pending/saved/failed writes with a retry button. Pending writes are not guaranteed if the tab is closed before they finish.

The dashboard lists the newest 200 events and lets you filter by browser. Browser IDs are not verified identities: tests, other link recipients and Sanvi can all create events. Test in a separate browser and note its ID. No IP address, location, message text or contact details are collected by application code. Firebase infrastructure still processes normal network requests.

## Verify before enabling

Use Firebase Rules Playground (or the emulator): unauthenticated reads/writes denied; anonymous visitors cannot read events, write under another UID, change existing events or submit unrecognised fields/values; non-owner email accounts cannot read; only the configured owner can query the events group. Test a visitor selection and owner dashboard end to end. Set Firebase usage alerts and consider App Check before sharing widely. The public website's Firebase config is not an admin credential; security depends on the deployed rules.

References: https://firebase.google.com/docs/firestore/security/get-started and https://firebase.google.com/docs/auth/web/anonymous-auth
