type Hex = string; // can't get it any better (too many options. too bad)
type Alphabet =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z';
type UUID4 = `${Hex}${Hex}${Hex}${Hex}`;
type UUID8 = `${UUID4}${UUID4}`;
type UUID12 = `${UUID4}${UUID8}`;
export type UUID = `${UUID8}-${UUID4}-${UUID4}-${UUID4}-${UUID12}`;
type TextDate = `${number}-${number}-${number}`;
type Currency = `${Alphabet}${Alphabet}${Alphabet}`;

export type Schema = {
  profiles: {
    id: UUID;
    email?: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
  trips: {
    id: number;
    created_at: Date;
    updated_at: Date;
    updated_by: UUID;
    owner: UUID;
    name: string;
  };
  shares: {
    id: number;
    trip_id: number;
    user_id: UUID;
    can_edit: boolean;
  };
  expenses: {
    id: number;
    trip_id: number;
    created_at: Date;
    updated_at: Date;
    updated_by: UUID;
    name: string;
    amount: number;
    currency: Currency;
    purchase_date?: TextDate;
    category?: string;
  };
};

export default Schema;
