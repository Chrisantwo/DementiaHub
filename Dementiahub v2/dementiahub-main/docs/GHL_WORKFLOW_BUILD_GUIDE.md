# GHL Workflow Build Guide

**Audience:** DementiaHub admins, staff leads, CRM/Wibiz owners, and operations managers.

**Purpose:** A step-by-step reference for building every GHL automation the DementiaHub portal supports — covering what triggers are already firing from the portal, which GHL workflows to build against each trigger, who receives each notification, and how to verify each automation is working.

**Related docs:**
- `INTERNAL_NOTIFICATIONS_AND_GHL_AUTOMATION_CHECKLIST.md` — manual operations and SLA planning
- `TEAM_DRY_RUN_RUNBOOK.md` — how to test end-to-end before going live
- `BOARD_DEMO_SCRIPT_GUIDE.md` — scripted demo for stakeholders

---

## How The Portal Talks To GHL

The DementiaHub portal sends data to GHL automatically after every significant event. You do not need to configure any inbound webhooks in GHL — the portal pushes everything via the GHL API.

What the portal does on its own (no GHL workflow needed):

| What the portal sends | When it sends it |
|---|---|
| Creates or updates a GHL contact | On portal signup, phone update, or profile change |
| Adds tags to the contact | After every portal chat or voice call |
| Updates opportunity stage (first move only) | After portal chat or voice call completes |
| Sets custom fields on contact and opportunity | After every chat or call sync |
| Adds a note with transcript and SOAP summary | After every chat or call sync |
| Queues failed syncs for retry | If the API call to GHL fails |

What the portal does NOT do automatically and must be built as GHL workflows:

- Creating internal tasks for staff
- Sending internal notifications or alerts
- Moving opportunity stages after the first sync
- SLA-based reminders
- Caregiver-facing WhatsApp messages (once WhatsApp is connected)

The workflows in this guide cover everything in the second list.

---

## Tags The Portal Adds Automatically

These tags are written by the portal. Build GHL workflow triggers against them.

### Identity tags

| Tag | When added |
|---|---|
| `Portal User` | On portal signup |
| `DementiaHub` | On portal signup |
| `Wibiz Portal User` | On portal signup |
| `Consent Verified` | On consent webhook or portal consent update |
| `WhatsApp Linked` | When a WhatsApp number is matched to a caregiver (partial implementation) |
| `Phone Verified` | When phone is linked to GHL contact |

### Case and channel tags

| Tag | When added |
|---|---|
| `Portal Chat - SAFE` | After portal chat, triage result is SAFE |
| `Portal Chat - CAUTION` | After portal chat, triage result is CAUTION |
| `Portal Chat - UNSAFE` | After portal chat, triage result is UNSAFE |
| `Voice Case - SAFE` | After voice call, triage result is SAFE |
| `Voice Case - CAUTION` | After voice call, triage result is CAUTION |
| `Voice Case - UNSAFE` | After voice call, triage result is UNSAFE |
| `Wibiz Trigger - Portal Chat` | After every portal chat sync |
| `Wibiz Trigger - Voice Case` | After every voice call sync |
| `Wibiz Trigger - Self Serve` | Case resolved by AI without staff action needed |
| `Wibiz Trigger - Needs Staff` | Case requires staff attention |
| `Wibiz Trigger - Escalation` | Escalation was triggered (UNSAFE or callback) |
| `Callback Requested` | Caregiver asked for a phone callback |
| `Wibiz Trigger - Callback Requested` | Same — secondary trigger tag |
| `Wibiz Trigger - Consent Verified` | Consent confirmed via voice or portal |

### Workflow control tags (added by GHL workflows you build)

These are not added by the portal. Add them inside your GHL workflow actions.

| Tag | Purpose |
|---|---|
| `Staff Follow-Up Needed` | Case requires a named human owner |
| `Staff Replied` | Staff has sent a human response |
| `Resolved` | Case is closed or self-served |
| `Off-Hours Contact` | Message arrived outside operating hours |
| `Sync Review Needed` | Failed sync needs admin attention |
| `Profile Incomplete` | Caregiver has no phone number on record |
| `Demo Contact` | Test or demo contact — exclude from live workflows |
| `Test Contact` | Test account — exclude from live workflows |
| `Do Not Contact - Demo` | Hard exclusion tag for demo phase |

