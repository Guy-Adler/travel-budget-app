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
    email: string | null;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
    can_be_shared: boolean;
  };
  trips: {
    id: number;
    created_at: string;
    owner: UUID;
    updated_at: string;
    updated_by: UUID;
    trip_name: string;
    owner_first_name: string;
    owner_last_name: string;
    owner_avatar_url: string | null;
    updated_by_first_name: string;
    updated_by_last_name: string;
    updated_by_avatar_url: string | null;
    is_owner: boolean;
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
    created_at: string;
    updated_at: string;
    updated_by: UUID;
    expense_name: string;
    amount: number;
    currency: Currency;
    purchase_date: TextDate | null;
    category: string | null;
  };
};

export default Schema;
