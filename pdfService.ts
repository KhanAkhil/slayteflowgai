import { collection, doc, onSnapshot, query, setDoc, deleteDoc, where, getDoc, getDocs } from 'firebase/firestore';
import { db, auth } from './firebase';
import { Invoice, ProformaInvoice, Quotation, Customer, Item, Company } from './types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const syncData = (
  userId: string,
  setInvoices: (data: Invoice[]) => void,
  setPIs: (data: ProformaInvoice[]) => void,
  setQuotations: (data: Quotation[]) => void,
  setCustomers: (data: Customer[]) => void,
  setItems: (data: Item[]) => void,
  setCompany: (data: Company | null) => void
) => {
  const unsubInvoices = onSnapshot(query(collection(db, 'invoices'), where('uid', '==', userId)), (snap) => {
    setInvoices(snap.docs.map(d => d.data() as Invoice));
  }, (error) => handleFirestoreError(error, OperationType.GET, 'invoices'));

  const unsubPIs = onSnapshot(query(collection(db, 'proforma_invoices'), where('uid', '==', userId)), (snap) => {
    setPIs(snap.docs.map(d => d.data() as ProformaInvoice));
  }, (error) => handleFirestoreError(error, OperationType.GET, 'proforma_invoices'));

  const unsubQuotations = onSnapshot(query(collection(db, 'quotations'), where('uid', '==', userId)), (snap) => {
    setQuotations(snap.docs.map(d => d.data() as Quotation));
  }, (error) => handleFirestoreError(error, OperationType.GET, 'quotations'));

  const unsubCustomers = onSnapshot(query(collection(db, 'customers'), where('uid', '==', userId)), (snap) => {
    setCustomers(snap.docs.map(d => d.data() as Customer));
  }, (error) => handleFirestoreError(error, OperationType.GET, 'customers'));

  const unsubItems = onSnapshot(query(collection(db, 'items'), where('uid', '==', userId)), (snap) => {
    setItems(snap.docs.map(d => d.data() as Item));
  }, (error) => handleFirestoreError(error, OperationType.GET, 'items'));

  const unsubCompany = onSnapshot(doc(db, 'company', userId), (snap) => {
    setCompany(snap.exists() ? snap.data() as Company : null);
  }, (error) => handleFirestoreError(error, OperationType.GET, `company/${userId}`));

  return () => {
    unsubInvoices();
    unsubPIs();
    unsubQuotations();
    unsubCustomers();
    unsubItems();
    unsubCompany();
  };
};

export const saveRecord = async (collectionName: string, id: string, data: any) => {
  try {
    await setDoc(doc(db, collectionName, id), { ...data, uid: auth.currentUser?.uid });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${collectionName}/${id}`);
  }
};

export const deleteRecord = async (collectionName: string, id: string) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${id}`);
  }
};
