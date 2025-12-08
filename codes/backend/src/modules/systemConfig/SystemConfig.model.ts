import mongoose, { Schema, Document } from 'mongoose';

export interface ISystemConfig extends Document {
  projectName: string;
  logoUrl?: string; // Stores base64 encoded image string (e.g., "data:image/png;base64,iVBORw0KG...")
  allowedEmailDomains: string[]; // Array of allowed email domains (e.g., ["@fccu.edu.pk", "@student.fccu.edu.pk"])
  createdAt: Date;
  updatedAt: Date;
}

const SystemConfigSchema: Schema = new Schema(
  {
    projectName: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      default: 'Campus Helper',
    },
    logoUrl: {
      type: String,
      trim: true,
    },
    allowedEmailDomains: {
      type: [String],
      default: [],
      validate: {
        validator: function (domains: string[]) {
          // Validate that all domains start with @
          return domains.every((domain) => domain.startsWith('@'));
        },
        message: 'All email domains must start with @',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one system config document exists
SystemConfigSchema.statics.getConfig = async function () {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({
      projectName: 'Campus Helper',
      allowedEmailDomains: [],
    });
  }
  return config;
};

// Indexes
SystemConfigSchema.index({ projectName: 1 });

export const SystemConfig = mongoose.model<ISystemConfig>(
  'SystemConfig',
  SystemConfigSchema
);

