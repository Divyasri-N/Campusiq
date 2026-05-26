import mongoose from "mongoose";

const placementSchema = new mongoose.Schema({
  avg: {
    type: Number,
    required: true,
  },

  highest: {
    type: Number,
    required: true,
  },

  rate: {
    type: Number,
    required: true,
  },
});

const collegeSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "Engineering",
        "Management",
        "Medical",
        "Arts & Science",
      ],
    },

    tier: {
      type: String,
      required: true,
      enum: ["Tier 1", "Tier 2"],
    },

    fees: {
      type: Number,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },

    placements: {
      type: placementSchema,
      required: true,
    },

    courses: [
      {
        type: String,
      },
    ],

    estd: {
      type: Number,
      required: true,
    },

    seats: {
      type: Number,
      required: true,
    },

    intake: {
      type: String,
      required: true,
    },

    cutoff: {
      type: Number,
      required: true,
    },

    logo: {
      type: String,
      default: "",
    },

    color: {
      type: String,
      default: "#2563eb",
    },

    reviews: {
      type: Number,
      default: 0,
    },

    accreditation: {
      type: String,
      default: "",
    },
  },

  {
    timestamps: true,
  }
);

const College = mongoose.model(
  "College",
  collegeSchema
);

export default College;