export interface LinkedInProfileData {
    summary: string;
    industryName: string;
    lastName: LastName;
    locationName: string;
    student: boolean;
    geoCountryName: string;
    geoCountryUrn: string;
    geoLocationBackfilled: boolean;
    elt: boolean;
    birthDate: BirthDate;
    industryUrn: string;
    firstName: FirstName;
    entityUrn: string;
    geoLocation: GeoLocation;
    geoLocationName: string;
    location: Location;
    headline: string;
    displayPictureUrl: string;
    img_100_100: string;
    img_200_200: string;
    img_400_400: string;
    img_800_800: string;
    profile_id: string;
    profile_urn: ProfileUrnEnum;
    member_urn: MemberUrnEnum;
    public_id: PublicID;
    experience: Experience[];
    education: Education[];
    languages: Language[];
    publications: Publication[];
    certifications: Certification[];
    volunteer: Volunteer[];
    honors: Honor[];
    projects: Project[];
    skills: Skill[];
    urn_id: string;
}

export interface BirthDate {
    month: number;
    day: number;
}

export interface Certification {
    authority: string;
    name: string;
    timePeriod: CertificationTimePeriod;
    licenseNumber?: string;
    company: MiniCompanyClass;
    companyUrn: string;
    displaySource?: string;
    url?: string;
}

export interface MiniCompanyClass {
    objectUrn: string;
    entityUrn: string;
    name: string;
    showcase: boolean;
    active: boolean;
    logo: Logo;
    universalName: string;
    dashCompanyUrn: string;
    trackingId: string;
}

export interface Logo {
    "com.linkedin.common.VectorImage": COMLinkedinCommonVectorImage;
}

export interface COMLinkedinCommonVectorImage {
    artifacts: Artifact[];
    rootUrl: string;
}

export interface Artifact {
    width: number;
    fileIdentifyingUrlPathSegment: string;
    expiresAt: number;
    height: number;
}

export interface CertificationTimePeriod {
    startDate: StartDateClass;
}

export interface StartDateClass {
    month?: number;
    year: number;
}

export interface Education {
    entityUrn: string;
    school: School;
    grade: string;
    timePeriod: EducationTimePeriod;
    description: string;
    degreeName: string;
    schoolName: string;
    fieldOfStudy: string;
    schoolUrn: string;
    activities?: string;
}

export interface School {
    objectUrn: string;
    entityUrn: string;
    active: boolean;
    schoolName: string;
    trackingId: string;
    logoUrl: string;
}

export interface EducationTimePeriod {
    endDate?: StartDateClass;
    startDate: StartDateClass;
}

export interface Experience {
    locationName: string;
    entityUrn: string;
    geoLocationName: string;
    geoUrn?: string;
    companyName: string;
    timePeriod: EducationTimePeriod;
    company?: ExperienceCompany;
    title: string;
    region?: string;
    companyUrn?: string;
    companyLogoUrl?: string;
    description?: string;
    courses?: string[];
}

export interface ExperienceCompany {
    employeeCountRange: EmployeeCountRange;
    industries: string[];
}

export interface EmployeeCountRange {
    start: number;
    end: number;
}

export enum FirstName {
    DRGurinderjeet = "Dr. Gurinderjeet",
    PrashantSingh = "Prashant Singh",
}

export interface GeoLocation {
    geoUrn: string;
}

export interface Honor {
    title: string;
}

export interface Language {
    name: string;
    proficiency: string;
}

export enum LastName {
    KaurPhDCSE = "Kaur, Ph.D.(CSE)",
    Rana = "Rana",
}

export interface Location {
    basicLocation: BasicLocation;
}

export interface BasicLocation {
    countryCode: string;
}

export enum MemberUrnEnum {
    UrnLiMember343435022 = "urn:li:member:343435022",
    UrnLiMember46976676 = "urn:li:member:46976676",
}

export enum ProfileUrnEnum {
    UrnLiFSMiniProfileACoAAALMzqQBeD5HAoeYjK6CSaHP6F9E7M69Mc8 = "urn:li:fs_miniProfile:ACoAAALMzqQBeD5HAoeYjK6cSaHP6F9E7M69mc8",
    UrnLiFSMiniProfileACoAABR4Zw4BVICN6OOB5PIWkjCRGSVsOLZxaw = "urn:li:fs_miniProfile:ACoAABR4Zw4B-VICN6oOB5PIWkjCrGSVsOLZxaw",
}

export interface Project {
    members: MemberElement[];
    timePeriod: EducationTimePeriod;
    description: string;
    title: string;
}

export interface MemberElement {
    member: MemberMember;
    entityUrn: string;
    profileUrn: ProfileUrnEnum;
}

export interface MemberMember {
    firstName: FirstName;
    lastName: LastName;
    dashEntityUrn: DashEntityUrn;
    occupation: string;
    objectUrn: MemberUrnEnum;
    entityUrn: ProfileUrnEnum;
    publicIdentifier: PublicID;
    picture: Logo;
    trackingId: TrackingID;
}

export enum DashEntityUrn {
    UrnLiFsdProfileACoAAALMzqQBeD5HAoeYjK6CSaHP6F9E7M69Mc8 = "urn:li:fsd_profile:ACoAAALMzqQBeD5HAoeYjK6cSaHP6F9E7M69mc8",
    UrnLiFsdProfileACoAABR4Zw4BVICN6OOB5PIWkjCRGSVsOLZxaw = "urn:li:fsd_profile:ACoAABR4Zw4B-VICN6oOB5PIWkjCrGSVsOLZxaw",
}

export enum PublicID {
    Gknatt = "gknatt",
    Psrana = "psrana",
}

export enum TrackingID {
    Dyqi3J9T2SYmMyxX9TWow = "Dyqi3/J9T2SYmMyxX9tWow==",
    VVciNPRzQpOOOpnLzAknqw = "vVciNPRzQpOOOpnLzAknqw==",
}

export interface Publication {
    date: DateClass;
    name: string;
    publisher: string;
    description: string;
    url: string;
    authors: Author[];
}

export interface Author {
    member?: MemberMember;
    profileUrn?: ProfileUrnEnum;
    name?: string;
}

export interface DateClass {
    month: number;
    year: number;
    day: number;
}

export interface Skill {
    name: string;
}

export interface Volunteer {
    role: string;
    companyName: string;
    timePeriod: EducationTimePeriod;
    cause: string;
    company: VolunteerCompany;
    companyUrn: string;
}

export interface VolunteerCompany {
    miniCompany: MiniCompanyClass;
}
