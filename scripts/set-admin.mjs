#!/usr/bin/env node

/**
 * Psylume Admin Promotion Helper CLI
 * Usage: node scripts/set-admin.mjs <email>
 * Example: node scripts/set-admin.mjs professor@university.edu
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const envPath = path.resolve(process.cwd(), '.env.local')

// Helper to parse .env.local
function parseEnv() {
  const env = {}
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const idx = trimmed.indexOf('=')
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim()
        const val = trimmed.slice(idx + 1).trim()
        env[key] = val
      }
    }
  }
  return env
}

// Helper to update .env.local with ADMIN_EMAIL
function updateEnvAdminEmail(email) {
  let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : ''
  if (content.includes('ADMIN_EMAIL=')) {
    content = content.replace(/ADMIN_EMAIL=.*(\r?\n|$)/g, `ADMIN_EMAIL=${email}\n`)
  } else {
    content += `\nADMIN_EMAIL=${email}\n`
  }
  fs.writeFileSync(envPath, content, 'utf8')
}

async function main() {
  const env = parseEnv()
  const rawArg = process.argv[2]
  const targetEmail = (rawArg || env.ADMIN_EMAIL || '').trim().toLowerCase()

  if (!targetEmail) {
    console.error('❌ Error: Please specify an email address.')
    console.log('Usage: node scripts/set-admin.mjs <email>')
    console.log('Example: node scripts/set-admin.mjs instructor@psylume.edu')
    process.exit(1)
  }

  // Basic email syntax validation
  if (!targetEmail.includes('@') || !targetEmail.includes('.')) {
    console.error(`❌ Error: "${targetEmail}" is not a valid email address.`)
    process.exit(1)
  }

  console.log(`\n🎓 Psylume Platform: Setting Administrator Role for [${targetEmail}]...`)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY
  const databaseUrl = process.env.DATABASE_URL || env.DATABASE_URL

  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  try {
    // 1. Add to admin_whitelist table so future registrations are auto-promoted by trigger
    const { error: wlErr } = await supabase
      .from('admin_whitelist')
      .upsert({ email: targetEmail }, { onConflict: 'email' })

    if (wlErr) {
      console.warn('⚠️ Notice on admin_whitelist:', wlErr.message)
    } else {
      console.log('✅ Added to permanent database admin whitelist.')
    }

    // 2. Set app.admin_email in database configuration if databaseUrl is available
    if (databaseUrl) {
      try {
        execSync(
          `psql "${databaseUrl}" -c "ALTER DATABASE postgres SET \\"app.admin_email\\" = '${targetEmail}';"`,
          { timeout: 4000, stdio: 'ignore' },
        )
        console.log('✅ Updated PostgreSQL app.admin_email parameter.')
      } catch {
        // Continue gracefully if psql binary times out or is not configured
      }
    }

    // 3. Update existing user in auth.users & public.profiles if already registered
    const { data: usersData, error: userListErr } = await supabase.auth.admin.listUsers({
      perPage: 1000,
    })

    if (!userListErr && usersData?.users) {
      const match = usersData.users.find(
        (u) => (u.email || '').toLowerCase() === targetEmail,
      )

      if (match) {
        // Update user metadata in auth.users
        await supabase.auth.admin.updateUserById(match.id, {
          user_metadata: {
            ...match.user_metadata,
            role: 'instructor',
          },
        })

        // Update public.profiles
        const { error: profErr } = await supabase
          .from('profiles')
          .update({ role: 'instructor', email: targetEmail })
          .eq('id', match.id)

        if (profErr) {
          console.warn('⚠️ Notice updating profile:', profErr.message)
        } else {
          console.log(`✅ Existing user [${match.id}] promoted to "instructor" role in public.profiles.`)
        }
      } else {
        console.log(`ℹ️ User is not yet registered. When "${targetEmail}" registers, they will automatically be granted the "instructor" role.`)
      }
    }

    // 4. Update .env.local with ADMIN_EMAIL
    updateEnvAdminEmail(targetEmail)
    console.log(`✅ Saved ADMIN_EMAIL=${targetEmail} in .env.local.`)

    console.log(`\n🎉 Success! [${targetEmail}] is configured as an Administrator / Supervisor Instructor.\n`)
  } catch (err) {
    console.error('❌ Failed to set admin role:', err)
    process.exit(1)
  }
}

main()
