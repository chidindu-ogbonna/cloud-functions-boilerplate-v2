import {
  Timestamp,
  WhereFilterOp,
  FieldValue,
  FieldPath,
  OrderByDirection,
} from "firebase-admin/firestore";

export type DBListConfig = {
    filters?: Array<{
        field: string | FieldPath,
        operation: WhereFilterOp,
        value: string | number | Array<string> | boolean
    }>;
    orders?: Array<{ field: string | FieldPath, direction?: OrderByDirection }>;
    limit?: number;
    startAfter?: number | string | Timestamp;
}

export type DBResult = {
    id: string,
    createdAt: Timestamp | FieldValue | Date,
    updatedAt: Timestamp | FieldValue | Date,
    [key: string]: any,
}
