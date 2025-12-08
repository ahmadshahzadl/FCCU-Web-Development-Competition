import mongoose, { Schema, Document } from 'mongoose';

export interface IAIConfig extends Document {
  systemPrompt: string;
  createdAt: Date;
  updatedAt: Date;
}

const AIConfigSchema: Schema = new Schema(
  {
    systemPrompt: {
      type: String,
      required: [true, 'System prompt is required'],
      trim: false, // Don't trim to preserve full prompt content
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one AI config document exists (singleton pattern)
AIConfigSchema.statics.getConfig = async function () {
  let config = await this.findOne();
  if (!config) {
    // Will be created by seeder
    throw new Error('AI configuration not found. Please run the seeder.');
  }
  return config;
};

export const AIConfig = mongoose.model<IAIConfig>('AIConfig', AIConfigSchema);

