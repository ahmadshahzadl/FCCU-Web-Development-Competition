import { SystemConfig, ISystemConfig } from './SystemConfig.model';
import { NotFoundError, ValidationError } from '../../middleware/errorHandler';

export class SystemConfigService {
  // Get system configuration (singleton pattern)
  async getConfig(): Promise<ISystemConfig> {
    let config = await SystemConfig.findOne();
    
    if (!config) {
      // Create default config if none exists
      config = await SystemConfig.create({
        projectName: 'Campus Helper',
        allowedEmailDomains: [],
      });
    }
    
    return config;
  }

  // Update system configuration (admin only)
  async updateConfig(
    updateData: Partial<ISystemConfig>
  ): Promise<ISystemConfig> {
    let config = await SystemConfig.findOne();

    if (!config) {
      // Create config if it doesn't exist
      config = await SystemConfig.create({
        projectName: updateData.projectName || 'Campus Helper',
        logoUrl: updateData.logoUrl,
        allowedEmailDomains: updateData.allowedEmailDomains || [],
      });
    } else {
      // Update existing config
      if (updateData.projectName !== undefined) {
        config.projectName = updateData.projectName;
      }
      if (updateData.logoUrl !== undefined) {
        config.logoUrl = updateData.logoUrl;
      }
      if (updateData.allowedEmailDomains !== undefined) {
        // Validate domains format
        if (!Array.isArray(updateData.allowedEmailDomains)) {
          throw new ValidationError('allowedEmailDomains must be an array');
        }
        // Validate each domain starts with @
        const invalidDomains = updateData.allowedEmailDomains.filter(
          (domain) => !domain.startsWith('@')
        );
        if (invalidDomains.length > 0) {
          throw new ValidationError(
            `Invalid email domains: ${invalidDomains.join(', ')}. All domains must start with @`
          );
        }
        config.allowedEmailDomains = updateData.allowedEmailDomains;
      }
      
      await config.save();
    }

    return config;
  }

  // Add email domain (admin only)
  async addEmailDomain(domain: string): Promise<ISystemConfig> {
    if (!domain.startsWith('@')) {
      throw new ValidationError('Email domain must start with @');
    }

    const config = await this.getConfig();

    // Check if domain already exists
    if (config.allowedEmailDomains.includes(domain.toLowerCase())) {
      throw new ValidationError('Email domain already exists');
    }

    config.allowedEmailDomains.push(domain.toLowerCase());
    await config.save();

    return config;
  }

  // Remove email domain (admin only)
  async removeEmailDomain(domain: string): Promise<ISystemConfig> {
    const config = await this.getConfig();

    const domainIndex = config.allowedEmailDomains.indexOf(domain.toLowerCase());
    if (domainIndex === -1) {
      throw new NotFoundError('Email domain not found');
    }

    config.allowedEmailDomains.splice(domainIndex, 1);
    await config.save();

    return config;
  }

  // Validate email domain for manager-created users
  async validateEmailDomain(email: string): Promise<boolean> {
    const config = await this.getConfig();
    
    // If no domains are configured, allow any email (admin can create any)
    if (config.allowedEmailDomains.length === 0) {
      return true;
    }

    // Check if email ends with any allowed domain
    const emailLower = email.toLowerCase();
    return config.allowedEmailDomains.some((domain) =>
      emailLower.endsWith(domain.toLowerCase())
    );
  }
}

