# DementiaHub Team Dry Run Actor Script

Source runbook: `docs/TEAM_DRY_RUN_RUNBOOK.md`

Purpose: a practical rehearsal script for three live actors:

- Caregiver Actor: plays Jules
- Staff Actor: plays Kim
- Admin Actor: plays Aileen and keeps the dry run moving

Target duration: 22 minutes.

Demo principle: caregiver simplicity, staff accountability, admin governance.

## 1. Roles And Ground Rules

### Admin Actor

Owns:

- Starting and ending the dry run
- Showing readiness, admin records, and workflow health
- Calling the next segment if the team drifts
- Deciding whether to use fallbacks

Do not show:

- API keys, secrets, raw webhook payloads, or unrelated caregiver data
- Backend vendor details unless asked by a technical audience

### Caregiver Actor

Owns:

- Caregiver dashboard, profile, assistant, history, and optional voice
- Typing or speaking only approved prompts
- Staying calm and human

Do not improvise:

- Urgent self-harm wording
- Medical or legal questions
- Personal real-world details

### Staff Actor

Owns:

- Staff portal
- Finding escalated or callback cases
- Showing staff-only context
- Sending the approved human reply

Do not claim:

- Guaranteed real-time response
- Clinical diagnosis
- Emergency service replacement

## 2. Pre-Flight Call Sheet

Run this 60-90 minutes before the dry run.

| Item | Actor | Pass condition |
|---|---|---|
| Admin login | Admin | `/demo/dry-run`, `/admin/conversations`, and `/admin/integration` open |
| Caregiver login | Caregiver | `/`, `/profile`, `/assistant`, and `/history` open |
| Staff login | Staff | `/portal/staff` opens |
| Caregiver profile | Caregiver | Jules has demo-safe contact details |
| Admin readiness | Admin | Readiness or diagnostics are visible |
| Staff queue | Staff | Staff can see current or prepared cases |
| Standard assistant prompt | Caregiver | Assistant gives a useful response |
| Distress route | Staff | Staff/admin can find the latest serious case |
| Voice decision | Admin | Mark as "voice green" or "saved voice fallback" |
| Backup records | Admin | Saved chat/call records are ready if live flow slows |

Hard stop:

- If Admin cannot log in, do not start.
- If caregiver data is sensitive or unrelated, switch accounts.
- If voice fails any test, use saved voice fallback.
- If Wibiz/GHL is unstable, continue portal-only and verify externally after the run.

## 3. Browser Tabs

Open these before sharing the screen.

Admin:

1. `/demo/dry-run`
2. `/admin/integration`
3. `/admin/conversations`
4. Optional: `/api/webhooks/health`

Caregiver:

1. `/`
2. `/profile`
3. `/assistant`
4. `/history`
5. Optional: `/call`

Staff:

1. `/portal/staff`
2. Backup: `/admin/conversations`

Keep CRM/Wibiz and ElevenLabs tabs off screen unless the audience specifically needs technical proof.

## 4. Run-Of-Show

| Segment | Time | Lead actor | Screen |
|---|---:|---|---|
| Opening | 1 min | Admin | `/demo/dry-run` |
| Admin readiness | 3 min | Admin | `/demo/dry-run`, `/admin/integration`, `/admin/conversations` |
| Caregiver standard inquiry | 4 min | Caregiver | `/`, `/profile`, `/assistant`, `/history` |
| Distress escalation | 5 min | Caregiver + Staff | `/assistant`, `/portal/staff` |
| Off-hours callback | 3 min | Caregiver + Staff | `/assistant`, `/portal/staff` |
| Voice journey | 4 min | Caregiver + Admin | `/call`, `/history`, call details |
| Admin closeout | 2 min | Admin | `/admin/conversations`, `/admin/integration`, `/demo/dry-run` |

If any segment runs more than 60 seconds over time, Admin says: "Let's move to the next planned screen."

## 5. Segment Script

### Segment 0: Opening

Screen: `/demo/dry-run`

Admin says:

> Today we are showing DementiaHub as a guided support portal for caregivers and the team behind them. The goal is not to replace human care. The goal is to listen consistently, preserve context, and route the right cases to staff before they are missed.

> We will show three views: caregiver, staff, and admin. Together they show the full journey from first contact to follow-up and oversight.

Admin cue:

> Move to admin readiness.

Pass condition:

- Everyone understands the three-view structure.

### Segment 1: Admin Readiness

Screen order:

1. `/demo/dry-run`
2. `/admin/integration`
3. `/admin/conversations`

Admin actions:

1. Show dry-run readiness cards.
2. Open integration diagnostics.
3. Show Wibiz/support workflow readiness.
4. Open admin conversations.
5. Show caregiver directory and recent activity.

Admin says:

> Before any caregiver journey, the team checks readiness. This gives operations an answer to three questions: are we connected, are cases visible, and is anything stuck?

> This is important because caregiver support cannot depend on guesswork. The admin view gives the team a control layer.

Admin cue:

> Switch to caregiver standard inquiry.

Fallback if diagnostics are slow:

> The diagnostic check is still refreshing, so we will continue with the prepared record and come back to the health view at the end.

Pass condition:

- Admin readiness page opens.
- Integration status is visible.
- Recent caregiver or support activity is visible.

### Segment 2: Caregiver Standard Inquiry

Screen order:

1. Caregiver dashboard: `/`
2. Profile: `/profile`
3. Support Assistant: `/assistant`
4. History: `/history`

Caregiver actions:

1. Show caregiver dashboard.
2. Open profile and confirm phone/contact setup is ready.
3. Open Support Assistant.
4. Type the exact prompt below.

Caregiver types:

```text
I am looking for dementia care services for my mother. Can someone help me understand what options are available?
```

Expected assistant result:

- Empathetic response
- Practical next questions or next steps
- No medical overclaiming
- Conversation is saved
- No internal safety score appears to caregiver

Admin says while Caregiver is on screen:

> This is the normal caregiver path. The caregiver is not asked to understand systems or workflows. They simply ask for help in plain language.

Caregiver opens History.

Admin says:

> The important part is continuity. When this caregiver returns, the conversation is not lost and the team can review the support history.

Admin cue:

> Move to distress escalation.

Fallback if assistant is slow:

> The live response is taking longer than expected, so we will use the saved conversation record to show the same continuity outcome.

Pass condition:

- Assistant replies.
- Conversation appears in history.
- Caregiver view does not expose internal triage details.

### Segment 3: Distress Escalation And Staff Handoff

Screen order:

1. Caregiver Assistant: `/assistant`
2. Staff Portal: `/portal/staff`
3. Backup: Admin Conversations `/admin/conversations`

Caregiver types:

```text
I cannot cope anymore. I am desperate and I do not know what to do.
```

Expected assistant result:

- Calm supportive response
- Emergency guidance if there is immediate danger
- Stops treating the case as routine
- Routes or flags for staff attention

Admin says:

> This is where the system must change posture. A serious message should not be handled like a normal FAQ. The caregiver receives calm language, while staff receive the operational signal.

Staff actions:

1. Open Staff Portal.
2. Find the latest case for Jules.
3. Open the case.
4. Show staff-only context.
5. Send the approved staff reply.

Staff types:

```text
Hi Jules, this is Kim from the DementiaHub support team. I am sorry this has been so overwhelming. I am going to follow up with you directly so we can understand what is happening and help you with next steps.
```

Admin says:

> Staff do not need to piece together where the message came from. They can see the caregiver, the recent context, and the follow-up need in one operational view.

Admin cue:

> Move to off-hours callback.

Fallback if staff queue does not refresh:

> The staff queue refresh can take a moment, so we will open the same caregiver from the admin conversation view and show the staff review path there.

Pass condition:

- Distressed case is visible to staff or admin.
- Staff can send or demonstrate human follow-up.
- Caregiver-facing page stays calm and respectful.

### Segment 4: Off-Hours Callback

Screen order:

1. Caregiver Assistant: `/assistant`
2. Staff Portal: `/portal/staff`

Caregiver types:

```text
It is late at night and I need help arranging care tomorrow. Can someone contact me?
```

Expected assistant result:

- Acknowledges the request
- Sets realistic expectations
- Encourages emergency services if immediate danger is present
- Captures callback or follow-up need internally

Admin says:

> Many caregiver needs happen outside office hours. The important experience here is not silence. The caregiver receives a clear holding response and the team has a follow-up trail.

Staff actions:

1. Show callback or follow-up status in staff/admin view.
2. Confirm the case is actionable.

Admin cue:

> Voice decision.

Fallback if callback status is not visible:

> The message is captured in the caregiver record. Callback tagging is the operational layer we verify in Wibiz after the run.

Pass condition:

- Callback need is visible or can be explained from the case record.
- No one claims live staff are available if they are not.

### Segment 5: Voice Journey

Before this segment, Admin says either:

```text
Voice green.
```

or:

```text
Use saved voice fallback.
```

If voice is green, screen order:

1. `/call`
2. Live call monitor, if already opened
3. `/history`
4. Call detail page

Caregiver speaks:

```text
Hi, I am caring for my mother who has dementia. I want to understand what support options are available and whether someone can guide me.
```

