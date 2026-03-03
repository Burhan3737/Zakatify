# Zakatify (Zakat Calculator)

A simple web app to help individuals estimate zakat based on their assets and short-term liabilities.

## What this app does

- Calculates your **net zakatable wealth** (assets minus liabilities)
- Applies the **2.5% zakat rate**
- Shows whether you are **Above**, **Close**, or **Below** nisab
- Lets you choose nisab basis: **Silver** or **Gold**
- Uses latest metal prices when available, with safe fallback values if unavailable
- Saves your entries in the cloud (requires Supabase setup) or locally in browser
- User accounts with email/password authentication

## What you can enter

### Assets
- Cash in bank
- Cash on hand
- Gold (by grams or total value)
- Silver (by grams or total value)
- Investments / crypto
- Money owed to you (receivables)

### Liabilities
- Short-term debts and bills due now

## How to run the app

### Requirements
- Node.js 18+ (recommended)
- npm

### Steps
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the app:
   ```bash
   npm run dev
   ```
3. Open the local URL shown in your terminal (usually `http://localhost:5173`).

## Database & Authentication Setup (Optional)

By default, the app works offline using browser localStorage. To enable cloud sync with user accounts:

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project and wait for it to provision

### 2. Get Credentials

1. Go to **Project Settings** → **API**
2. Copy the **Project URL**
3. Copy the **anon public** key (under "Project API keys")

### 3. Configure Environment Variables

1. Copy the example env file:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` and add your credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

### 4. Run Database Setup

In your Supabase dashboard, go to the **SQL Editor** and run the following SQL:

```sql
-- User preferences (theme, accordion state)
create table user_preferences (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null unique,
  theme text default 'sahara',
  accordion_state jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Calculator data (assets, liabilities, currency, nisab)
create table calculator_data (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null unique,
  data jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Payments records
create table payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  payment_data jsonb not null,
  created_at timestamptz default now()
);

-- Calculator results (zakat due, manual mode)
create table calculator_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null unique,
  zakat_due numeric,
  manual_mode boolean default false,
  manual_zakat_due numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table user_preferences enable row level security;
alter table calculator_data enable row level security;
alter table payments enable row level security;
alter table calculator_results enable row level security;

-- Policies: Users can only access their own data
create policy "Users can read own preferences" on user_preferences for select using (auth.uid() = user_id);
create policy "Users can insert own preferences" on user_preferences for insert with check (auth.uid() = user_id);
create policy "Users can update own preferences" on user_preferences for update using (auth.uid() = user_id);

create policy "Users can read own calculator" on calculator_data for select using (auth.uid() = user_id);
create policy "Users can insert own calculator" on calculator_data for insert with check (auth.uid() = user_id);
create policy "Users can update own calculator" on calculator_data for update using (auth.uid() = user_id);

create policy "Users can read own payments" on payments for select using (auth.uid() = user_id);
create policy "Users can insert own payments" on payments for insert with check (auth.uid() = user_id);
create policy "Users can delete own payments" on payments for delete using (auth.uid() = user_id);

create policy "Users can read own results" on calculator_results for select using (auth.uid() = user_id);
create policy "Users can insert own results" on calculator_results for insert with check (auth.uid() = user_id);
create policy "Users can update own results" on calculator_results for update using (auth.uid() = user_id);
```

### 5. Enable Email Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Email/Password**
3. Optionally enable **Confirm email** if you want email verification

### 6. Restart the App

```bash
npm run dev
```

Now users can create accounts and their data will sync to the cloud.

## How to use

1. **Step 1 - Assets:** Enter your zakatable assets.
2. **Step 2 - Liabilities:** Enter short-term debts/bills due.
3. **Step 3 - Results:** Review:
   - Total zakatable wealth
   - Total zakat due
   - Nisab status
   - Full breakdown by category

Use **Back/Next** buttons or the step indicator to navigate.

## Important notes

- You can select a common currency at the top, and the same currency is used across inputs, nisab, and results.
- This is an estimate tool and not a religious ruling.
- For personal or scholarly guidance, consult a qualified local scholar.

## Build for production

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```
