export type AddressType = {
  address: string;
  postalCode: string;
  city: string;
  state: string;
};

export interface Data {
  id: string | number;
  avatar: () => React.ReactNode;
  firstName: string;
  lastName: string;
  birthDate: string;
  age: string;
  gender: string;
  phone: string;
  address: AddressType;
  email: string;
}

export type Order = "asc" | "desc";

export interface HeadCell {
  id: keyof Data;
  sortable: boolean;
  label: string;
}