---

## Custom Fields The Portal Writes

These fields are set on the GHL contact and opportunity. Use them as workflow filters or in notification message templates.

### Contact-level fields

| Field name | Values | Notes |
|---|---|---|
| `portal_user_id` | Integer | Links the GHL contact to the portal user record |
| `consent_given` | `"true"` / `"false"` | String value, not boolean |
| `consent_channel` | `"Voice"` / `"Portal"` | How consent was given |
| `consent_timestamp` | ISO datetime | When consent was recorded |
| `callback_requested` | `"true"` / `"false"` | Driven by latest interaction |
| `last_call_safety_result` | `SAFE` / `CAUTION` / `UNSAFE` | Most recent voice call result |
| `last_call_date` | ISO datetime | Timestamp of most recent call |
| `call_conversation_id` | String | ElevenLabs session ID for voice call |

### Opportunity-level fields

| Field name | Values | Notes |
|---|---|---|
| `case_channel` | `portal_chat` / `voice` | How the case came in |
| `chat_transcript` / `voice_transcript` | Full text | Raw conversation |
| `safety_gate_result` | `SAFE` / `CAUTION` / `UNSAFE` | Triage result |
| `safety_flag_type` | See flag types below | Why the case was flagged |
| `case_category` | `medication` / `behavior` / `safety` / `caregiver_stress` / `resources` / `general` | Topic classification |
| `callback_requested` | `"true"` / `"false"` | Callback flag for this case |
| `resolution_type` | `self_serve` / `needs_staff` | Whether staff action is needed |
| `escalation_triggered` | `"true"` / `"false"` | Whether this case escalated |
| `case_notes` | SOAP note format | Structured case summary written by AI |
| `asr_confidence` | Float | Voice-only — transcription confidence score |

### Safety flag types

The `safety_flag_type` field uses these values. Use them to route cases to the right staff:

| Flag | Meaning |
|---|---|
| `self_harm_risk` | Caregiver expressed self-harm or suicidal language |
| `abuse_risk` | Language suggesting abuse of the person with dementia |
| `wandering_risk` | Concerns about the person wandering or going missing |
| `fall_risk` | Concern about falls or physical accident |
| `medical_risk` | Medical urgency described |
| `behavioral_risk` | Aggressive or difficult behaviour described |
| `emotional_distress` | Caregiver expressed distress, overwhelm, or helplessness |
| `off_hours_request` | Message arrived outside operating hours |
| `unclear_input` | Input could not be classified reliably |
| `none` | No flag — case is clean |

---

## Pipeline: Caregiver Cases

The portal creates or moves opportunities into the **Caregiver Cases** pipeline. Build these stages in GHL.

| Stage name | Meaning | How to enter | How to exit |
|---|---|---|---|
| New Portal Contact | Caregiver just registered | Auto — portal on signup | Staff reviews profile |
| Needs Staff - Awaiting Contact | Case requires human attention | Auto — portal sync / GHL workflow | Staff claims case |
| Callback Scheduled | Caregiver asked to be called | GHL workflow on `Callback Requested` tag | Callback completed or rescheduled |
| In Staff Follow-Up | Staff is actively handling | GHL workflow on staff takeover | Outcome recorded |
| Self-Serve Resolved | Safe inquiry answered by AI | Auto — portal sync when `resolution_type = self_serve` | No further action |
| Escalated - Safety Review | Distress or safety concern | GHL workflow on UNSAFE tag | Staff lead reviews and closes |
| Sync Review Needed | Portal/GHL sync failed | GHL workflow on `Sync Review Needed` tag | CRM owner resolves |
| Closed | Case complete | Staff action or GHL workflow on `Resolved` tag | Final note added |

---

## Workflow 1: New Portal Contact

**Trigger:** Tag added — `Portal User`

**Purpose:** Notify the team when a new caregiver joins the portal so they can confirm the record is clean and complete.

**Who is notified:** Admin or staff lead (internal task).

**Audience:** Admin, staff lead.

### Build steps

