import {
  DocumentData,
  Timestamp,
  CollectionReference,
  FieldValue,
  Query,
} from "firebase-admin/firestore";
import { db } from "../firebase";
import { DBListConfig, DBResult } from "./types";


export default class Model {
  collectionPath: string;
  collection: CollectionReference<DocumentData>;

  constructor(collectionPath: string) {
    this.collectionPath = collectionPath;
    this.collection = db.collection(collectionPath);
  }

  async create(data: { id?: string;[key: string]: any }): Promise<DBResult> {
    const { id, ...rest } = data;


    const t = this.createTimestamp();
    const dataToCreate = {
      ...rest,
      createdAt: t,
      updatedAt: t,
    };

    const createPromise = id ?
      this.collection.doc(id).set(dataToCreate) :
      this.collection.add(dataToCreate);

    const result = await createPromise;
    const now = new Date;
    // eslint-disable-next-line
    // @ts-ignore: Not able to correctly type result.id
    return { ...dataToCreate, createdAt: now, updatedAt: now, id: id ? id : result?.id };
  }

  async get(id: string) {
    const result = await this.collection.doc(id).get();

    if (result.exists) {
      return { ...this.convertTimestampToDate(result.data()), id };
    }
    return null;
  }

  async update(data: { id: string;[key: string]: any }) {
    const { id, ...rest } = data;


    return this.collection.doc(id).update({
      ...rest,
      updatedAt: this.createTimestamp(),
    });
  }

  async delete(id: string) {
    return this.collection.doc(id).delete();
  }

  async list(config: DBListConfig) {
    const { filters, limit, orders, startAfter } = config;
    let query = this.collection as Query<DocumentData>;


    if (filters) {
      filters.forEach((constraint) => {
        query = query.where(constraint.field, constraint.operation, constraint.value);
      });
    }

    if (orders) {
      orders.forEach((order) => {
        query = query.orderBy(order.field, order.direction);
      });
    }

    if (startAfter) {
      query = query.startAfter(startAfter);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const results = await query.get();
    if (results.empty) return [];


    return results.docs.map((doc) => {
      return this.convertTimestampToDate({ ...doc.data(), id: doc.id });
    });
  }

  protected convertTimestampToDate(data: any) {
    const convertedTimestamps: any = {};

    Object.keys(data)
      .filter((prop) => data[prop] instanceof Object)
      .forEach((prop) => {
        if (data[prop] instanceof Timestamp) {
          convertedTimestamps[prop] = data[prop].toDate();
        } else {
        // iterate through the object if it contains a Timestamp
          this.convertTimestampToDate(data[prop]);
        }
      });

    return { ...data, ...convertedTimestamps };
  }

  protected createTimestamp() {
    return FieldValue.serverTimestamp();
  }
}
