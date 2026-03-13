import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function testWrite() {
  console.log("Testing write to Firebase...");
  try {
    const docRef = await addDoc(collection(db, 'prayers'), {
      text: "Test prayer from script",
      author: "Script",
      email: "",
      phone: "",
      prayedCount: 0,
      timestamp: Date.now()
    });
    console.log("Success! Document written with ID:", docRef.id);
  } catch (e) {
    console.error("Error writing document:", e);
  }
  process.exit(0);
}
testWrite();
