import { Schema, model, Document, Types } from "mongoose";

// ─── Interface ────────────────────────────────────────────────────────────────

export interface ICallTranscript extends Document {
  _id: Types.ObjectId;
  conversationId: string;
  ghlContactId: string;
  opportunityId: string | null;
  transcriptRaw: string;
  callSummary: string;
  callEndTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const CallTranscriptSchema = new Schema<ICallTranscript>(
  {
    conversationId: {
      type: String,
      required: true,
      unique: true,        // ElevenLabs conversation_id is globally unique
      index: true,
    },
    ghlContactId: {
      type: String,
      required: true,
      index: true,         // frequent lookup: all calls for a contact
    },
    opportunityId: {
      type: String,
      default: null,
    },
    transcriptRaw: {
      type: String,
      required: true,
    },
    callSummary: {
      type: String,
      required: true,
    },
    callEndTime: {
      type: Date,
      required: true,
    },
  },
  {
    collection: "call_transcripts",   // explicit collection name
    timestamps: true,                 // adds createdAt + updatedAt automatically
  }
);

// ─── Compound index ───────────────────────────────────────────────────────────
// Supports: find all transcripts for a contact sorted by call date
CallTranscriptSchema.index({ ghlContactId: 1, callEndTime: -1 });

// ─── Model ────────────────────────────────────────────────────────────────────

export const CallTranscript = model<ICallTranscript>(
  "CallTranscript",
  CallTranscriptSchema
);