import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function clean() {
  const snapshot = await getDocs(collection(db, 'prayers'));
  for (const doc of snapshot.docs) {
    if (doc.data().author === "Script") {
      await deleteDoc(doc.ref);
      console.log("Deleted test doc:", doc.id);
    }
  }
  process.exit(0);
}
clean().catch(console.error);