1. In GHL Workflows, create a new workflow named `DementiaHub — New Portal Contact`.
2. Set trigger: **Contact Tag Added** → tag is `Portal User`.
3. Add filter: tag does NOT contain `Demo Contact` and does NOT contain `Test Contact`.
4. Add action: **Add Tag** → `DementiaHub` (in case it was not added by the portal directly).
5. Add action: **Move to Pipeline Stage** → Caregiver Cases → **New Portal Contact**.
6. Add action: **Create Task** → Title: `Review new caregiver profile — {{contact.firstName}} {{contact.lastName}}` → Assigned to: admin/staff lead → Due: same day.
7. Add action: **Add Note** → `New caregiver registered from DementiaHub portal. Please confirm name, email, phone, and GHL contact link.`
8. Add a branch: IF custom field `portal_user_id` is empty
   - Add tag `Profile Incomplete`.
   - Create task: `Missing portal ID — contact may need re-linking for {{contact.firstName}}`.
9. Add a branch: IF contact `phone` is empty
   - Add tag `Profile Incomplete`.
   - Create task: `Missing phone number for {{contact.firstName}} — follow up to complete profile`.

### Verification checklist

- [ ] Workflow fires only once per new contact (use a tag-exists filter on the second run).
- [ ] Task owner is correct for your team.
- [ ] Demo and test contacts are filtered out.
- [ ] No automated message is sent to the caregiver.

---

## Workflow 2: Distress or Safety Escalation (UNSAFE)

**Trigger:** Tag added — `Portal Chat - UNSAFE` OR `Voice Case - UNSAFE`

**Purpose:** Immediately alert the staff lead when a caregiver expresses suicidal language, self-harm risk, abuse, or immediate danger.

**Who is notified:** Staff lead + admin (urgent task + internal notification).

**Audience:** Staff lead, admin.

### Build steps

1. Create workflow named `DementiaHub — Safety Escalation UNSAFE`.
2. Set triggers (use OR logic):
   - **Contact Tag Added** → `Portal Chat - UNSAFE`
   - **Contact Tag Added** → `Voice Case - UNSAFE`
3. Add filter: tag does NOT contain `Demo Contact` and does NOT contain `Test Contact`.
4. Add action: **Move to Pipeline Stage** → Caregiver Cases → **Escalated - Safety Review**.
5. Add action: **Add Tag** → `Staff Follow-Up Needed`.
6. Add action: **Create Task** → Title: `URGENT: Safety concern — {{contact.firstName}} {{contact.lastName}}` → Assigned to: staff lead → Due: immediate (today, current time + 15 min) → Priority: urgent.
7. Add action: **Send Internal Notification** (or **Send Email to User**) → To: staff lead email → Subject: `[URGENT] DementiaHub Safety Case — {{contact.firstName}}` → Body:
   ```
   A caregiver has been flagged with an UNSAFE safety result.

   Caregiver: {{contact.firstName}} {{contact.lastName}}
   Phone: {{contact.phone}}
   Safety flag: {{opportunity.safety_flag_type}}
   Channel: {{opportunity.case_channel}}

   Case notes:
   {{opportunity.case_notes}}

   Please review the transcript and assign a named staff owner immediately.
   Link to contact: [GHL contact URL]
   ```
8. Add action: **Add Note** → `Safety escalation triggered. Staff lead notified. Assigned to escalation review.`
9. Add a wait: 4 hours.
10. Add a branch: IF tag `Staff Replied` is NOT present AND tag `Resolved` is NOT present
    - Create task: `OVERDUE: Safety case not actioned — {{contact.firstName}} {{contact.lastName}}`.
    - Send internal notification to admin: `A safety case has been open for 4 hours without a staff reply.`

### Verification checklist

- [ ] UNSAFE cases never stay in a self-serve or new stage.
- [ ] Staff lead receives the alert within 1 minute of trigger.
- [ ] Alert message includes caregiver name, phone, safety flag type, and case notes.
- [ ] No automated message is sent to the caregiver.
- [ ] 4-hour overdue reminder fires correctly.
- [ ] The workflow does not fire for `Demo Contact` or `Test Contact` records.

---

## Workflow 3: CAUTION Flag — Staff Alert

**Trigger:** Tag added — `Portal Chat - CAUTION` OR `Voice Case - CAUTION`

**Purpose:** Notify the staff queue when a caregiver shows signs of distress, emotional overwhelm, or borderline safety concern — lower urgency than UNSAFE but still needs a human review.

**Who is notified:** Staff queue (task + internal notification).

**Audience:** Staff, staff lead.

### Build steps

