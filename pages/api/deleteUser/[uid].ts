import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.SUPABASE_KEY_SERVICE ?? ''
);
const UUID_V4 =
  /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  (async () => {
    if (req.method === 'DELETE') {
      const { uid } = req.query;
      if (uid === undefined || Array.isArray(uid))
        throw new Error('uid should be a uuid');
      if (!UUID_V4.test(uid)) throw new Error('uid should be a uuid');

      const { error } = await client.auth.api.deleteUser(uid);
      if (error) {
        res.status(500).send(error);
        return;
      }
      res.status(204).end();
    } else {
      res.status(405).setHeader('Allow', 'DELETE').end();
    }
  })();
}
