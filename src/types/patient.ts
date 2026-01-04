/**
 * Patient - Frontend domain model
 * Aligned with backend Patient.java model
 */
export interface Patient {
    id?: number;
    hn?: string;              // Hospital Number
    pname?: string;           // Prefix name (นาย, นาง, etc.)
    fname?: string;           // First name
    lname?: string;           // Last name
    nname?: string;           // Nickname
    sex?: string;             // Gender
    personalid?: string;      // National ID
    birthday?: string;        // Date of birth
    occupation?: string;      // Occupation
    nationality?: string;     // Nationality
    address1?: string;        // Primary address
    address2?: string;        // Secondary address
    tel1?: string;            // Primary phone
    tel2?: string;            // Secondary phone
    tel3?: string;            // Tertiary phone
    email?: string;           // Email
    province?: string;        // Province
    zip?: string;             // Zip code
    // Additional fields from backend model
    mode?: string;
    dat?: string;             // Date
    level?: string;
    stayin?: string;
    image?: string;
    vn?: string;
    cn?: string;
    facebook?: string;
    line?: string;
    status?: string;
    clinicname?: string;
}

/**
 * Request payload for creating a patient
 */
export interface CreatePatientRequest {
    hn?: string;
    fname: string;
    lname: string;
    nname?: string;
    pname?: string;
    sex?: string;
    personalid?: string;
    birthday?: string;
    tel1?: string;
    tel2?: string;
    email?: string;
    address1?: string;
    province?: string;
}

/**
 * Request payload for updating a patient
 */
export interface UpdatePatientRequest extends Partial<CreatePatientRequest> {
    id: number;
}