1. Create workflow named `DementiaHub — CAUTION Flag Staff Alert`.
2. Set triggers (OR logic):
   - **Contact Tag Added** → `Portal Chat - CAUTION`
   - **Contact Tag Added** → `Voice Case - CAUTION`
3. Add filter: NOT `Demo Contact`, NOT `Test Contact`.
4. Add action: **Move to Pipeline Stage** → **Needs Staff - Awaiting Contact**.
5. Add action: **Add Tag** → `Staff Follow-Up Needed`.
6. Add action: **Create Task** → Title: `Review CAUTION case — {{contact.firstName}} {{contact.lastName}}` → Assigned to: staff queue → Due: same business day → Priority: high.
7. Add action: **Send Internal Notification** → To: staff queue → Subject: `[DementiaHub] Caregiver case needs review — {{contact.firstName}}` → Body:
   ```
   A caregiver interaction has been classified as CAUTION.

   Caregiver: {{contact.firstName}} {{contact.lastName}}
   Phone: {{contact.phone}}
   Safety flag: {{opportunity.safety_flag_type}}
   Category: {{opportunity.case_category}}
   Channel: {{opportunity.case_channel}}

   Case notes:
   {{opportunity.case_notes}}

   Please review the case today and assign an owner.
   ```
8. Add action: **Add Note** → `CAUTION flag raised. Staff queue notified for same-day review.`
9. Add a wait: 8 hours (end of business day).
10. Add a branch: IF tag `Staff Replied` is NOT present AND tag `Resolved` is NOT present
    - Create task: `OVERDUE: CAUTION case not actioned today — {{contact.firstName}}`.

### Verification checklist

- [ ] CAUTION cases move to the correct pipeline stage.
- [ ] Notification arrives in staff queue within 2 minutes.
- [ ] End-of-day reminder fires for unactioned cases.
- [ ] No automated message is sent to the caregiver.

---

## Workflow 4: Callback Requested

**Trigger:** Tag added — `Callback Requested`

**Purpose:** Create a staff task and move the pipeline whenever a caregiver has requested a phone callback.

**Who is notified:** Staff (task), staff lead (if SLA missed).

**Audience:** Staff, staff lead.

### Build steps

1. Create workflow named `DementiaHub — Callback Requested`.
2. Set trigger: **Contact Tag Added** → `Callback Requested`.
3. Add filter: NOT `Demo Contact`, NOT `Test Contact`.
4. Add action: **Move to Pipeline Stage** → **Callback Scheduled**.
5. Add action: **Create Task** → Title: `Call back caregiver — {{contact.firstName}} {{contact.lastName}} — {{contact.phone}}` → Assigned to: staff queue → Due: same business day if before 3pm, next business day if after 3pm → Priority: high.
6. Add action: **Send Internal Notification** → To: staff queue → Subject: `[DementiaHub] Callback requested — {{contact.firstName}}` → Body:
   ```
   A caregiver has requested a phone callback.

   Caregiver: {{contact.firstName}} {{contact.lastName}}
   Phone: {{contact.phone}}
   Channel: {{opportunity.case_channel}}
   Case notes:
   {{opportunity.case_notes}}

   Please call back within the same business day.
   ```
7. Add action: **Add Note** → `Callback requested. Staff task created.`
8. Add a wait: 1 business day.
9. Add a branch: IF tag `Staff Replied` is NOT present AND tag `Resolved` is NOT present
    - Create task: `OVERDUE: Callback not completed — {{contact.firstName}} {{contact.lastName}}` → Assigned to: staff lead.
    - Send internal notification to staff lead: `A callback task was not completed on time for {{contact.firstName}}.`

### Verification checklist

- [ ] Callback task has a named owner.
- [ ] Due date logic is correct for your operating hours.
- [ ] Missed callback reminder fires correctly.
- [ ] Task is not duplicated if the caregiver requests a callback twice in the same conversation.
- [ ] No automated message is sent to the caregiver.

---

## Workflow 5: Off-Hours Contact

**Trigger:** Tag added — `Off-Hours Contact`

**Purpose:** Hold off-hours caregiver contacts for next-business-day review so no case falls through the gap overnight.

**Who is notified:** Staff queue (next-business-day task).

**Audience:** Staff, staff lead.