Optional callback voice line:

```text
Can someone call me tomorrow morning? I would like to speak to a person about care options.
```

Admin says:

> Some caregivers may prefer speaking rather than typing. The value is not only the live conversation. The value is that the call becomes a support record the team can review.

Expected result:

- Call starts.
- Assistant responds.
- Call record appears in history or prepared call record is shown.
- Transcript or summary is available for review.

If voice is not green, Admin says:

> We tested the voice path before this session and chose not to run it live because we want the dry run to stay controlled. Here is the saved call record showing the intended outcome: transcript, summary, and staff visibility.

Admin cue:

> Admin closeout.

Pass condition:

- Either live voice succeeds, or saved voice record clearly shows the same workflow.

### Segment 6: Admin Closeout

Screen order:

1. `/admin/conversations`
2. `/admin/integration`
3. `/demo/dry-run`

Admin actions:

1. Show caregiver record with chat and/or voice history.
2. Show recent activity.
3. Show integration or failed-sync visibility.
4. Return to dry-run center.

Admin says:

> What we demonstrated is the full operating model. Caregivers get a simple support experience. Staff get context and follow-up signals. Admins get visibility into readiness and workflow health.

> DementiaHub is a support and routing layer. It improves continuity, responsiveness, and accountability while keeping human care teams in control.

Pass condition:

- Admin can locate the caregiver record.
- Admin can see activity and workflow health.
- Closing message reinforces human oversight.

## 6. Approved Prompts

Use only these prompts during the dry run.

| Scenario | Exact prompt |
|---|---|
| Standard inquiry | `I am looking for dementia care services for my mother. Can someone help me understand what options are available?` |
| Distress escalation | `I cannot cope anymore. I am desperate and I do not know what to do.` |
| Off-hours callback | `It is late at night and I need help arranging care tomorrow. Can someone contact me?` |
| Repeated contact | `Following up on our earlier conversation, my father is sundowning again and I need next steps.` |
| Unclear input | `asdf qwer lah I don't know what thing ??? can or not?` |
| Voice standard | `Hi, I am caring for my mother who has dementia. I want to understand what support options are available and whether someone can guide me.` |
| Voice callback | `Can someone call me tomorrow morning? I would like to speak to a person about care options.` |

## 7. Quick Fallback Lines

| Problem | Actor | Action | Line |
|---|---|---|---|
| App page slow | Admin | Refresh once, then switch to prepared tab | `We will use the prepared record so the flow stays clear.` |
| Assistant response slow | Caregiver | Open saved history | `The live response is still generating, so we will show the saved result of the same workflow.` |
| Staff queue delayed | Staff | Use admin conversations view | `The queue refresh can take a moment; the same case is visible from admin records.` |
| Voice unstable | Admin | Use saved voice record | `We tested voice before the session and will show the saved record for a controlled run.` |
| Wibiz/GHL unavailable | Admin | Verify after session | `External workflow verification is running separately; the portal record remains intact.` |
| Wrong account visible | Admin | Stop screen share and switch account | `Give us one moment to switch to the clean demo account.` |
| Sensitive data visible | Admin | Stop screen share immediately | `We are pausing screen share briefly before continuing.` |

## 8. After-Run Scorecard

Complete this immediately after rehearsal.

| Area | Pass | Notes |
|---|---|---|
| Admin readiness visible | Yes / No | |
| Caregiver standard inquiry completed | Yes / No | |
| Conversation saved to history | Yes / No | |
| Distress escalation visible to staff/admin | Yes / No | |
| Staff reply or handoff demonstrated | Yes / No | |
| Off-hours callback captured | Yes / No | |
| Voice shown live or via saved record | Yes / No | |
| Admin can locate final caregiver record | Yes / No | |
| No sensitive data exposed | Yes / No | |
| No unsupported claims made | Yes / No | |

Decision:

- Green: all critical rows pass.
- Amber: core portal flow passes, but one integration needs manual verification.
- Red: login, caregiver history, staff visibility, or sensitive-data control fails.

Critical rows:

- Admin readiness
- Caregiver standard inquiry
- Saved history
- Distress escalation visibility
- No sensitive data exposed

## 9. Rehearsal Notes

Run three rehearsals:

1. Technical rehearsal: stop often and verify each integration.
2. Timing rehearsal: full script under 25 minutes, no ad-libbing.
3. Final rehearsal: treat it like the real dry run and use backup only if needed.

After each rehearsal:

- Record what failed.
- Assign one owner per fix.
- Re-run only the failed segment.
- Do not add new content after the final rehearsal unless it fixes a blocker.
