interface TrackingTimestamp {
    createdAt: Date;
    updatedAt: Date;
}

export interface Business extends TrackingTimestamp {
    id: string;
    businessName: string;
    businessCategory: string;
    email: string;
}

export interface Experience extends TrackingTimestamp {
    id: string;
    owner: string;
}
