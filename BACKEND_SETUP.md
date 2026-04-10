# Backend Setup Guide - LangConnect

This guide will help you set up the complete backend infrastructure for the LangConnect language learning platform.

## 🎯 Overview

LangConnect requires the following backend services:

1. **Supabase** - Authentication, Database, and Real-time features
2. **WebRTC Service** - Video/Audio calling infrastructure
3. **Signaling Server** - WebRTC connection coordination

---

## 📦 1. Supabase Setup

### Connect from Make Settings

1. Go to **Make settings page**
2. Click **Connect Supabase**
3. Follow the prompts to link your Supabase project

### Database Schema

Once connected, create these tables in your Supabase dashboard:

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### User Profiles Table
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  gender TEXT NOT NULL,
  selected_language TEXT,
  is_online BOOLEAN DEFAULT false,
  total_sessions INTEGER DEFAULT 0,
  total_minutes INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Active Sessions Table
```sql
CREATE TABLE active_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  partner_id UUID REFERENCES auth.users(id),
  language TEXT NOT NULL,
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'disconnected'))
);
```

#### Matching Queue Table
```sql
CREATE TABLE matching_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  gender TEXT NOT NULL,
  language TEXT NOT NULL,
  joined_at TIMESTAMP DEFAULT NOW()
);
```

### Row Level Security (RLS)

Enable RLS on all tables and add policies:

```sql
-- Users can read their own profile
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);
```

---

## 🎥 2. WebRTC Setup Options

Choose one of these WebRTC providers:

### Option A: Daily.co (Recommended for MVP)

**Why Daily.co?**
- Easy integration
- Free tier: 10,000 minutes/month
- Built-in STUN/TURN servers
- Great documentation

