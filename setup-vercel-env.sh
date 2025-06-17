#!/bin/bash

# Setup Vercel Environment Variables
# Replace the placeholder values with your actual values before running

echo "Setting up Vercel environment variables..."

# Public variables (available to browser)
vercel env add PUBLIC_SUPABASE_URL production <<< "your_supabase_project_url_here"
vercel env add PUBLIC_SUPABASE_ANON_KEY production <<< "your_supabase_anon_key_here"
vercel env add PUBLIC_APP_URL production <<< "https://true-form-svelte-zf4g-git-main-mitchs-projects-e7862cf3.vercel.app"
vercel env add PUBLIC_SITE_URL production <<< "https://true-form-svelte-zf4g-git-main-mitchs-projects-e7862cf3.vercel.app"
vercel env add PUBLIC_STRIPE_PUBLISHABLE_KEY production <<< "your_stripe_publishable_key_here"

# Private variables (server-side only)
vercel env add SUPABASE_SERVICE_ROLE_KEY production <<< "your_supabase_service_role_key_here"
vercel env add STRIPE_SECRET_KEY production <<< "your_stripe_secret_key_here"

echo "Environment variables added! Now add them for preview and development:"

# Add for preview environment
vercel env add PUBLIC_SUPABASE_URL preview <<< "your_supabase_project_url_here"
vercel env add PUBLIC_SUPABASE_ANON_KEY preview <<< "your_supabase_anon_key_here"
vercel env add PUBLIC_APP_URL preview <<< "https://true-form-svelte-zf4g-git-main-mitchs-projects-e7862cf3.vercel.app"
vercel env add PUBLIC_SITE_URL preview <<< "https://true-form-svelte-zf4g-git-main-mitchs-projects-e7862cf3.vercel.app"
vercel env add PUBLIC_STRIPE_PUBLISHABLE_KEY preview <<< "your_stripe_publishable_key_here"
vercel env add SUPABASE_SERVICE_ROLE_KEY preview <<< "your_supabase_service_role_key_here"
vercel env add STRIPE_SECRET_KEY preview <<< "your_stripe_secret_key_here"

echo "Done! Redeploy your project with: vercel --prod"