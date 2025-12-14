# Firebase Setup & Admin Access

## Deploy Firestore Security Rules

The `firestore.rules` file contains security rules that allow super admins to manage all data.

**Deploy the rules:**

```bash
# Install Firebase CLI if you haven't
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in this project (if not done)
firebase init firestore

# Deploy only the Firestore rules
firebase deploy --only firestore:rules
```

## Set Super Admin Role

To make a user a super admin:

### Option 1: Via Firebase Console (Quick)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **nepal-jyotish**
3. Go to **Firestore Database**
4. Navigate to the `users` collection
5. Find your user document (search by email)
6. Edit the document:
   - Set field `role` = `"super_admin"`
7. Save changes
8. Sign out and sign back in to your app

### Option 2: Via Script (Recommended for Production)

Create a file `scripts/setSuperAdmin.js`:

```js
const admin = require('firebase-admin');

// Initialize with service account
const serviceAccount = require('../path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const email = process.argv[2]; // Email of user to promote

if (!email) {
  console.error('Usage: node scripts/setSuperAdmin.js <user-email>');
  process.exit(1);
}

(async () => {
  try {
    // Get user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    
    // Update Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).update({
      role: 'super_admin'
    });
    
    console.log(`✅ User ${email} is now a super_admin`);
    console.log(`UID: ${userRecord.uid}`);
  } catch (error) {
    console.error('Error:', error);
  }
})();
```

Run:
```bash
npm install firebase-admin
node scripts/setSuperAdmin.js your-email@example.com
```

## Verify Super Admin Access

After deploying rules and setting super_admin role:

1. Sign out from your app
2. Sign back in
3. Navigate to `/admin`
4. You should see all users, astrologers, and appointments

## Troubleshooting

**Still getting "Missing or insufficient permissions"?**

1. Verify rules are deployed:
   ```bash
   firebase deploy --only firestore:rules
   ```

2. Check your user document in Firestore has `role: "super_admin"`

3. Clear browser cache and sign out/in again

4. Check browser console for the actual error and rule that's failing

**Test your role in browser console:**
```js
const idToken = await firebase.auth().currentUser.getIdTokenResult();
console.log('Role:', idToken.claims.role); // May be undefined if not using custom claims

// Or check Firestore directly
const userDoc = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get();
console.log('Firestore role:', userDoc.data().role);
```
