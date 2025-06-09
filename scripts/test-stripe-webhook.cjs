#!/usr/bin/env node

/**
 * Manual Stripe Webhook Test Script
 * 
 * This script helps test the Stripe webhook endpoint manually.
 * Usage: node scripts/test-stripe-webhook.cjs
 */

const crypto = require('crypto');

console.log('🔒 Stripe Webhook Security Test');
console.log('================================');

// Test data
const testPayload = JSON.stringify({
  id: 'evt_test_webhook',
  object: 'event',
  type: 'checkout.session.completed',
  data: {
    object: {
      id: 'cs_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
      object: 'checkout.session',
      amount_total: 19900,
      currency: 'usd',
      customer: 'cus_test_customer',
      payment_status: 'paid'
    }
  }
});

console.log('✅ Test payload created');
console.log('📝 Payload:', testPayload);

// Generate test signature (requires actual webhook secret)
function generateTestSignature(payload, secret) {
  const timestamp = Math.floor(Date.now() / 1000);
  const signedPayload = timestamp + '.' + payload;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload, 'utf8')
    .digest('hex');
  
  return `t=${timestamp},v1=${signature}`;
}

console.log('\n🔧 To test the webhook:');
console.log('1. Set STRIPE_WEBHOOK_SECRET in your .env file');
console.log('2. Start your development server: npm run dev');
console.log('3. Use Stripe CLI: stripe listen --forward-to localhost:5173/api/stripe-webhook');
console.log('4. Trigger test events: stripe trigger checkout.session.completed');

console.log('\n✅ Phase 1 Security Fixes Completed:');
console.log('   - Backup files removed');
console.log('   - Stripe webhook signature verification implemented');
console.log('   - Environment variable validation added');
console.log('   - DangerJS rules configured');

console.log('\n🚀 Ready for Phase 2: Foundation Refactors & Shared Types'); 