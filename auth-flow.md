# 🚀 Auth + Onboarding Flow (Final Architecture)

## 📌 Overview

This document defines the **final, correct authentication and onboarding flow** based on:

- Role selected **before signup**
- Separate signup routes for Student & Mentor
- OTP / Password-based auth
- Profile completion + Mentor approval system

---

# 🔐 1. Entry Point (Frontend)

User selects role:

```text
Join as Student   |   Become a Mentor
```

👉 Based on selection, frontend calls:

```text
/signup/student
/signup/mentor
```

---

# 🔐 2. Signup Flow

## 👨‍🎓 Student Signup

```
POST /auth/signup/student
```

### DB State After Signup

```
role = STUDENT
isVerified = false (if OTP)
profileCompleted = false
```

---

## 🧑‍🏫 Mentor Signup

```
POST /auth/signup/mentor
```

### DB State After Signup

```
role = MENTOR
isVerified = false
profileCompleted = false
mentorStatus = PENDING
```

---

# 🔑 3. Authentication (Login / OTP)

## Password Login

```
POST /auth/login
```

## OTP Flow

```
POST /auth/send-otp
POST /auth/verify-otp
```

### After Verification

```
isVerified = true
```

---

# 🧠 4. Onboarding Flow

## 👨‍🎓 Student Onboarding

```
PUT /student/profile
```

### Data

- name
- dateOfBirth
- educationLevel
- targetCourse
- targetCollege

### After Success

```
profileCompleted = true
```

---

## 🧑‍🏫 Mentor Onboarding (Multi-step)

### Step 1: Personal

```
PUT /mentor/personal
```

### Step 2: Academic

```
PUT /mentor/academic
```

### Step 3: Documents

```
PUT /mentor/documents
```

### Final State

```
profileCompleted = true
mentorStatus = PENDING
```

---

# 🧑‍💼 5. Mentor Verification (Admin)

## Approve Mentor

```
PUT /admin/mentor/approve/:userId
```

## Reject Mentor

```
PUT /admin/mentor/reject/:userId
```

### DB State

```
mentorStatus = APPROVED | REJECTED
```

---

# 🔐 6. Middleware Flow

## 1. Auth Middleware

```
Check JWT → attach user
```

## 2. Verification Check

```
if (!user.isVerified) → block
```

## 3. Profile Completion Check

```
if (!user.profileCompleted) → redirect to onboarding
```

## 4. Mentor Approval Check

```
if (user.role === MENTOR && mentorStatus !== APPROVED) → block
```

---

# 🎯 7. Access Control Matrix

| Condition               | Result                 |
| ----------------------- | ---------------------- |
| !isVerified             | ❌ Block               |
| !profileCompleted       | ❌ Complete onboarding |
| mentorStatus = PENDING  | ❌ Under review        |
| mentorStatus = REJECTED | ❌ Block               |
| mentorStatus = APPROVED | ✅ Allow               |

---

# 📊 8. Final User Lifecycle

## 👨‍🎓 Student

```
Select Role (Student)
     ↓
/signup/student
     ↓
OTP/Login
     ↓
Fill Profile
     ↓
profileCompleted = true
     ↓
Dashboard Access
```

---

## 🧑‍🏫 Mentor

```
Select Role (Mentor)
     ↓
/signup/mentor
     ↓
OTP/Login
     ↓
Complete Onboarding
     ↓
profileCompleted = true
mentorStatus = PENDING
     ↓
Admin Approval
     ↓
mentorStatus = APPROVED
     ↓
Dashboard Access
```

---

# 🧱 9. Database Design (Important Fields)

## User

- id
- email
- password
- role (STUDENT | MENTOR)
- isVerified
- profileCompleted
- mentorStatus (only for mentor)

## StudentProfile

- personal + education

## MentorProfile

- personal
- academic
- documents

---

# 💡 10. Key Design Decisions

- Role is decided **before signup**
- Separate signup routes simplify logic
- profileCompleted controls onboarding flow
- mentorStatus controls mentor access
- isVerified ensures trusted users

---

# ✅ Final Summary

```text
Role Selection → Signup → Auth → Onboarding → Access Control
```

- Student → direct access after profile
- Mentor → requires admin approval

---

🔥 This is a **clean, scalable, production-ready auth system** tailored to your flow.