**Note:** The portal does not currently add the `Off-Hours Contact` tag automatically. You can either add this tag inside a GHL time-based branch, or plan to have the portal write it when the off_hours_request safety flag is detected.

### Build steps

1. Create workflow named `DementiaHub — Off-Hours Contact`.
2. Set trigger: **Contact Tag Added** → `Off-Hours Contact`.
   - Alternative trigger if the portal writes the safety flag: **Field Updated** → `safety_flag_type` equals `off_hours_request`.
3. Add filter: NOT `Demo Contact`, NOT `Test Contact`.
4. Add action: **Move to Pipeline Stage** → **Needs Staff - Awaiting Contact**.
5. Add action: **Add Tag** → `Staff Follow-Up Needed`.
6. Add action: **Create Task** → Title: `Off-hours message — follow up — {{contact.firstName}} {{contact.lastName}}` → Assigned to: staff queue → Due: next business day 9:00am.
7. Add action: **Add Note** → `Off-hours contact received. Staff task created for next business day.`
8. Optional — once WhatsApp is approved:
   - **Send WhatsApp** → To: caregiver → Message: `Thank you for reaching out to DementiaHub. Our team will be in touch on the next business day. If this is an emergency, please contact emergency services.`

### Verification checklist

- [ ] Operating hours and timezone are correctly configured in GHL.
- [ ] Weekend and public holiday behaviour is defined.
- [ ] Staff see off-hours cases at the top of their queue next morning.
- [ ] WhatsApp acknowledgement wording is reviewed before enabling.
- [ ] The caregiver acknowledgement does not promise immediate live support.

---

## Workflow 6: Staff Needs to Respond (Needs Staff Flag)

**Trigger:** Tag added — `Wibiz Trigger - Needs Staff`

**Purpose:** Route cases where the AI determined a human needs to respond into the staff queue.

**Who is notified:** Staff queue (task).

**Audience:** Staff.

### Build steps

1. Create workflow named `DementiaHub — Needs Staff Routing`.
2. Set trigger: **Contact Tag Added** → `Wibiz Trigger - Needs Staff`.
3. Add filter: NOT `Demo Contact`, NOT `Test Contact`, NOT already tagged `Staff Follow-Up Needed` (prevents duplicates when UNSAFE workflow also fires).
4. Add action: **Move to Pipeline Stage** → **Needs Staff - Awaiting Contact** (only if current stage is earlier than this).
5. Add action: **Add Tag** → `Staff Follow-Up Needed`.
6. Add action: **Create Task** → Title: `Staff follow-up needed — {{contact.firstName}} {{contact.lastName}}` → Assigned to: staff queue → Due: same business day → Priority: normal.
7. Add action: **Add Note** → `AI routed this case to staff. Pending human response.`

### Verification checklist

- [ ] This workflow does not duplicate a task already created by the UNSAFE or CAUTION workflow.
- [ ] Cases that are already in Escalated or Callback stages are not moved backwards.

---

## Workflow 7: Staff Has Replied / Human Takeover

**Trigger:** Tag added — `Staff Replied`

**Purpose:** Record that a human has responded and update the pipeline stage so the case is not flagged for overdue reminders.

**Who is notified:** Admin (activity log / note).

**Audience:** Admin, staff lead.

**Note:** The portal does not add `Staff Replied` automatically. Staff or a connected webhook should add this tag when a human response is sent via the portal. The portal does record `lastStaffResponseAt` but does not push it to GHL today.

### Build steps

1. Create workflow named `DementiaHub — Staff Reply Recorded`.
2. Set trigger: **Contact Tag Added** → `Staff Replied`.
3. Add filter: NOT `Demo Contact`, NOT `Test Contact`.
4. Add action: **Move to Pipeline Stage** → **In Staff Follow-Up**.
5. Add action: **Remove Tag** → `Staff Follow-Up Needed`.
6. Add action: **Add Note** → `Human staff reply sent. Case moved to active follow-up.`
7. Add a wait: 3 business days.
8. Add a branch: IF tag `Resolved` is NOT present
    - Create task: `Follow-up check — has {{contact.firstName}} responded or is case still open?`

### Verification checklist

- [ ] `Staff Replied` tag is added reliably when staff sends a response.
- [ ] Stage move does not overwrite an already-closed or escalated stage.
- [ ] 3-day follow-up check fires correctly.

---

## Workflow 8: Consent Verified

