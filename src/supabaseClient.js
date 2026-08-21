import { createClient } from '@supabase/supabase-js';

// رابط مشروعك الثابت في سوبابيز
const supabaseUrl = 'https://' + 'jtmmtmwdmcxjfshjddaq' + '.supabase.co';

// المفتاح الطويل الذي نسخته من موقع سوبابيز
const supabaseAnonKey = 'sb_publishable_wnS38tUCR8vS2bUGixFdpA_1hC62xEz'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
