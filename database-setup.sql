-- TrueForm Database Setup
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Verticals (industries/sectors)
create table if not exists tf_verticals (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  description text,
  created_at timestamptz default now(),
  created_by uuid references auth.users(id)
);

-- Add description column to verticals if it doesn't exist
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'tf_verticals' and column_name = 'description') then
    alter table tf_verticals add column description text;
  end if;
end $$;

-- Add unique constraint to verticals name if it doesn't exist
do $$
begin
  if not exists (select 1 from information_schema.table_constraints where constraint_name = 'tf_verticals_name_key' and table_name = 'tf_verticals') then
    alter table tf_verticals add constraint tf_verticals_name_key unique (name);
  end if;
end $$;

-- Companies
create table if not exists tf_companies (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  website text,
  -- Billing address fields
  billing_street text,
  billing_city text,
  billing_state text,
  billing_zip text,
  billing_country text,
  notes text,
  status text not null default 'active',
  created_at timestamptz default now(),
  created_by uuid references auth.users(id)
);

-- Add vertical_id column to companies if it doesn't exist
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'tf_companies' and column_name = 'vertical_id') then
    alter table tf_companies add column vertical_id uuid references tf_verticals(id);
  end if;
end $$;

-- Add unique constraint to companies name if it doesn't exist
do $$
begin
  if not exists (select 1 from information_schema.table_constraints where constraint_name = 'tf_companies_name_key' and table_name = 'tf_companies') then
    alter table tf_companies add constraint tf_companies_name_key unique (name);
  end if;
end $$;

-- Contacts
create table if not exists tf_contacts (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references tf_companies(id),
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  title text,
  notes text,
  status text not null default 'active',
  vertical_id uuid references tf_verticals(id),
  created_at timestamptz default now(),
  created_by uuid references auth.users(id)
);

-- Company Projects
create table if not exists tf_company_projects (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references tf_companies(id),
  name text not null,
  status text not null default 'active',
  start_date date,
  end_date date,
  budget numeric,
  created_at timestamptz default now(),
  created_by uuid references auth.users(id)
);

-- Add new columns to projects if they don't exist
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'tf_company_projects' and column_name = 'description') then
    alter table tf_company_projects add column description text;
  end if;
end $$;

do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'tf_company_projects' and column_name = 'project_type') then
    alter table tf_company_projects add column project_type text;
  end if;
end $$;

-- Contact Interactions
create table if not exists tf_contact_interactions (
  id uuid primary key default uuid_generate_v4(),
  contact_id uuid references tf_contacts(id),
  type text not null,  -- 'call' | 'email' | 'meeting' | 'note' | 'demo' | 'proposal'
  summary text,
  created_at timestamptz default now(),
  created_by uuid references auth.users(id)
);

-- Proposals
create table if not exists tf_proposals (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references tf_companies(id),
  contact_id uuid references tf_contacts(id),
  title text not null,
  line_items jsonb not null default '[]',
  subtotal numeric default 0,
  tax numeric default 0,
  tax_rate numeric default 7.5,
  total numeric default 0,
  notes text,
  status text not null default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  created_by uuid references auth.users(id)
);

-- Indexes
create index if not exists idx_tf_companies_vertical on tf_companies(vertical_id);
create index if not exists idx_tf_contacts_company on tf_contacts(company_id);
create index if not exists idx_tf_contacts_vertical on tf_contacts(vertical_id);
create index if not exists idx_tf_projects_company on tf_company_projects(company_id);
create index if not exists idx_tf_interactions_contact on tf_contact_interactions(contact_id);
create index if not exists idx_tf_proposals_company on tf_proposals(company_id);
create index if not exists idx_tf_proposals_contact on tf_proposals(contact_id);

-- Row Level Security
alter table tf_verticals enable row level security;
alter table tf_companies enable row level security;
alter table tf_contacts enable row level security;
alter table tf_company_projects enable row level security;
alter table tf_contact_interactions enable row level security;
alter table tf_proposals enable row level security;

-- Drop existing policies if they exist
drop policy if exists allow_all on tf_verticals;
drop policy if exists allow_all on tf_companies;
drop policy if exists allow_all on tf_contacts;
drop policy if exists allow_all on tf_company_projects;
drop policy if exists allow_all on tf_contact_interactions;
drop policy if exists allow_all on tf_proposals;
drop policy if exists authenticated_users_all on tf_verticals;
drop policy if exists authenticated_users_all on tf_companies;
drop policy if exists authenticated_users_all on tf_contacts;
drop policy if exists authenticated_users_all on tf_company_projects;
drop policy if exists authenticated_users_all on tf_contact_interactions;
drop policy if exists authenticated_users_all on tf_proposals;

-- RLS Policies (authenticated users only)
create policy authenticated_users_all on tf_verticals for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy authenticated_users_all on tf_companies for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy authenticated_users_all on tf_contacts for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy authenticated_users_all on tf_company_projects for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy authenticated_users_all on tf_contact_interactions for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy authenticated_users_all on tf_proposals for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Insert TrueForm Platform Verticals
insert into tf_verticals (name, description) 
select * from (values 
  ('Golf & Recreation', 'Golf courses, equipment, instruction, travel, and recreational services'),
  ('Oil & Gas', 'Oilfield services, equipment, exploration, and energy sector companies'),
  ('Healthcare', 'Medical practices, hospitals, healthcare technology, and wellness services'),
  ('Real Estate', 'Property management, development, commercial and residential real estate'),
  ('Technology', 'Software companies, SaaS platforms, tech startups, and IT services'),
  ('Manufacturing', 'Industrial manufacturing, equipment, and production companies'),
  ('Professional Services', 'Legal, accounting, consulting, and business services'),
  ('Retail & E-commerce', 'Online stores, retail chains, and consumer goods companies'),
  ('Hospitality & Tourism', 'Hotels, restaurants, travel agencies, and entertainment venues'),
  ('Education', 'Schools, universities, training programs, and educational technology'),
  ('Non-Profit', 'Charitable organizations, foundations, and community services'),
  ('Financial Services', 'Banks, investment firms, insurance, and fintech companies')
) as v(name, description)
where not exists (select 1 from tf_verticals where tf_verticals.name = v.name);

-- Insert sample companies across different verticals
insert into tf_companies (name, website, status) 
select * from (values 
  ('Pine Valley Golf Club', 'https://pinevalley.com', 'active'),
  ('Permian Basin Drilling Co', 'https://permiandrilling.com', 'active'),
  ('TechFlow Solutions', 'https://techflow.io', 'active'),
  ('Summit Healthcare Group', 'https://summithealthcare.com', 'prospect'),
  ('Apex Manufacturing', 'https://apexmfg.com', 'active')
) as c(name, website, status)
where not exists (select 1 from tf_companies where tf_companies.name = c.name); 