import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function check() {
  console.log("Checking named database...");
  const snapshot = await getDocs(collection(db, 'prayers'));
  console.log("Firebase Prayers:", snapshot.docs.map(d => d.data()));
  process.exit(0);
}
check().catch(e => {
  console.error(e);
  process.exit(1);
});
