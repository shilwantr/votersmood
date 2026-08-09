import { db } from './firebase';
import { collection, DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

export const generateSearchTokens = (name: string): string[] => {
  const tokens: string[] = [];
  const lowerName = name.toLowerCase();
  for (let i = 1; i <= lowerName.length; i++) {
    tokens.push(lowerName.substring(0, i));
  }
  const parts = lowerName.split(' ');
  if (parts.length > 1) {
    parts.forEach(part => {
      for (let i = 1; i <= part.length; i++) {
        tokens.push(part.substring(0, i));
      }
    });
  }
  return Array.from(new Set(tokens));
};

export const createConverter = <T>(): FirestoreDataConverter<T> => ({
  toFirestore: (data: T): DocumentData => data as DocumentData,
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): T => {
    const data = snapshot.data(options);
    return { ...data, id: snapshot.id } as T;
  }
});

export const getCollection = <T>(path: string) => {
  return collection(db, path).withConverter(createConverter<T>());
};
