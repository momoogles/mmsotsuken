import { DocumentReference, getDoc, setDoc } from "firebase/firestore";

export async function getDocData<T>({
  docRef,
}: {
  docRef: DocumentReference<T>;
}) {
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return data;
  } else {
    return null;
  }
}

export async function setDocData<T>({
  docRef,
  newDocument,
}: {
  docRef: DocumentReference<T>;
  newDocument: T;
}) {
  await setDoc(docRef, newDocument);
}
