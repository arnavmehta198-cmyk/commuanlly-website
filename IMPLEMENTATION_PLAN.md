# Web App Implementation Plan

## ✅ What's Already Done

1. **Authentication** - Google Sign-In + Guest mode
2. **Job Posting** - Create opportunities with all fields
3. **Job Browsing** - Grid + list views with filters
4. **Map Integration** - Google Maps with markers
5. **Messaging** - Send/receive messages (demo mode)
6. **Basic Profiles** - View user info
7. **Applications** - Apply to jobs

---

## 🚀 What I'm Adding Now

### Phase 1: Core Infrastructure (Implementing Now)

#### 1. Enhanced User Model
Adding all iOS fields:
```javascript
{
  uid, email, displayName, photoURL,
  firstName, lastName, age, username,
  userType, skills: [], bio,
  location: { lat, lng, address },
  ageGroup: 'teen' | 'adult',
  isParentalApproved: boolean,
  hasCompletedOnboarding: boolean,
  jobsCompleted: number,
  rating: number,
  totalEarned: number,
  stripeCustomerId: string,
  stripeConnectAccountId: string,
  blockedUsers: [],
  createdAt, acceptedTermsDate, acceptedPrivacyDate
}
```

#### 2. Profile Editing ⭐ PRIORITY 1
- Edit Profile modal
- Photo upload
- Skills selector (chips interface)
- Bio textarea
- Save to Firestore
- Real-time updates

#### 3. Skills Management
- Predefined skill list (matches iOS)
- Add/remove skills
- Skill chips UI
- Filter jobs by skills

#### 4. Block/Report System ⭐ PRIORITY 2
- Block user button
- Report user modal with 8 categories:
  - Inappropriate Behavior
  - Harassment or Bullying
  - Spam
  - Scam or Fraud
  - Fake Profile
  - Didn't Show Up
  - Poor Quality Work
  - Other
- Blocked users list
- Filter content from blocked users
- Admin report queue

#### 5. Job Completion Workflow ⭐ PRIORITY 3
- "Mark Complete" button (hirers only)
- Completion modal
- Optional notes
- Update job status
- Trigger payment release (when Stripe added)
- Send notification
- Show rating prompt

#### 6. Ratings & Reviews
- 5-star rating component
- Written review textarea
- Display on profiles
- Calculate average
- Show count

---

## 📦 Code Structure

### New Files to Create:

```
/Services/
  - SafetyManager.js - Block/report logic
  - RatingManager.js - Rating/review logic
  - ProfileManager.js - Profile CRUD operations

/Components/ (inline in app.html for now)
  - EditProfileModal
  - BlockReportModal
  - SkillsSelector
  - RatingStars
  - JobCompletionModal
```

### New Firestore Collections:

```javascript
// users - Enhanced
{
  ...existing fields,
  + firstName, lastName, age, username,
  + skills: [], bio, location,
  + ageGroup, isParentalApproved,
  + stripeCustomerId, stripeConnectAccountId,
  + blockedUsers: []
}

// userReports - New
{
  reporterId, reportedUserId,
  type, description, relatedJobId,
  status: 'pending' | 'reviewing' | 'resolved',
  createdAt, reviewedAt, adminNotes
}

// ratings - New
{
  jobId, raterId, ratedUserId,
  rating: 1-5, review: string,
  createdAt
}
```

---

## 🎯 Implementation Steps (Today)

### Step 1: Add Profile Editing ✅
- [x] Create edit profile modal HTML
- [x] Add skills selector
- [x] Add photo upload
- [x] Connect to Firestore
- [ ] Test save/load

### Step 2: Add Block/Report ✅
- [x] Create safety manager
- [x] Add block/report buttons
- [x] Create report modal
- [x] Save to Firestore
- [ ] Filter blocked content

### Step 3: Add Job Completion ✅
- [x] Add "Mark Complete" button
- [x] Create completion modal
- [x] Update job status
- [x] Trigger rating prompt
- [ ] Connect to Stripe (future)

### Step 4: Add Ratings ✅
- [x] Create rating component
- [x] Add to completion flow
- [x] Save to Firestore
- [x] Display on profiles

---

## 🔄 Changes Being Made

### 1. State Object - Enhanced
```javascript
const state = {
  user: {
    // Basic (existing)
    uid, name, email, initials, photoURL,
    // Enhanced (adding)
    firstName, lastName, age, username,
    skills: [], bio, location,
    blockedUsers: [], stripeCustomerId
  },
  // ... rest
}
```

### 2. UI Components - New Modals
- Edit Profile Modal
- Block User Modal
- Report User Modal
- Job Completion Modal
- Rating Modal

### 3. Navigation - New Pages
- Blocked Users page
- My Applications page (enhanced)
- Payment History page (future)

---

## ⚡ Quick Win Features (30 min each)

1. **Skills Filter** - Filter jobs by required skills
2. **Distance Filter** - Show only nearby jobs
3. **My Applications** - Track applied jobs
4. **Job Status** - Show active/completed badges
5. **User Initials** - Better avatar fallbacks

---

## 🔐 Safety Features

All iOS safety features will be replicated:

1. **Blocking**:
   - Hide blocked users' jobs
   - Block messages
   - Block applications
   - Sync across devices

2. **Reporting**:
   - Multiple categories
   - Detailed descriptions
   - Link to related job
   - Admin review queue
   - Confidential submissions

---

## 💳 Future: Stripe Integration (Next Week)

```javascript
// PaymentManager.js
class PaymentManager {
  async chargeHirer(jobId, amount) { ... }
  async releaseToWorker(jobId) { ... }
  async connectBankAccount() { ... }
  async viewTransactions() { ... }
}
```

---

## 📱 Responsive Design

All new features will be mobile-responsive:
- Touch-friendly buttons (48x48px min)
- Swipe gestures for mobile
- Adaptive modals
- Bottom sheets on mobile

---

## ✅ Testing Checklist

For each feature:
- [ ] Works in Guest mode
- [ ] Works with Firebase
- [ ] Mobile responsive
- [ ] Error handling
- [ ] Loading states
- [ ] Success messages
- [ ] Validates input

---

## 🎨 UI Consistency

All new components will match existing style:
- Green primary color (#22c55e)
- 16px border radius
- Smooth transitions
- Shadow depth: 0 4px 12px rgba()
- Font: Inter

---

## 📊 Success Metrics

After implementation:
- ✅ 90%+ feature parity with iOS
- ✅ All safety features working
- ✅ Profile management complete
- ✅ Job lifecycle complete
- ✅ Ready for payments

---

**Status**: Starting implementation now
**ETA**: 3-4 hours for core features
**Next**: Stripe + notifications (next session)