**Trigger:** Tag added — `Consent Verified`

**Purpose:** Log consent in the CRM activity trail and confirm the custom field is set correctly for compliance.

**Who is notified:** Admin/CRM owner (note).

**Audience:** Admin, CRM owner.

### Build steps

1. Create workflow named `DementiaHub — Consent Verified`.
2. Set trigger: **Contact Tag Added** → `Consent Verified`.
3. Add filter: NOT `Demo Contact`, NOT `Test Contact`.
4. Add action: **Add Note** → `Consent verified. Channel: {{contact.consent_channel}}. Timestamp: {{contact.consent_timestamp}}.`
5. Add action: **Add Tag** → `Phone Verified` (if contact phone is present and consent came from voice).
6. Optional: **Send Internal Notification** to CRM owner → `Consent recorded for {{contact.firstName}} {{contact.lastName}}. Please confirm portal link and custom fields are correct.`

### Verification checklist

- [ ] Note is added after every consent event.
- [ ] Custom field `consent_given` equals `"true"` on the contact.
- [ ] Consent timestamp is visible in the contact record.

---

## Workflow 9: Voice Call Completed

**Trigger:** Tag added — `Wibiz Trigger - Voice Case`

**Purpose:** Notify the staff queue that a voice call has been processed so the transcript and outcome can be reviewed.

**Who is notified:** Staff (internal notification or task depending on outcome).

**Audience:** Staff, staff lead.

**Note:** This workflow is a catch-all for every voice call. The UNSAFE, CAUTION, and Callback workflows will fire for the cases that need more urgent handling. This one covers normal-priority completed calls.

### Build steps

1. Create workflow named `DementiaHub — Voice Call Completed Review`.
2. Set trigger: **Contact Tag Added** → `Wibiz Trigger - Voice Case`.
3. Add filter: NOT `Demo Contact`, NOT `Test Contact`.
4. Add a branch: IF tag `Voice Case - UNSAFE` OR `Voice Case - CAUTION` is present
   - Stop — the escalation and CAUTION workflows handle this.
5. Add action: **Add Note** → `Voice call completed. Safety result: {{contact.last_call_safety_result}}. Resolution: {{opportunity.resolution_type}}.`
6. Add a branch: IF `opportunity.resolution_type` equals `needs_staff`
   - Create task: `Review voice call outcome — {{contact.firstName}} {{contact.lastName}}` → Due: same business day.
7. Add a branch: IF `opportunity.resolution_type` equals `self_serve`
   - Move to pipeline stage: **Self-Serve Resolved**.
   - Add tag: `Resolved`.

### Verification checklist

- [ ] UNSAFE and CAUTION calls do not create a duplicate normal-priority task.
- [ ] Self-serve calls close automatically without requiring staff action.
- [ ] Needs-staff calls create a review task.

---

## Workflow 10: Failed Sync Review

**Trigger:** Tag added — `Sync Review Needed`

**Purpose:** Alert the admin when the portal could not sync a record to GHL, so the failure is not silently lost.

**Who is notified:** Admin/CRM owner (urgent task).

**Audience:** Admin, CRM owner.

**Note:** The portal queues failed syncs internally and marks contacts for retry. You can also trigger this workflow by having the portal add the `Sync Review Needed` tag when it writes to the failed sync queue.

### Build steps

1. Create workflow named `DementiaHub — Failed Sync Review`.
2. Set trigger: **Contact Tag Added** → `Sync Review Needed`.
3. Add filter: NOT `Demo Contact`, NOT `Test Contact`.
4. Add action: **Move to Pipeline Stage** → **Sync Review Needed**.
5. Add action: **Create Task** → Title: `GHL sync failure — review needed for {{contact.firstName}} {{contact.lastName}}` → Assigned to: CRM owner → Due: same business day → Priority: high.
6. Add action: **Send Internal Notification** to admin/CRM owner → Subject: `[DementiaHub] Sync failure — {{contact.firstName}}` → Body:
   ```
   The DementiaHub portal could not sync a record to GHL for this contact.

   Caregiver: {{contact.firstName}} {{contact.lastName}}
   Phone: {{contact.phone}}

   Please check the portal failed sync queue and reconcile this record manually.
   After fixing, remove the Sync Review Needed tag and add a note.
   ```