**Setup:**
1. Sign up at [https://daily.co](https://daily.co)
2. Get your API key from the dashboard
3. Add to Supabase secrets:
   - Key: `DAILY_API_KEY`
   - Value: Your Daily.co API key

**Integration Code:**
```typescript
// In your Supabase Edge Function
import { Deno } from "https://deno.land/x/deno@v1.32.0/mod.ts";

const DAILY_API_KEY = Deno.env.get('DAILY_API_KEY');

export async function createRoom(language: string) {
  const response = await fetch('https://api.daily.co/v1/rooms', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DAILY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: `${language}-${Date.now()}`,
      properties: {
        max_participants: 2,
        enable_chat: true,
        enable_screenshare: false,
        exp: Math.floor(Date.now() / 1000) + 600, // 10 minutes
      }
    })
  });
  
  return await response.json();
}
```

### Option B: Agora.io

**Setup:**
1. Sign up at [https://agora.io](https://agora.io)
2. Create a project
3. Add App ID and App Certificate to Supabase secrets:
   - `AGORA_APP_ID`
   - `AGORA_APP_CERTIFICATE`

### Option C: Custom WebRTC Server

For full control, deploy your own signaling server:

```typescript
// signaling-server.ts
import { Server } from "socket.io";

const io = new Server(3000, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  socket.on("join-room", ({ roomId, userId }) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
  });

  socket.on("offer", (data) => {
    socket.to(data.roomId).emit("offer", data);
  });

  socket.on("answer", (data) => {
    socket.to(data.roomId).emit("answer", data);
  });

  socket.on("ice-candidate", (data) => {
    socket.to(data.roomId).emit("ice-candidate", data);
  });
});
```

---

## ⚡ 3. Supabase Edge Functions

Create these Edge Functions for your backend logic:

### Function: `match-users`

```typescript
// supabase/functions/match-users/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { userId, language, gender } = await req.json()
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Add user to matching queue
  await supabase.from('matching_queue').insert({
    user_id: userId,
    language,
    gender
  })

  // Find a match with same language and gender
  const { data: matches } = await supabase
    .from('matching_queue')
    .select('*')
    .eq('language', language)
    .eq('gender', gender)
    .neq('user_id', userId)
    .limit(1)

  if (matches && matches.length > 0) {
    const partner = matches[0]
    
    // Create session
    await supabase.from('active_sessions').insert({
      user_id: userId,
      partner_id: partner.user_id,
      language
    })

    // Remove both from queue
    await supabase.from('matching_queue')
      .delete()
      .in('user_id', [userId, partner.user_id])

    return new Response(
      JSON.stringify({ matched: true, partnerId: partner.user_id }),
      { headers: { "Content-Type": "application/json" } }
    )
  }

  return new Response(
    JSON.stringify({ matched: false }),
    { headers: { "Content-Type": "application/json" } }
  )
})
```

### Function: `create-room`

```typescript
// supabase/functions/create-room/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { language } = await req.json()
  const DAILY_API_KEY = Deno.env.get('DAILY_API_KEY')

  const response = await fetch('https://api.daily.co/v1/rooms', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DAILY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: `${language}-${Date.now()}`,
      properties: {
        max_participants: 2,
        exp: Math.floor(Date.now() / 1000) + 600
      }
    })
  });

  const room = await response.json()
  
  return new Response(
    JSON.stringify(room),
    { headers: { "Content-Type": "application/json" } }
  )
})
```

---

## 🔒 4. Security Rules

### Authentication Policies

```sql
-- Only authenticated users can access
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE matching_queue ENABLE ROW LEVEL SECURITY;

-- Gender-based matching enforcement
CREATE FUNCTION check_gender_match() RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT gender FROM user_profiles WHERE id = NEW.partner_id
  ) != (
    SELECT gender FROM user_profiles WHERE id = NEW.user_id
  ) THEN
    RAISE EXCEPTION 'Gender mismatch not allowed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_gender_matching
  BEFORE INSERT ON active_sessions
  FOR EACH ROW EXECUTE FUNCTION check_gender_match();
```

---

## 🚀 5. Environment Variables

Add these to your Supabase Edge Functions:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DAILY_API_KEY=your_daily_api_key
```

---

## 📊 6. Real-time Subscriptions

Enable Realtime on these tables in Supabase dashboard:

- `matching_queue` - For live matching updates
- `active_sessions` - For session status
- `user_profiles` - For online status

---

## 🧪 7. Testing Your Setup

### Test Authentication
```bash
curl -X POST 'https://your-project.supabase.co/auth/v1/signup' \
  -H 'apikey: YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"email": "test@example.com", "password": "password123"}'
```

### Test Matching Function
```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/match-users' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"userId": "user-id", "language": "en", "gender": "male"}'
```

---

## 📈 Scaling Considerations

### For Production (Millions of Users):

1. **Database Optimization**
   - Add indexes on frequently queried columns
   - Use database pooling (PgBouncer)
   - Partition large tables

2. **Caching Layer**
   - Redis for active sessions
   - CDN for static assets

3. **Load Balancing**
   - Multiple WebRTC servers
   - Geographic distribution

4. **Monitoring**
   - Sentry for error tracking
   - PostHog for analytics
   - Grafana for metrics

---

## 💰 Cost Estimation

### MVP (0-1,000 users):
- Supabase: $25/month
- Daily.co: Free tier
- **Total: ~$25/month**

### Growth (10,000 users):
- Supabase Pro: $25/month
- Daily.co: $99/month
- **Total: ~$124/month**

### Scale (100,000+ users):
- Supabase Enterprise
- Custom WebRTC infrastructure
- **Total: $1,000+ /month**

---

## 🆘 Support

- Supabase Docs: https://supabase.com/docs
- Daily.co Docs: https://docs.daily.co
- WebRTC Guide: https://webrtc.org/getting-started/overview

---

## ✅ Next Steps

1. ✓ Connect Supabase from Make settings
2. ✓ Create database tables
3. ✓ Choose WebRTC provider
4. ✓ Deploy Edge Functions
5. ✓ Test end-to-end flow
6. ✓ Launch MVP! 🚀