7. Add action: **Add Note** → `Portal sync failure. Admin task created. Pending manual reconciliation.`

### Verification checklist

- [ ] Admin receives the task and notification within 5 minutes.
- [ ] Task is removed from queue after CRM owner adds a note and removes the tag.
- [ ] Resolved items are not re-triggered unless a new failure occurs.

---

## Workflow 11: SLA Escalation — Unowned Case

**Trigger:** Time-based (runs daily or on schedule)

**Purpose:** Catch cases that have been sitting in the Needs Staff or Escalated stage for too long without a named staff owner.

**Who is notified:** Staff lead (escalation task).

**Audience:** Staff lead, admin.

### Build steps

1. Create workflow named `DementiaHub — SLA Escalation Unowned Case`.
2. Set trigger: **Pipeline Stage** → **Needs Staff - Awaiting Contact** → entered more than 4 hours ago (or set to run as a daily time-based check at 9am).
3. Add filter: tag does NOT contain `Staff Follow-Up Needed` AND tag does NOT contain `Staff Replied` AND NOT `Demo Contact`.
4. Add action: **Create Task** → Title: `SLA BREACH: Unowned case — {{contact.firstName}} {{contact.lastName}}` → Assigned to: staff lead → Due: immediately.
5. Add action: **Send Internal Notification** to staff lead → `A caregiver case has been in Needs Staff for more than 4 hours without an assigned owner: {{contact.firstName}} {{contact.lastName}}.`
6. For **Escalated - Safety Review** stage: reduce the threshold to 2 hours and notify admin in addition to staff lead.

### SLA reference

| Case type | Internal target | Escalation to staff lead after |
|---|---|---|
| Immediate safety concern (UNSAFE) | As soon as seen | 2 hours |
| Distressed caregiver (CAUTION) | Same business day | 8 hours |
| Callback requested | Same or next business day | 1 business day |
| Off-hours message | Next business day | 1 business day |
| Standard inquiry (SAFE, needs staff) | Normal review cycle | 24 hours |
| Sync failure | Same business day | 8 hours |

### Verification checklist

- [ ] Threshold times reflect the approved SLA targets.
- [ ] Escalated cases use the stricter 2-hour threshold.
- [ ] Self-serve resolved cases are excluded.
- [ ] Notifications stop once a staff owner is assigned.

---

## Workflow 12: Case Resolved

**Trigger:** Tag added — `Resolved`

**Purpose:** Move the pipeline to Closed and add a final activity note when a case is marked resolved.

**Who is notified:** Admin (note/activity log).

**Audience:** Admin.

### Build steps

1. Create workflow named `DementiaHub — Case Resolved`.
2. Set trigger: **Contact Tag Added** → `Resolved`.
3. Add filter: NOT `Demo Contact`, NOT `Test Contact`.
4. Add action: **Move to Pipeline Stage** → **Closed**.
5. Add action: **Remove Tags** → `Staff Follow-Up Needed`, `Callback Requested`.
6. Add action: **Add Note** → `Case resolved. Resolution type: {{opportunity.resolution_type}}. Closed by workflow.`

### Verification checklist

- [ ] Closed stage is the final stage — no further workflow moves should occur after this.
- [ ] Callback and staff-follow-up tags are cleaned up on close.

---

## Notification Summary

Who gets notified for each event:

| Event | Staff | Staff lead | Admin / CRM owner | Caregiver |
|---|---|---|---|---|
| New caregiver registered | Task (review profile) | — | Task (if phone or ID missing) | — |
| Portal chat — SAFE, self-serve | — | — | Activity note | — |
| Portal chat — SAFE, needs staff | Task | — | — | — |
| Portal chat — CAUTION | Task + alert | Task | — | — |
| Portal chat — UNSAFE | — | Urgent task + alert | Alert | — |
| Voice call — SAFE, self-serve | — | — | Activity note | — |
| Voice call — SAFE, needs staff | Task | — | — | — |
| Voice call — CAUTION | Task + alert | Task | — | — |
| Voice call — UNSAFE | — | Urgent task + alert | Alert | — |
| Callback requested | Task (call back) | Escalation if missed | — | WhatsApp ack (future) |
| Off-hours contact | Next-day task | — | — | WhatsApp ack (future) |
| Consent verified | — | — | Note / notification | — |
| Staff reply sent | — | Note | Activity log | (Portal shows reply) |
| Failed sync | — | — | Task + urgent alert | — |
| SLA missed — unowned case | — | Escalation task | Alert if critical | — |
| Case resolved | — | — | Activity note | — |

---

## WhatsApp-Ready Automations (Build After WhatsApp Is Connected)

Do not enable these until WhatsApp is connected, tested, and caregiver-facing wording is approved by leadership.

### Caregiver-facing messages to build

| Trigger | Message type | Suggested content |
|---|---|---|
| `Callback Requested` tag added | WhatsApp to caregiver | "We have received your request for a callback. A team member will be in touch within [SLA timeframe]. Thank you." |
| `Off-Hours Contact` tag added | WhatsApp to caregiver | "Thank you for reaching out. Our team is currently unavailable but will respond on the next business day. If this is an emergency, please contact emergency services." |
| Staff replies from portal | WhatsApp to caregiver | Mirror the staff message to WhatsApp for caregivers who first contacted via WhatsApp. |
| Case resolved | WhatsApp to caregiver | "Your DementiaHub support case has been resolved. If you have further questions, please reach out any time." |
| Consent reminder | WhatsApp to caregiver | "We noticed we haven't confirmed your consent preferences yet. Please log in to the DementiaHub portal to complete this step." |

### Internal WhatsApp notifications to build

| Trigger | Internal alert | Recipient |
|---|---|---|
| Caregiver sends WhatsApp after hours | Alert to staff lead | Staff lead |
| WhatsApp classified as CAUTION or UNSAFE | Urgent alert | Staff lead |
| Unknown WhatsApp number cannot be linked | Alert with phone number | CRM owner |
| WhatsApp delivery fails | Failure alert | Admin |

---

## Build Priority

Recommended order based on operational risk:

1. **Workflow 2 — Safety Escalation (UNSAFE)** — highest risk, must work before any live caregiver contact.
2. **Workflow 3 — CAUTION Flag** — second-highest risk.
3. **Workflow 4 — Callback Requested** — high-volume, directly impacts caregiver trust.
4. **Workflow 1 — New Portal Contact** — foundational, runs on every signup.
5. **Workflow 5 — Off-Hours Contact** — prevents overnight cases from being missed.
6. **Workflow 6 — Needs Staff Routing** — catch-all for unescalated but human-required cases.
7. **Workflow 10 — Failed Sync Review** — operational integrity.
8. **Workflow 11 — SLA Escalation** — only build once the team has stable daily volume.
9. **Workflows 7, 8, 9, 12** — supporting workflows for tracking and closing the loop.
10. **WhatsApp automations** — build only after channel is live and wording is approved.

---

## Pre-Launch Signoff Checklist

Complete this before enabling any workflow for real caregivers.

### Tags and fields

- [ ] All tags in the Tags reference section exist in GHL with the exact spelling listed.
- [ ] All custom fields in the Custom Fields section exist in GHL at the correct level (contact or opportunity).
- [ ] Test contacts are tagged `Demo Contact` or `Test Contact` and are excluded from all live workflows.

### Pipeline

- [ ] Caregiver Cases pipeline exists with all stages listed in the Pipeline section.
- [ ] Stage order is correct and matches the flow described.

### Workflows

- [ ] Workflow 2 (UNSAFE) fires and creates an urgent task within 2 minutes of the tag being added.
- [ ] Workflow 2 (UNSAFE) does not send any message to the caregiver.
- [ ] Workflow 3 (CAUTION) fires and creates a high-priority task.
- [ ] Workflow 4 (Callback) fires and creates a callback task with a due date.
- [ ] Workflow 5 (Off-Hours) task due date falls on the next business day.
- [ ] Workflow 1 (New Contact) does not run on demo or test contacts.
- [ ] Workflow 10 (Failed Sync) creates an admin task and notification.
- [ ] No workflow sends a message to a real caregiver without approval from leadership.

### Team readiness

- [ ] Every workflow has a named task owner.
- [ ] Staff know how to manually add and remove the `Staff Replied` and `Resolved` tags.
- [ ] Admin knows how to pause a workflow if it misfires.
- [ ] Staff know how to check the failed sync queue in the portal admin.
- [ ] Operating hours and timezone are set correctly in GHL.
- [ ] WhatsApp automations are disabled until the channel is ready.
